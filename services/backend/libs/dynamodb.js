import AWS from "aws-sdk";

const client = new AWS.DynamoDB.DocumentClient();
/* Here, we are creating a DynamoDB document client
that we will use to send write requests or require
reads from our table(s).
(document client is used because it's syntactically easier
than the regular DynamoDB client.) */
export default {
    insert: (params) => client.put(params).promise(), // insert a single item
    update: (params) => client.update(params).promise(), // update a single item
    delete: (params) => client.update(params).promise(), // "delete" a single item, not a mistake that I'm calling update
    get: (params) => client.get(params).promise(), // retrieve a single item
    scan: (params) => client.scan(params).promise() // get all the products
};