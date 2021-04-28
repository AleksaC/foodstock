const DynamoDBSdk = require("aws-sdk/clients/dynamodb");
import dynamoDB from "../libs/dynamodb";

export const handler = async (event) => {
    const tableName = process.env.productHistoryTableName;
    for (const record of event.Records) {
        let newImage, oldImage;
        let params = {
            TableName: tableName,
        };
        if (record.eventName === "INSERT") {
            newImage = DynamoDBSdk.Converter.unmarshall(record.dynamodb.NewImage);
            params["Item"] = {
                id: newImage.id,
                timestamp: new Date().toISOString(),
                changes: "Added product.",
            };
        }
        else if (record.eventName === "MODIFY") {
            newImage = DynamoDBSdk.Converter.unmarshall(record.dynamodb.NewImage);
            oldImage = DynamoDBSdk.Converter.unmarshall(record.dynamodb.OldImage);
            const changes = compare(oldImage, newImage);
            params["Item"] = {
                id: newImage.id,
                timestamp: new Date().toISOString(),
                changes: changes,
            };
        }
        else if (record.eventName === "REMOVE") {
            oldImage = DynamoDBSdk.Converter.unmarshall(record.dynamodb.OldImage);
            params["Item"] = {
                id: oldImage.id,
                timestamp: new Date().toISOString(),
                changes: "Removed product.",
            };
        }
        await dynamoDB.insert(params);
    }
};

const compare = (oldImage, newImage) => {
    let changes = "Changed ";
    let anythingHasChanged = false;
    const mapKeyToName = {
        // for example, if the brief description was changed,
        // I don't want (in the range key) to say, for example
        // 2021-04-26T20:15:55.942Z_Changed briefDescription to ...-
        // rather, I want it to say 2021-04-26T20:15:55.942Z_Changed brief description to ...
        briefDescription: "brief description",
        category: "category",
        // currentPrice.date is missing
        discountAmount: "discount amount",
        discountEndDate: "discount end date",
        discountPrice: "discounted price",
        discountStartDate: "discount start date",
        regularPrice: "regular price",
        additionalInformation: "additional information",
        alcohol: "alcohol percentage",
        allergens: "allergens list",
        countryOfOrigin: "country of origin",
        expiryDate: "expiration date",
        imports: "who imports the product",
        ingredients: "ingredients list",
        maintenance: "how to keep the product",
        producer: "producer",
        // images list is missing
        name: "name",
        nutriScore: "nutri score",
        carbs: "carbs value",
        energy: "energy value",
        fats: "fats value",
        fibers: "fibers value",
        proteins: "proteins value",
        salt: "salt value",
        saturatedFats: "saturated fats value",
        sugar: "sugar value",
        status: "status",
    };
    let keys = Object.keys(oldImage); // or newImage, doesn't matter
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key === "id" || key === "images") {
            // skip the id and images
            continue;
        }
        if (key === "currentPrice" || key === "description" || key === "nutritionalValues") {
            const objectKeys = Object.keys(oldImage[key]);
            for (let j = 0; j < objectKeys.length; j++) {
                const objectKey = objectKeys[j];
                if (objectKey === "date") {
                    // skip the currentPrice.date
                    continue;
                }
                let oldValue = oldImage[key][objectKey];
                let newValue = newImage[key][objectKey];
                if (oldValue !== newValue) {
                    anythingHasChanged = true;
                    if (oldValue === "") {
                        oldValue = "empty";
                    }
                    changes += mapKeyToName[objectKey] + " from " + oldValue + " to " + newValue + ", ";
                }
            }
        }
        else {
            // others like category, name, brief description etc
            let oldValue = oldImage[key];
            let newValue = newImage[key];
            if (oldValue !== newValue) {
                anythingHasChanged = true;
                if (oldValue === "") {
                    oldValue = "empty";
                }
                changes += mapKeyToName[key] + " from " + oldValue + " to " + newValue + ", ";
            }
        }
    }
    if (anythingHasChanged === false) {
        throw new Error("A change was asked for, but there were no changes");
    }
    else {
        changes = changes.slice(0, -2) + "."; // replace ,[ ] with a . (dot)
        // console.log(changes);
        return changes;
    }
};