import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async () => {
    /* Deleting a product only means it is currently archived,
    it is not ACTUALLY deleted from the database */
    const tableName = process.env.tableName;
    const params = {
        TableName: tableName,
        Key: {
            id: "7d641a24-0dc6-479c-83b0-5226e01f7ae5",
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