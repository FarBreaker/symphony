/** @format */

import { Construct } from "constructs";
import { EnvironmentConfig } from "../environment-config";
import { CfnOutput, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Stage } from "types";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { NagSuppressions } from "cdk-nag";


interface StatefulStackProps extends EnvironmentConfig {}
export class StatefulStack extends Stack {
	public Table: TableV2;
	public Bucket: Bucket;

	constructor(scope: Construct, id: string, props?: StatefulStackProps) {
		super(scope, id, props);

		this.Bucket = new Bucket(this, `${props?.stageName}-Bucket`, {
			enforceSSL:true,
			bucketName: props?.bucketName || "Bucket",
			removalPolicy:
				props?.stageName === Stage.develop
					? RemovalPolicy.DESTROY
					: RemovalPolicy.RETAIN,
			autoDeleteObjects: true,
			
		});

		this.Table = new TableV2(this, `${props?.stageName}-Dynamo`, {
			tableName: props?.tableName || "Dynamo",
			partitionKey: { name: "pk", type: AttributeType.STRING },
			sortKey: { name: "sk", type: AttributeType.STRING },
			removalPolicy:
				props?.stageName === Stage.develop
					? RemovalPolicy.DESTROY
					: RemovalPolicy.RETAIN,
		});

		new CfnOutput(this, "TableName", {
			value: this.Table.tableName,
			description: "The name of the dynamo table",
			exportName: `TableName-${props?.stageName}`,
		});
		new CfnOutput(this, "BucketName", {
			value: this.Bucket.bucketName,
			description: "The name of the bucket",
			exportName: `BucketName-${props?.stageName}`,
		});
	}
}
