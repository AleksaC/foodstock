// Amplify Configuration
// TODO: Load configuration from environment variables!
export const cognitoconfig = {
  cognito: {
    REGION: "eu-central-1",
    USER_POOL_ID: "eu-central-1_TlF0a7fko",
    APP_CLIENT_ID: "7d3ok998bhcuc9g9kdr9l9mp13",
  },
};

export const appsynconfig = {
  aws_appsync_graphqlEndpoint:
    "https://4snyp5xtfbgzvl6tfijhk2i4be.appsync-api.eu-central-1.amazonaws.com/graphql",
  aws_appsync_region: "eu-central-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
};
