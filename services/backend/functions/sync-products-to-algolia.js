const DynamoDB = require('aws-sdk/clients/dynamodb');
import initProductsIndex from "../libs/algolia";
const middy = require('@middy/core');
const ssm = require('@middy/ssm');

const stage = process.env.stage;
export const handler = middy(async (event, context) => {
    const index = await initProductsIndex(context.ALGOLIA_APP_ID, context.ALGOLIA_ADMIN_KEY, stage);
    for (const record of event.Records) {
        if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
            const product = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
            product.objectID = product.id;
            await index.saveObjects([product]);
        } else if (record.eventName === "REMOVE") {
            const product = DynamoDB.Converter.unmarshall(record.dynamodb.OldImage);
            await index.deleteObjects([product.id]);
        }
    }
}).use(ssm({
        cacheExpiry: 5 * 60 * 1000,  // 5 minutes
        fetchData: {
            ALGOLIA_APP_ID: `/foodstock/${stage}/algoliaAppID`,
            ALGOLIA_ADMIN_KEY: `/foodstock/${stage}/algoliaAdminKey`
        },
        setToContext: true,
        awsSdkOptions: { region: 'eu-central-1' }
    }));