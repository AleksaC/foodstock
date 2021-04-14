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

    // Cloudformation outputs to be cross-referenced in serverless.yml file.

    // Table Name
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
  }
}