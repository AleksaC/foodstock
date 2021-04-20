import dynamoDB from "../libs/dynamodb";

export const handler = async (event) => {
    if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
        const usersTableName = process.env.UsersTableName;
        const user = {
            username: event.userName,
            createdAt: new Date().toJSON(),
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