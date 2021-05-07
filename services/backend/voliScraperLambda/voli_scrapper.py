import json
import os
import itertools
import time
import traceback
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as cond
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
from product import Product

DEBUG = True

def scrape_categories(url, driver):
    driver.get(url)

    wait = WebDriverWait(driver, 10)
    
    product_categories = wait.until(cond.presence_of_all_elements_located((By.CLASS_NAME, "category-item")))
    urls_list = []
    category_names = []

    for i, category in enumerate(product_categories):
        # Super-category name
        category_label = category.find_element_by_class_name("category-label").get_attribute("textContent")
        print(category_label)
        small_category = category.find_elements_by_class_name("group-item")
        big_category = category.find_elements_by_class_name("subcategory-item")

        current_urls = []
        names = []

        # For category with no subcategories, go straight to the main category, structure of products is the same
        if len(small_category) == 0:
            current_urls = [item.find_elements_by_css_selector("a")[0].get_attribute("href") for item in big_category]
            names = [item.find_elements_by_css_selector("a")[0].get_attribute("textContent") for item in big_category]

        # Add subcategories
        else:
            current_urls = [item.find_element_by_css_selector("a").get_attribute("href") for item in small_category]
            names = [item.find_element_by_css_selector("a").get_attribute("textContent") for item in small_category]
        
        urls_list.append(current_urls)
        category_names.append(names)

    for i, url_list in enumerate(urls_list):
        current_products = []
        for j, sub_url in enumerate(url_list):
            scrape_subcategory(sub_url, driver, category_names[i][j])

def scrape_subcategory(url, driver, category_name, batch_size = 25):
    """
    Scrapes the products of the given subcategory, and writes the result to a JSON file
    in batches of batch_size size. 
    """

    counter = 0
    total_products = 0

    driver.get(url)
    custom_wait = WebDriverWait(driver, 10, ignored_exceptions = (StaleElementReferenceException))

    # Some categories require adult confirmation in order to access the products page (alchohol, etc.)
    try:
        adult_buttons = WebDriverWait(driver, 5).until(cond.presence_of_element_located((By.CLASS_NAME, "adult-buttons")))
        verify_link = adult_buttons.find_elements_by_css_selector("a")[0]
        verify_link.click()
    
    except (NoSuchElementException, TimeoutException) as e:
        pass

    prod_card = WebDriverWait(driver, 10).until(cond.presence_of_element_located((By.CLASS_NAME, "categories-cards")))
    products = prod_card.find_elements_by_class_name("product-card")
    product_urls = [product.find_element_by_css_selector("a").get_attribute("href") for product in products]
    product_objects = []

    print("Scraping category {}.".format(category_name))
    start = datetime.now()

    # Better exception handling ?
    for j, product_url in enumerate(product_urls):
        try:
            print("Scraping object from {}".format(product_url))
            parsed_object = scrape_object(product_url, driver, category_name)
            print("Done scraping object from {}".format(product_url))
            print()
            product_objects.append(parsed_object)

            if len(product_objects) == batch_size:
                print("Writing batch {} for category {} to output JSON.".format(counter, category_name))
                write_batch(product_objects, category_name, counter)
                print("Finished writing batch")
                print()
                counter += 1
                total_products += len(product_objects)
                # Empty the written batch
                product_objects = []

        except Exception as e:
            print("Exception ocurred during scraping of an object.")
            print("Associated category: {}".format(category_name))
            print("Associated URL: {}".format(product_url))
            print(e, end = "\n")
            traceback.print_tb(e.__traceback__)
    
    if len(product_objects) > 0:
        print("Writing batch {} for category {} to output JSON.".format(counter + 1, category_name))
        write_batch(product_objects, category_name, counter)
        total_products += len(product_objects)
        print("Finished writing batch")
        print()

    print("Finished scraping {} category. Number of products scraped: {}".format(category_name, total_products))
    end = datetime.now()
    print("Time spent scraping: {}".format(end - start))

    filepath = os.path.join(os.environ["JSON_PATH"], "{}.json".format(category_name))
 
    print("Category {} successfully written to a JSON file.".format(category_name))
    print()

def scrape_object(url, driver, category_name):
    driver.get(url)
    wait = WebDriverWait(driver, 2)
    res = Product()

    # Save the product url, used for calculating the DynamoDB partition key of a single product
    splitted_url = url.split("/")
    product_id = splitted_url[len(splitted_url) - 1]
    res.product_id = product_id

    # Product store attribute
    res.store = "Voli"

    # Category name
    res.category_name = category_name

    # Name of the product
    product_info = wait.until(cond.presence_of_element_located((By.CLASS_NAME, "product-info")))
    name = product_info.find_element_by_css_selector("h4").text
    res.name = name

     # Brief product description scraping, if it exists
    try:
        brief_description = product_info.find_element_by_css_selector("p").text
        res.brief_product_description = brief_description
    except Exception as e:
        pass

    # Price
    price = wait.until(cond.presence_of_element_located((By.CLASS_NAME, "price")))
    current_price = price.find_element_by_css_selector(".new-price").text
    # Discount, if it exists
    try:
        old_price = price.find_element_by_css_selector(".old-price").text
        price_info = {"discounted_price": current_price.split()[0], "old_price": old_price.split()[0]}
    except Exception as e:
        price_info = {"current_price": current_price.split()[0]}
    
    res.price_info = price_info

    # Discount info, if it exists
    try:
        discount_content = wait.until(cond.presence_of_element_located((By.CLASS_NAME, "discount-text")))
        discount_content = discount_content.text.split()
        discount_info = {"discount": discount_content[1], "duration": discount_content[4]}
        res.discount_info = discount_info

    except Exception as e:
        pass

    # Scraping nutritional values, if they exist
    try:
        cards = wait.until(cond.presence_of_all_elements_located((By.CLASS_NAME, "mini-card")))

        for i, card in enumerate(cards):
            nutr_value = card.find_element_by_css_selector(".nutr-value").text
            res.add_attribute(i, nutr_value)
    except Exception as e:
        pass

    # Product description scraping, if it exists
    try:
        tab = wait.until(cond.presence_of_element_located((By.ID, "tab2")))
        blocks = tab.find_elements_by_css_selector(".span-block")
        description = {}

        for block in blocks:
            key = block.find_element_by_css_selector(".dark").get_attribute("textContent")
            value = block.find_element_by_css_selector(".light").get_attribute("textContent")
            description[key] = value

        res.description = description
    except Exception as e:
        print("Entered")
        pass

    # Image urls, if they exist
    try:
        image_containers = wait.until(cond.presence_of_all_elements_located((By.CLASS_NAME, "drift-demo-trigger")))
        image_urls = set(item.get_attribute("src") for item in image_containers)
        image_urls = [item for item in image_urls]
        res.image_urls = image_urls
    except Exception as e:
        pass

    return res.__dict__

"""
TODO: For now, each batch is written to a seperate file.
      Try writing everything into a single file.
"""
def write_batch(product_objects, category_name, counter):
    json_path = os.environ["JSON_PATH"]
    
    if json_path == "":
        filepath = r"{}_{}.json".format(category_name, counter)
    
    else:
        filepath = r"{}\{}_{}.json".format(os.environ["JSON_PATH"], category_name, counter)

    with open(filepath, "w+", encoding = "utf-8") as f:
        json.dump(product_objects, f, ensure_ascii = False, indent = 4)

def main(event, context):
    options = Options()
    # options.headless = True

    binary_location = "/opt/bin/headless-chromium"

    options.binary_location = binary_location

    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--single-process")
    options.add_argument("--disable-dev-shm-usage")

    # Surpress logging
    options.add_experimental_option("excludeSwitches", ["enable-logging"])
    chromedriver_location = "/opt/bin/chromedriver"
    driver = webdriver.Chrome(chromedriver_location, options = options)

    driver.set_page_load_timeout(10) 

    if DEBUG:
        driver.get("https://www.google.com/")
        # body = f"Headless Chrome Initialized, Page title: {driver.title}"
        # print(scrape_object("https://ecommprod.voli.me/proizvod/2365", driver, "whatever"))

    else:
        # Scrapes all categories of products
        home_url = "https://voli.me/"
        scrape_categories(home_url, driver)

    driver.close()
    driver.quit()

    response = {
        "statusCode": 200,
        "body": "Success!"
    }

    return response