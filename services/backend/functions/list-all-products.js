import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const tableName = process.env.tableName;
    const params = {
        TableName: tableName,
        ProjectionExpression: "#name, #category, #briefdesc, #status",
        ExpressionAttributeNames: {
            "#name": "name",
            "#category": "category",
            "#briefdesc": "briefDescription",
            "#status": "status"
        },
    };

    const result = await dynamoDB.scan(params);
    return {
        count: result.Count,
        items: result.Items
    };
});