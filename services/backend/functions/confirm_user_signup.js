const DynamoDB = require('aws-sdk/clients/dynamodb');
const DocumentClient = new DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
    if(event.triggerSource == 'PostConfirmation_ConfirmSignUp') {
      const { usersTableName } = process.env;

      const user = {
        username: event.userName,
        createdAt: new Date().toJSON()
      };

      await DocumentClient.put({
        TableName: usersTableName,
        Item: user
      }).promise();

      return event;
    }

    return event;
};