import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const tableName = process.env.productsTableName;
    console.log(event);
    const params = {
        TableName: tableName,
        Key: {
            id: event.arguments.id  // this is where the ID resides in the event object
        }
    };

    const product = await dynamoDB.get(params);
    if (!product.Item) {
        throw new Error("Product not found.");
    }
    return product.Item;
});