import dynamoDB from "../libs/dynamodb";

export const handler = async (event) => {
    if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
        const usersTableName = process.env.usersTableName;
        /* event:
        {
            version: '1',
            region: 'eu-central-1',
            userPoolId: 'eu-central-1_TlF0a7fko',
            userName: '27ee5e22-e6d4-4451-a745-d68382d47ca5',
            callerContext: { awsSdkVersion: 'aws-sdk-unknown-unknown', clientId: null },
            triggerSource: 'PostConfirmation_ConfirmSignUp',
            request: {
                userAttributes: {
                    sub: '27ee5e22-e6d4-4451-a745-d68382d47ca5',
                    email_verified: 'false',
                    'cognito:user_status': 'CONFIRMED',
                    'cognito:email_alias': 'lukaboljevic.boljevic@gmail.com',
                    email: 'lukaboljevic.boljevic@gmail.com'
                }
            },
            response: {}
        }
        */
        const user = {
            username: event.userName,
            // local date; can change the format in the future if necessary
            createdAt: new Date().toISOString(),
        };

        const params = {
            TableName: usersTableName,
            Item: user,
        };

        await dynamoDB.insert(params);
        return event;
    }

    return event;
};