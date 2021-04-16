import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    /* Deleting a product only means it is currently archived,
    it is not ACTUALLY deleted from the database */
    const tableName = process.env.tableName;
    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id,
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