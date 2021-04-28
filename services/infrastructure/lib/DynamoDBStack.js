import { CfnOutput } from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as sst from "@serverless-stack/resources";

export default class DynamoDBStack extends sst.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const app = this.node.root;

        // Products table
        const table = new dynamodb.Table(this, "Products", {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
            stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
        });

        // Users table
        const tableUsers = new dynamodb.Table(this, "Users", {
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: "username",
                type: dynamodb.AttributeType.STRING,
            },
        });

        // Product changes table (i.e. the history of the changes)
        // const tableHistory = new dynamodb.Table(this, "ProductHistory", {
        //     billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        //     partitionKey: {
        //         name: "id",
        //         type: dynamodb.AttributeType.STRING,
        //     },
        //     sortKey: {
        //         name: "timestamp",
        //         type: dynamodb.AttributeType.STRING,
        //     },
        // });

        // Cloudformation outputs to be cross-referenced in serverless.yml file.

        // Products Table Name
        new CfnOutput(this, "ProductsTableName", {
            value: table.tableName,
            exportName: app.logicalPrefixedName("ProductsTableName"),
        });

        // Products Table ARN
        new CfnOutput(this, "ProductsTableArn", {
            value: table.tableArn,
            exportName: app.logicalPrefixedName("ProductsTableArn"),
        });

        // Products Stream ARN
        new CfnOutput(this, "ProductsStreamArn", {
            value: table.tableStreamArn,
            exportName: app.logicalPrefixedName("ProductsStreamArn"),
        });

        // Users Table Name
        new CfnOutput(this, "UsersTableName", {
            value: tableUsers.tableName,
            exportName: app.logicalPrefixedName("UsersTableName"),
        });

        // Users Table ARN
        new CfnOutput(this, "UsersTableArn", {
            value: tableUsers.tableArn,
            exportName: app.logicalPrefixedName("UsersTableArn"),
        });

        // Product History Table Name
        // new CfnOutput(this, "ProductHistoryTableName", {
        //     value: tableHistory.tableName,
        //     exportName: app.logicalPrefixedName("ProductHistoryTableName"),
        // });

        // // Product History Table ARN
        // new CfnOutput(this, "ProductHistoryTableArn", {
        //     value: tableHistory.tableArn,
        //     exportName: app.logicalPrefixedName("ProductHistoryTableArn"),
        // });
    }
}