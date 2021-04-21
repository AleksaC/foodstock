// This handler function is used as a wrapper around our lambda functions
// It takes in a lambda function as an argument

export default function handler(lambda) {
    return async function (event, context) {
        return await lambda(event, context);
    };
}