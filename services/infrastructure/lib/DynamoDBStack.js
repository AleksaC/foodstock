import { CfnOutput } from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as sst from "@serverless-stack/resources";

export default class DynamoDBStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const app = this.node.root;

    const table = new dynamodb.Table(this, "Products", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES
    });
    //TableName
    new CfnOutput(this, "TableName", {
      value: table.tableName,
      exportName: app.logicalPrefixedName("TableName"),
    });

    // Table ARN
    new CfnOutput(this, "TableArn", {
      value: table.tableArn,
      exportName: app.logicalPrefixedName("TableArn"),
    });

    // Stream ARN
    new CfnOutput(this, "StreamArn", {
      value: table.tableStreamArn,
      exportName: app.logicalPrefixedName("StreamArn")
    });

    //Users table
    const tableUsers = new dynamodb.Table(this, "Users", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "username", type: dynamodb.AttributeType.STRING }
    });
    //table name
    new CfnOutput(this, "usersTableName", {
      value: tableUsers.tableName,
      exportName: app.logicalPrefixedName("usersTableName"),
    });

    // Table ARN
    new CfnOutput(this, "usersTableArn", {
      value: tableUsers.tableArn,
      exportName: app.logicalPrefixedName("usersTableArn"),
    });

    // Cloudformation outputs to be cross-referenced in serverless.yml file.

    
  }
}