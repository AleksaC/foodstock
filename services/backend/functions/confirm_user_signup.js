const DynamoDB = require('aws-sdk/clients/dynamodb');
const DocumentClient = new DynamoDB.DocumentClient();

const { usersTableName } = process.env;

module.exports.handler = async (event) => {
    const name = event.request.userAttributes['name'];
    const user = {
      id: event.userName,
      name,
      createdAt: new Date().toJSON()
    };

    await DocumentClient.put({
      TableName: usersTableName,
      Item: user//,
      //ConditionExpression: 'attribute_not_exists(id)'
    }).promise();

    return event;
};