import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const tableName = process.env.productsTableName;
    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id
        }
    };

    const product = await dynamoDB.get(params);
    if (!product.Item) {
        throw new Error("Product not found.");
    }
    return product.Item;
});