import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async () => {
    /* Deleting a product only means it is currently archived,
    it is not ACTUALLY deleted from the database */
    const tableName = process.env.tableName;
    const params = {
        TableName: tableName,
        Key: {
            id: "14b797fb-87a3-4f11-8fe3-c99e822896a6",
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":status": "archived"
        }
    };

    await dynamoDB.delete(params);
    return params.Key;
});