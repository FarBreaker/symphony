/** @format */

import { Construct } from "constructs";
import { EnvironmentConfig } from "../environment-config";
import { CfnOutput, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, TableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Stage } from "types";
import {
	BundleFunctions,
	LambdaProfile,
	LambdaStage,
} from "../lib/BundleFunctions";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { GraphqlApi, IGraphqlApi } from "aws-cdk-lib/aws-appsync";

interface StatelessStackProps extends EnvironmentConfig {
	bucket: Bucket;
	graphqlAPiId: string;
}

export class StatelessStack extends Stack {
	private bucket: Bucket;
	private graphql : IGraphqlApi;
	constructor(scope: Construct, id: string, props: StatelessStackProps) {
		super(scope, id, props);

		const { bucket,graphqlAPiId } = props;
		this.bucket = bucket;

		this.graphql = GraphqlApi.fromGraphqlApiAttributes(this, `${props.stageName}-rebound-gql`,{
			graphqlApiId: graphqlAPiId
		})

		
		const lambdaTestLLRT = new BundleFunctions(
			this,
			`${props?.stageName}-llrt-lambda`,
			{
				lambdaDefinition: "llrt-lambda",
				entry: "./stateless/functions/test/index.ts",
				profile: props.defaultLambdaProfile,
				stage: props.lambdaStage,
				environment: {
					BUCKET_NAME: this.bucket.bucketName,
				},
				handler:"index.testFunction"
			}
		);
		const lambdaTestNODE = new BundleFunctions(
			this,
			`${props?.stageName}-node-lambda`,
			{
				lambdaDefinition: "node-lambda",
				entry: "./stateless/functions/test/index.ts",
				profile: LambdaProfile.COMPATIBILITY,
				stage: props.lambdaStage,
				environment: {
					BUCKET_NAME: this.bucket.bucketName,
				},
				handler:"index.testFunction"
			}
		);
		this.graphql.addLambdaDataSource('lambdaTestNODE',lambdaTestNODE.function)

		this.bucket.grantReadWrite(lambdaTestLLRT.function);
		this.bucket.grantReadWrite(lambdaTestNODE.function);
	}
}
