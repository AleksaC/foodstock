// This handler function is used as a wrapper around our lambda functions
// It takes in a lambda function as an argument

/*eslint no-trailing-spaces: "warn"*/
export default function handler(lambda) {
    return async function (event, context) {
        let body, statusCode;

        try {  // Run the Lambda
            body = await lambda(event, context);
            statusCode = 200;
        } catch (e) {
            body = { error: e, message : e.message };
            statusCode = 500;
        }
        
        // Return HTTP response
        return {
            statusCode,  // 200 if it's successful, 500 if it's not
            body: JSON.stringify(body)
        };
    };
}