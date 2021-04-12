import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async () => {
    const { tableName } = process.env;
    const params = {
        TableName: tableName,
        Key: {
            id: "7d641a24-0dc6-479c-83b0-5226e01f7ae5"
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