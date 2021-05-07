import handler from "../libs/handler";
import dynamoDB from "../libs/dynamodb";

export const main = handler(async (event, context) => {
    const input = event.arguments.input;  // get the input
    const inputKeys = Object.keys(input);
    if (inputKeys.length === 1) { // only id was passed
        throw new Error("Only the id was passed in, update doesn't make sense!");
    }
    const tableName = process.env.productsTableName;
    let updateExpression = "SET ";
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    for (let i = 0; i < inputKeys.length; i++) {
        const key = inputKeys[i];
        if (key === "id") {
            // don't do anything with the id
            continue;
        }
        let value = input[key];
        let attributeName = "#" + key;
        let attributeValue = ":" + key;
        updateExpression += attributeName + " = " + attributeValue;
        if (i !== inputKeys.length - 1) {
            // add a minus to separate the attributes we want to update
            // if it's not the last attribute
            updateExpression += ", ";
        }
        expressionAttributeNames[attributeName] = key;  // the attribute
        expressionAttributeValues[attributeValue] = value;  // the value of the attribute
    }
    const params = {
        TableName: tableName,
        Key: {
            id: input.id, // id from the input
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
    };
    const res = await dynamoDB.update(params);
    // console.log(res);
    return res.Attributes;
});