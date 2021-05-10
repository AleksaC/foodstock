import React from "react";
import ReactDOM from "react-dom";
import "./base.css"; // base has to be imported before other css files!
import "./index.css";
import App from "./App";
import { Amplify } from "aws-amplify";
import { cognitoconfig, appsynconfig } from "./config";

// Amplify configuration, first basic configuration for integrating with Cognito
Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: cognitoconfig.cognito.REGION,
    userPoolId: cognitoconfig.cognito.USER_POOL_ID,
    userPoolWebClientId: cognitoconfig.cognito.APP_CLIENT_ID,
  },
});

Amplify.configure(appsynconfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
