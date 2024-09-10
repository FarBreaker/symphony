/** @format */

import { Construct } from "constructs";
import { EnvironmentConfig } from "../environment-config";
import { CfnOutput, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";

import { Stage } from "types";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { FieldLogLevel, GraphqlApi, SchemaFile } from "aws-cdk-lib/aws-appsync";

interface StatefulStackProps extends EnvironmentConfig {}
export class StatefulStack extends Stack {
	public Table: TableV2;
	public Bucket: Bucket;
	public qglApiId: string;

	
	
	constructor(scope: Construct, id: string, props?: StatefulStackProps) {
		super(scope, id, props);
		const __dirname = import.meta.dirname;

		this.Bucket = new Bucket(this, `${props?.stageName}-Bucket`, {
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

		const gql = new GraphqlApi(this, `${props?.stageName}-GQLApi`, {
			name: `${props?.stageName}-GQLApi`,
			schema: SchemaFile.fromAsset("./stateful/schema.graphql"),
			xrayEnabled: true,
			logConfig:{
				excludeVerboseContent: false,
				fieldLogLevel: FieldLogLevel.ALL
			}
		})
		this.qglApiId = gql.apiId

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
		new CfnOutput(this, "GQLApiUrl", {
			value: gql.graphqlUrl,
			description: "The url of the graphql api",
			exportName: `GQLApiUrl-${props?.stageName}`,
		});
		new CfnOutput(this, "GQLApiId", {
			value: gql.apiId,
			description: "The id of the graphql api",
			exportName: `GQLApiId-${props?.stageName}`,
		});
		new CfnOutput(this, "GQLApiKey", {
			value: gql.apiKey!,
			description: "The arn of the graphql api",
			exportName: `GQLApiArn-${props?.stageName}`,
		});
	}
}
