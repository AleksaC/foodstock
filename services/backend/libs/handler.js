// This handler function is used as a wrapper around our lambda functions
// It takes in a lambda function as an argument

/*eslint no-trailing-spaces: "warn"*/
export default function handler(lambda) {
    return async function () {
        let body, statusCode;
        /* Note to self: currently it's not taking in any event or context,
        I'm just printing out the stuff to the console */

        try {  // Run the Lambda
            body = await lambda();
            statusCode = "All gucci";
        } catch (e) {
            body = { error: e.message };
            statusCode = "Shit";
        }
        console.log(body);

        // Return HTTP response
        return {
            statusCode,  // 200 if it's successful, 500 if it's not
            // body: JSON.stringify(body, null, 2),
        };
    };
}