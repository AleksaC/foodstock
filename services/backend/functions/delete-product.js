import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    /* Deleting a product only means set the status to archived,
    it is not ACTUALLY deleted from the database */
    const tableName = process.env.productsTableName;
    console.log(event);
    const params = {
        TableName: tableName,
        Key: {
            id: event.arguments.input.id,  // this is where the ID resides in the event object coming from GraphQL
        },
        UpdateExpression: "SET #status = :status",
        ExpressionAttributeNames: {
            "#status": "status"
        },
        ExpressionAttributeValues: {
            ":status": "archived"
        }
        // maybe add ReturnValues: "ALL_NEW" just like in update-product.js
    };

    await dynamoDB.delete(params);
    return params.Key;
});