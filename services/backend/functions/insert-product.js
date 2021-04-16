import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";
import * as uuid from "uuid";
import namespaces from "../libs/namespaces";
// const soja = require("C:\\Users\\Luka\\Desktop\\soja.json");
// const item = soja[1];

export const main = handler(async (event, context) => {
    const item = event.body;
    const tableName = process.env.tableName;
    const productID = uuid.v5(item.product_id, namespaces.voliNamespace); // unique product ID
    const params = {
        TableName: tableName,
        Item: {
            id: productID,
            name: item.name,
            category: item.category_name,
            briefDescription: item.brief_product_description, // every product has this
            description: item.description || "",  // some items do not have a longer descr.
            status: "draft",
            nutriScore: "A",
            // images: item.image_urls,
            nutritionalValues: buildNutriValues(item),
            currentPrice: buildPriceInfo(item),
        }
    };

    await dynamoDB.insert(params);
    return params.Item;
});

/*eslint no-unused-vars: "warn"*/
/* I should copy these 2 functions to a separate file,
so I can use it in other lambda functions if necessary */
function buildNutriValues(item) {
    // Form the nutritional values
    let nutriValues = {
        energy: item.energy || "",
        fats: item.fats || -1,
        saturatedFats: item.saturated_fats || -1,
        proteins: item.proteins || -1,
        carbs: item.carbs || -1,
        sugar: item.sugar || -1,
        fibers: item.fiber || -1,
        salt: item.salt || -1
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
    }
    else {
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
        regularPrice: regPr
    };
    return price;
}