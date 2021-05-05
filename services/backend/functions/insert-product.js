import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";
import * as uuid from "uuid";
import builds from "../libs/build-product-info";

export const main = handler(async (event) => {
    const item = event.arguments.input;
    const tableName = process.env.productsTableName;
    let insertSuccess = false;
    while (!insertSuccess) {
        try {
            const productID = uuid.v4();
            const params = {
                TableName: tableName,
                Item: {
                    id: productID,
                    name: item.name,
                    category: item.category,
                    briefDescription: item.briefDescription,
                    status: item.status,
                    nutriScore: item.nutriScore,
                    images: item.images || [],
                    // new
                    store: "User created product",
                    storeID: "0",
                    productStoreID: "0",
                    barcode: item.barcode || "",
                    //
                    description: builds.buildDescription(item.description),
                    nutritionalValues: builds.buildNutriValues(item.nutritionalValues),
                    currentPrice: builds.buildPrice(item.currentPrice),
                },
                // maybe add ReturnValues: "ALL_NEW"; can't have ALL_NEW, just ALL_OLD which is useless
                ConditionExpression: "attribute_not_exists(id)",
            };
            await dynamoDB.insert(params);
            insertSuccess = true;
            return params.Item;
        }
        catch (e) {
            console.log(e.message);
        }
    }
});