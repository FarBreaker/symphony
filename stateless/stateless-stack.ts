/** @format */

import { Construct } from "constructs";
import { EnvironmentConfig } from "../lib/configs/config-loader";
import { Duration, Stack } from "aws-cdk-lib";

import { BundleFunctions, LambdaProfile } from "../lib/constructs/NodeFunction";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";

export class StatelessStack extends Stack {
	private bucket: IBucket;
	constructor(scope: Construct, id: string, props: EnvironmentConfig) {
		super(scope, id, props);

		const { persistance, compute } = props;

		this.bucket = Bucket.fromBucketName(
			this,
			`${props.prefix}-reboundBucket`,
			persistance.bucket.name
		);

		const lambdaTestLLRT = new BundleFunctions(
			this,
			`${props?.prefix}-llrt-lambda`,
			{
				lambdaDefinition: "llrt-lambda",
				entry: "./stateless/functions/test/index.ts",
				profile: compute.lambda.profile,
				timeout: Duration.minutes(3),
				environment: {
					BUCKET_NAME: this.bucket.bucketName,
				},
				handler: "index.testFunction",
			}
		);
		const lambdaTestNODE = new BundleFunctions(
			this,
			`${props?.prefix}-node-lambda`,
			{
				lambdaDefinition: "node-lambda",
				entry: "./stateless/functions/test/index.ts",
				profile: LambdaProfile.COMPATIBILITY,
				timeout: Duration.minutes(3),
				environment: {
					BUCKET_NAME: this.bucket.bucketName,
				},
				handler: "index.testFunction",
			}
		);

		this.bucket.grantReadWrite(lambdaTestLLRT.function);
		this.bucket.grantReadWrite(lambdaTestNODE.function);
	}
}
