import axios from "axios";
import dotenv  from "dotenv";
import { writeProducts } from "../fill-database";

const vars = dotenv.config();
const categoryLowerBound = 3;
const categoryUpperBound = 19;
const baseURL = "https://www.ideaonline.me/v2";
const imageBaseURL = "https://www.ideaonline.me/";
const categoriesURL = "https://www.ideaonline.me/v2/categories.json";
const categoryURL = "https://www.ideaonline.me/v2/categories/";

const fetchCategories = async function(url) {
    let response = await axios.get(url);
    return response.data.slice(categoryLowerBound, categoryUpperBound);
}

const scrapeProduct = function(product, categoryName) {
    let image_urls = [];
    let price_info = {};
    
    if(product.images) {
        for(const imageObject of product.images) {
            if(imageObject.image_n) {
                image_urls.push(imageBaseURL + imageObject.image_n);
            }

            if(imageObject.image_s) {
                image_urls.push(imageBaseURL + imageObject.image_s);
            }
            
            if(imageObject.image_m) {
                image_urls.push(imageBaseURL + imageObject.image_m);
            }

            if(imageObject.image_l) {
                image_urls.push(imageBaseURL + imageObject.image_l);
            }
        }
    }

    let currentProduct = {
        product_id: product.id,
        name: product.name,
        category_name: categoryName,
        store: "IDEA",
        barcodes: product.barcodes,
        image_urls: image_urls
    }

    if(product.offer) {
        price_info.discounted_price = product.price.formatted_price;
        price_info.old_price = product.offer.original_price.formatted_price;
        
        let from = product.offer.start_on;
        let to = product.offer.end_on;

        let discount_info = {
            discount: product.offer.offer_percentage + "%",
            duration: from + "-" + to
        };

        currentProduct.discount_info = discount_info;
    }

    else {
        price_info.current_price = product.price.formatted_price;
    }

    currentProduct.price_info = price_info;

    return currentProduct;
}

/* 
Write resulting products to JSON locally, not done in case of periodic scraping.
const writeToJson = function(productList, categoryName, counter) {
    let filepath = path.join(vars.parsed.JSON_PATH, `${categoryName}_${counter}.json`);
    fs.writeFileSync(filepath, JSON.stringify(productList, null, "\t"));
} */

const traverseCategories = async function(categoryID, batch_size = 25) {
    const response = await axios.get(`${categoryURL}${categoryID}.json`);
    const category = response.data;

    if(!category.children || category.children.length === 0) {
        await writeCategory(category, batch_size);
    }

    else {
        for(const childCategory of category.children) {
            await traverseCategories(childCategory.id, batch_size);
        }
    }
}

function sleep(delay) {
    return new Promise(function(resolve) {
        setTimeout(resolve, delay);
    });
}

const writeCategory = async function(category, batch_size) {
    let counter = 0;
    const targetEndpoint = baseURL + category.products_path + ".json";
    const response = await axios.get(targetEndpoint);
    const numberOfProducts = response.data._page.item_count;
    let productList = [];
            
    for(let i = 1; i <= Math.ceil(numberOfProducts / 25); i++) {
        const productResponse = await axios.get(`https://www.ideaonline.me/v2/categories/${category.id}/products?per_page=25&page=${i}&filter[sort]=soldStatisticsDesc`
        , { headers: 
                    {
                        Accept: "application/json"
                    }
        });

        const products = productResponse.data.products;
        for(const product of products) {
            let currentProduct = scrapeProduct(product, category.name);
            productList.push(currentProduct);
            
            if(productList.length === batch_size) {
                await writeProducts(productList);
                await sleep(1200); // simulating synchronous sleep
                counter++;
                productList = []
            }
        }
    }

    if(productList.length > 0) {
        await writeProducts(productList);
        await sleep(1200); // simulating synchronous sleep
    }
}

export const scrapeIdea = async function() {
    // Make the resulting JSON directory if it does not exist
    // Done for scraping products locally.
    /* if(!fs.existsSync(vars.parsed.JSON_PATH)) {
        fs.mkdirSync(vars.parsed.JSON_PATH);
    } */
    /*
    Currently we're simulating synchronous sleep and that's how we slow down the scraping
    If the billing goes up, look into giving some Read/Write capacity units
    Also, for now the scraping and writing works but if it doesn't turn out to be good/optimal
    or if it's taking too long, look into changing the approach.

    The other approach might be scanning the existing products from the database and calling the
    API for those products, and see if there were any changes. If there aren't any, just skip that
    product, otherwise save the scrape product for batch writing later. This can reduce the
    total number of batch writes and the total number of scans.
    */

    const categories = await fetchCategories(categoriesURL);
    for (const category of categories) {
        // console.time();
        await traverseCategories(category.id);
        // console.timeEnd();
        // Remove the break after we are ready to insert thousands of products
        break;
    }
}