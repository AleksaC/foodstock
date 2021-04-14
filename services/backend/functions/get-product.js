import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async () => {
    const { tableName } = process.env;
    const params = {
        TableName: tableName,
        Key: {
            id: "14b797fb-87a3-4f11-8fe3-c99e822896a6"
        },
        ProjectionExpression: "#name, #category, #price",
        ExpressionAttributeNames: {
            "#name": "name",
            "#category": "category",
            "#price": "currentPrice"
        }
    };

    const product = await dynamoDB.get(params);
    return product.Item;
});