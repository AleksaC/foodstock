import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";
import * as uuid from "uuid";
const fs = require("fs");

// const cok = require("C:\\Users\\Luka\\Desktop\\voli_json\\Topla čokolada");
// const item = cok[0];
// const tel = require("C:\\Users\\Luka\\Desktop\\voli_json\\Teletina");
// const item = tel[0];
let addedItems = [];
const vino = require("C:\\Users\\Luka\\Desktop\\voli_json\\Vino");
const item = vino[21];
// console.log(item.price_info.current_price.slice(0, -1));
// let nutriValues = {
//     energy: item.energy || "",
//     proteins: item.proteins || -1
// }
// console.log(new Date().toISOString().slice(0, 10));
// console.log(item.discount_info.duration.split('-'));

export const main = handler(async () => {
    const tableName = process.env.tableName;

    const productID = uuid.v4(); // unique product ID
    // maybe add condition expression (attribute_not_exists or smt)
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
            nutritionalValues: buildNutriValues(item),
            currentPrice: buildPriceInfo(item),
        }
    };

    await dynamoDB.insert(params);
    // let newItem = {
    //     ...item,
    //     id: productID
    // };
    // addedItems.push(newItem);
    // writeToFile();
    return params.Item;
});

/*eslint no-unused-vars: "warn"*/
function writeToFile() {
    fs.writeFile("C:\\Users\\Luka\\Desktop\\AWS projekat\\openup-backend\\services\\backend" + "\\TEST.txt", JSON.stringify(addedItems, null, 4), err => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("New item successfully saved.");
    });
}

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
/* I should copy these 2 functions to a separate file,
so I can use it in other lambda functions if necessary */
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
        store: "Voli",
        date: today,
        discountAmount: dscAmt,
        discountStartDate: dscSD,
        discountEndDate: dscED,
        discountPrice: dscPr,
        regularPrice: regPr
    };
    return price;
}