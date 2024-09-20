#!/usr/bin/env node
/** @format */

import "source-map-support/register";
import { StatefulStack } from "../stateful/stateful-stack";
import { environments } from "../environments";
import { StatelessStack } from "../stateless/stateless-stack";
import { Aspects, App} from "aws-cdk-lib"
import { LambdaRule } from "../lib/Aspects/LambdaRule";


const app = new App();

Aspects.of(app).add(new LambdaRule())


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
	}
);
