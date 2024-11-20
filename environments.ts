/** @format */

import { Region, Stage } from "./types";
import { EnvironmentConfig } from "./environment-config";
import { LambdaProfile, LambdaStage } from "lib/constructs/NodeFunction";

export const environments: Record<Stage, EnvironmentConfig> = {
	[Stage.develop]: {
		stageName: Stage.develop,
		tableName: `${Stage.develop}-symphony-table`,
		bucketName: `${Stage.develop}-symphony-bucket`,
		lambdaStage: LambdaStage.DEVELOP,
		defaultLambdaProfile: LambdaProfile.PERFORMANCE,
		// tags: {
		// 	awsApplication:
		// 		"arn:aws:resource-groups:eu-central-1:000468819253:group/FEE-SAAS/02q9iq1eeinhvb296we3w44sa4",
		// },
	},
	[Stage.prod]: {
		lambdaStage: LambdaStage.PRODUCTION,
		defaultLambdaProfile: LambdaProfile.PERFORMANCE,
	},
};
