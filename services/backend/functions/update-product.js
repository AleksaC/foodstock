import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const data = event.body;
    const tableName = process.env.productsTableName;

    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.id,
        },
        UpdateExpression: "SET #briefdesc = :brief, #status = :status",
        ExpressionAttributeNames: {
            "#briefdesc": "briefDescription",
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":brief": data.briefDescription,
            ":status": data.status
        }
    };

    await dynamoDB.update(params);
    return params.Key;
});