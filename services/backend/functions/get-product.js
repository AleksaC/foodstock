import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const { tableName } = process.env;
    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id
        },
        ProjectionExpression: "#name, #category, #price",
        ExpressionAttributeNames: {
            "#name": "name",
            "#category": "category",
            "#price": "currentPrice"
        }
    };

    const product = await dynamoDB.get(params);
    if (!product.Item) {
        throw new Error("Product not found.");
    }
    return product.Item;
});