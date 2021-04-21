const fs = require('fs');
const files = fs.readdirSync("products"); // folder products must be in the same directory as this file
const uuid = require("uuid");
const tableName = "dev-infrastructure-dynamodb-Products229621C6-HOUEPHVSHL34";
const voliNamespace = "db03ea1b-1f65-4882-85ed-5b73310b089a";
const AWS = require("aws-sdk");
AWS.config.update({
    region: "eu-central-1",
});
const dynamoDB = new AWS.DynamoDB.DocumentClient();

function buildNutriValues(item) {
    // Form the nutritional values
    let nutriValues = {
        energy: item.energy || "",
        fats: item.fats || 0,
        saturatedFats: item.saturated_fats || 0,
        proteins: item.proteins || 0,
        carbs: item.carbs || 0,
        sugar: item.sugar || 0,
        fibers: item.fiber || 0,
        salt: item.salt || 0,
    };
    return nutriValues;
}

function buildPriceInfo(item) {
    // Form the price information
    let today = new Date().toISOString().slice(0, 10); // https://stackoverflow.com/a/35922073
    let dscAmt, dscSD, dscED, dscPr, regPr; // they correspond, in order, to the names of keys in the price object
    if ("discount_info" in item) {
        dscAmt = item.discount_info.discount.slice(0, -1); // remove the %
        let dates = item.discount_info.duration.split("-");
        dscSD = dates[0]; // start date of discount
        dscED = dates[1]; // end date of discount
        dscPr = item.price_info.discounted_price.slice(0, -1); // remove the euro sign
        regPr = item.price_info.old_price.slice(0, -1);
    } else {
        dscAmt = dscSD = dscED = dscPr = "";
        regPr = item.price_info.current_price.slice(0, -1);
    }
    let price = {
        // store: "Voli",
        date: today,
        discountAmount: dscAmt,
        discountStartDate: dscSD,
        discountEndDate: dscED,
        discountPrice: dscPr,
        regularPrice: regPr,
    };
    return price;
}

function buildDescription(item) {
    // Form the description attribute
    let description;
    if (!item.description) {
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
            maintenance: item.description["Čuvanje"],
            countryOfOrigin: item.description["Zemlja"],
            producer: item.description["Proizvođač"],
            imports: item.description["Uvozi"],
            ingredients: item.description["Sastojci"],
            expiryDate: item.description["Rok upotrebe"],
            allergens: item.description["Alergeni"],
            alcohol: item.description["Alkohol"],
            additionalInformation: item.description["Dodatne informacije"],
        };
    }
    return description;
}

const path = __dirname + "\\products\\";  // this is where the JSON files live

const main = async () => {
    for (const file of files) {
        const products = require(path + file);  // get the array in the JSON file
        let allParams = [];

        for (const product of products) {
            let productID = uuid.v5(product.product_id, voliNamespace);
            let params = {
                PutRequest: {
                    Item: {
                        id: productID,
                        name: product.name,
                        category: product.category_name,
                        briefDescription: product.brief_product_description, // every product has this
                        status: "published",
                        nutriScore: "A",
                        images: product.image_urls || [], // just in case
                        description: buildDescription(product),
                        nutritionalValues: buildNutriValues(product),
                        currentPrice: buildPriceInfo(product),
                    }
                }
            };
            allParams.push(params);
        }
        // added all the 25 products to the params list, now batch write that bitch
        let batch = {
            RequestItems: {}
        };
        batch.RequestItems[tableName] = allParams;
        const res = await dynamoDB.batchWrite(batch).promise();
        // in the later stages, I have to actually process these, now I'm adding 40 items so it shouldn't break
        console.log("Any unprocessed items?", res.UnprocessedItems);
    }
}

main().then(x => console.log("All done!"));
