import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const tableName = process.env.productsTableName;
    let entireResult = [];
    let params = {
        TableName: tableName,
    };
    let result = await dynamoDB.scan(params);
    result.Items.forEach((product) => entireResult.push(product));

    while (result.LastEvaluatedKey) {
        params["ExclusiveStartKey"] = result.LastEvaluatedKey;
        result = await dynamoDB.scan(params);
        result.Items.forEach((product) => entireResult.push(product));
    }
    return entireResult;
});