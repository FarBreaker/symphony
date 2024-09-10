/** @format */

import { LambdaProfile, LambdaStage } from "lib/BundleFunctions";
import { Region, Stage } from "./types";

export interface EnvironmentConfig {
	env?: Env;
	stageName?: Stage;
	tags?: { [key: string]: string };
	tableName?: string;
	bucketName?: string;
	lambdaStage: LambdaStage;
	defaultLambdaProfile: LambdaProfile;
}
interface Env {
	account?: string;
	region?: Region;
}
