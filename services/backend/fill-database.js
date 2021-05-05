const fs = require("fs");
const files = fs.readdirSync("products"); // folder products must be in the same directory as this file
const uuid = require("uuid");
const constants = require("./libs/fill-db-constants");

const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-central-1",
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

function buildNutriValues(product) {
    // Form the nutritional values
    let nutriValues = {
        energy: product.energy || "",
        fats: product.fats || 0,
        saturatedFats: product.saturated_fats || 0,
        proteins: product.proteins || 0,
        carbs: product.carbs || 0,
        sugar: product.sugar || 0,
        fibers: product.fiber || 0,
        salt: product.salt || 0,
    };
    return nutriValues;
}

function buildPrice(product) {
    // Form the price information
    let today = new Date();
    let dscAmt, dscSD, dscED, dscPr, regPr; // they correspond, in order, to the names of keys in the price object

    if ("discount_info" in product) {
        dscAmt = product.discount_info.discount.slice(0, -1); // remove the %
        let dates = product.discount_info.duration.split("-");
        dscSD = dates[0] + today.getFullYear() + "."; // start date of discount
        dscED = dates[1] + today.getFullYear() + "."; // end date of discount
        dscPr = product.price_info.discounted_price.slice(0, -1); // remove the euro sign
        if (product.store.toLowerCase() === "voli") {
            regPr = product.price_info.old_price.slice(0, -1);
        }
        else { // idea
            regPr = product.price_info.old_price.slice(0, -2);
        }
    } else {
        dscAmt = dscSD = dscED = dscPr = "";
        if (product.store.toLowerCase() === "voli") {
            regPr = product.price_info.current_price.slice(0, -1);
        }
        else { // idea
            regPr = product.price_info.current_price.slice(0, -2);
        }
    }
    let price = {
        date: formatDate(today),  // so the date format is consistent throughout the product
        discountAmount: dscAmt,
        discountStartDate: dscSD,
        discountEndDate: dscED,
        discountPrice: dscPr,
        regularPrice: regPr,
    };
    return price;
}

function buildDescription(product) {
    // Form the description attribute
    let description;
    if (!product.description) {
        description = {
            maintenance: "",
            countryOfOrigin: "",
            producer: "",
            imports: "",
            ingredients: "",
            expiryDate: "",
            allergens: "",
            alcohol: "",
            additionalInformation: "",
        };
    } else {
        description = {
            maintenance: product.description["Čuvanje"],
            countryOfOrigin: product.description["Zemlja"],
            producer: product.description["Proizvođač"],
            imports: product.description["Uvozi"],
            ingredients: product.description["Sastojci"],
            expiryDate: product.description["Rok upotrebe"],
            allergens: product.description["Alergeni"],
            alcohol: product.description["Alkohol"],
            additionalInformation: product.description["Dodatne informacije"],
        };
    }
    return description;
}

function parseStore(store) {
    switch (store.toLowerCase()) {
        case "voli":
            return constants.voliNamespace;
        case "idea":
            return constants.ideaNamespace;
        default:
            return "0";
    }
}

function parseBarcode(barcodes) {
    if (!barcodes) {
        // voli
        return "";
    }
    // idea, barcodes are a list of strings
    return barcodes[0];
}

function formatDate(date) {
    // Format the date
    // https://stackoverflow.com/a/30272803
    let formatted =
        ("0" + date.getDate()).slice(-2) + "." +
        ("0" + (date.getMonth() + 1)).slice(-2) + "." +
        date.getFullYear() + ".";
    return formatted;
}

const path = __dirname + "\\products\\"; // this is where the JSON files live

const main = async () => {
    for (const file of files) {
        const products = require(path + file); // get the array in the JSON file
        let allParams = [];

        for (const product of products) {
            let productID = uuid.v4();
            const storeNamespace = parseStore(product.store);
            let params = {
                PutRequest: {
                    Item: {
                        id: productID,
                        name: product.name,
                        category: product.category_name,
                        briefDescription: product.brief_product_description || "",                        status: "published",
                        nutriScore: "E",
                        images: product.image_urls || [], // just in case
                        // new
                        store: product.store.toLowerCase(),
                        storeID: storeNamespace, // returns the namespace of the store (acts as the ID)
                        productStoreID: uuid.v5(product.product_id.toString(), storeNamespace), // for synchronizing changes later
                        barcode: parseBarcode(product.barcodes),
                        // 
                        description: buildDescription(product),
                        nutritionalValues: buildNutriValues(product),
                        currentPrice: buildPrice(product),
                    },
                },
            };
            allParams.push(params);
        }
        // added all the 25 products to the params list, now batch write
        let batch = {
            RequestItems: {},
        };
        batch.RequestItems[constants.productsTable] = allParams;
        const res = await dynamoDB.batchWrite(batch).promise();
        // I have to process the unprocessed items later on
        console.log("Any unprocessed items?", res.UnprocessedItems);
    }
};

main().then((x) => console.log("All done!"));