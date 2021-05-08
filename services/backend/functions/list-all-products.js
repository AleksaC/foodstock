import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const tableName = process.env.productsTableName;
    const params = {
        TableName: tableName
    };
    // I will have to modify this to work with LastEvaluatedKey
    const result = await dynamoDB.scan(params);
    return result.Items;
});