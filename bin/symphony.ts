#!/usr/bin/env node
/** @format */

import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { StatefulStack } from "../stateful/stateful-stack";
import { environments } from "../environments";
import { StatelessStack } from "../stateless/stateless-stack";

const app = new cdk.App();

const devStatefulStack = new StatefulStack(
	app,
	`Stateful-${environments.develop.stageName}`,
	{
		...environments.develop,
	}
);
const devStatelessStack = new StatelessStack(
	app,
	`Stateless-${environments.develop.stageName}`,
	{
		...environments.develop,
		bucket: devStatefulStack.Bucket,
		graphqlAPiId: devStatefulStack.qglApiId,
	}
);
