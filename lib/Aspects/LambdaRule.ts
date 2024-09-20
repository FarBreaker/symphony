import { Annotations,IAspect } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { IConstruct } from "constructs";
import { BundleFunctions } from "../BundleFunctions";



export class LambdaRule implements IAspect{
    constructor () {}

    public visit(node: IConstruct): void {
        if(node instanceof NodejsFunction){
            if(!(node.node.scope instanceof BundleFunctions)){
                Annotations.of(node).addError("Lambda construct used directly. Please use BundleFunction construct instead");
            }
        }
    }
}