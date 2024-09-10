/** @format */

import { format } from "path";
import { env } from "process";

const convict = require("convict");

export const config = convict({
	stage: {
		doc: "The stage being deployed",
		format: String,
		default: "",
		env: "STAGE",
	},
	region: {
		doc: "The Region being deployed to",
		format: String,
		default: "",
		env: "REGION",
	},
}).validate({ allowed: "strict" });
