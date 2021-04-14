import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async () => {
    /* Note: there is no event or context currently, most of
    the stuff is hard coded for testing purposes */
    const tableName = process.env.tableName;
    let price = {
        store: "Voli",
        date: new Date().toISOString().slice(0, 10),
        discountAmount: "changed discount amount",
        discountStartDate: "changed discount start date",
        discountEndDate: "changed discount end date",
        discountPrice: "changed discount price",
        regularPrice: "20000.49"
    };
    let changedDesc = "Izmijenjena deskripcija proizvoda";

    const params = {
        TableName: tableName,
        Key: {
            id: "14b797fb-87a3-4f11-8fe3-c99e822896a6",
        },
        UpdateExpression: "SET #briefdesc = :brief, #currPrice = :price, #tags = :tags",
        ExpressionAttributeNames: {
            "#briefdesc": "briefDescription",
            "#currPrice": "currentPrice",
            "#tags": "tags"
        },
        ExpressionAttributeValues: {
            ":brief": changedDesc,
            ":price": price,
            ":tags": [
                "Adding a new attribute",
                123,
                "its attribute value will be a list for example"
            ]
        }
    };

    await dynamoDB.update(params);
    return params.Key;
});