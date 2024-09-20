/** @format */

import { Construct } from "constructs";
import { EnvironmentConfig } from "../environment-config";
import { Duration, Stack } from "aws-cdk-lib";

import {
	BundleFunctions,
	LambdaProfile,
} from "../lib/BundleFunctions";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface StatelessStackProps extends EnvironmentConfig {
	bucket: Bucket;
}

export class StatelessStack extends Stack {
	private bucket: Bucket;
	constructor(scope: Construct, id: string, props: StatelessStackProps) {
		super(scope, id, props);

		const { bucket } = props;
		this.bucket = bucket;

		
		const lambdaTestLLRT = new BundleFunctions(
			this,
			`${props?.stageName}-llrt-lambda`,
			{
				lambdaDefinition: "llrt-lambda",
				entry: "./stateless/functions/test/index.ts",
				profile: props.defaultLambdaProfile,
				stage: props.lambdaStage,
				timeout: Duration.minutes(3),
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
				timeout: Duration.minutes(3),
				environment: {
					BUCKET_NAME: this.bucket.bucketName,
				},
				handler:"index.testFunction"
			}
		);


		this.bucket.grantReadWrite(lambdaTestLLRT.function);
		this.bucket.grantReadWrite(lambdaTestNODE.function);
	}
}
