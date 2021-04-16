import DynamoDBStack from "./DynamoDBStack";

export default function main(app) {
  new DynamoDBStack(app, "dynamodb");
}


