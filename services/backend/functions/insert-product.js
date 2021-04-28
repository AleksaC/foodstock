import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";
import * as uuid from "uuid";
import namespaces from "../libs/namespaces";
import builds from "../libs/build-product-info";

export const main = handler(async (event, context) => {
    const item = event.body;
    const tableName = process.env.productsTableName;
    const productID = uuid.v5(item.product_id, namespaces.voliNamespace); // unique product ID
    const params = {
        TableName: tableName,
        Item: {
            id: productID,
            name: item.name,
            category: item.category_name,
            briefDescription: item.brief_product_description, // every product has this
            status: "draft",
            nutriScore: "A",
            images: item.image_urls,
            description: builds.buildDescription(item),
            nutritionalValues: builds.buildNutriValues(item),
            currentPrice: builds.buildPrice(item),
        },
        // maybe add ReturnValues: "ALL_NEW"; can't have ALL_NEW, just ALL_OLD which is useless
    };

    await dynamoDB.insert(params);
    return params.Item;
});