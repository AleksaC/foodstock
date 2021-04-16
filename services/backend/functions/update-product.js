import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const data = event.body;
    const tableName = process.env.tableName;
    // let price = {
    //     store: "Voli",
    //     date: new Date().toISOString().slice(0, 10),
    //     discountAmount: "changed discount amount",
    //     discountStartDate: "changed discount start date",
    //     discountEndDate: "changed discount end date",
    //     discountPrice: "changed discount price",
    //     regularPrice: "20000.49"
    // };
    // let changedDesc = "Izmijenjena deskripcija proizvoda";

    const params = {
        TableName: tableName,
        Key: {
            id: event.pathParameters.productID,
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