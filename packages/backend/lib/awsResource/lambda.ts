import { LayerVersion, Code, Runtime, Function } from '@aws-cdk/aws-lambda'
import { Tracing } from '@aws-cdk/aws-lambda'
import * as cdk from '@aws-cdk/core'
import { Duration } from '@aws-cdk/core'

export function createLambdaLayer(scope: cdk.Construct, lambdaLayerDir: string): LayerVersion {
  return new LayerVersion(scope, 'lambdaBundleLayer', {
    layerVersionName: 'modules',
    description: 'Node.js modules layer',
    compatibleRuntimes: [Runtime.NODEJS_12_X],
    license: 'UNLICENSED',
    code: Code.fromAsset(lambdaLayerDir),
  })
}

export type LambdaAuthorizerEnvironment = {
  CLIENT_ID: string
}

export function createLambdaAuthorizer(
  scope: cdk.Construct,
  environment: LambdaAuthorizerEnvironment,
  layer: LayerVersion,
  lambdaCodeDir: string,
): Function {
  const lambdaAuthorizer = new Function(scope, 'lambdaAuthorizer', {
    functionName: 'lambdaAuthorizer',
    code: Code.fromAsset(lambdaCodeDir),
    handler: 'authorizer.handler',
    runtime: Runtime.NODEJS_12_X,
    layers: [layer],
    timeout: Duration.seconds(30),
    environment,
    tracing: Tracing.ACTIVE,
  })

  return lambdaAuthorizer
}

export function createDemoLambda(scope: cdk.Construct, layer: LayerVersion, lambdaCodeDir: string): Function {
  const loginLambda = new Function(scope, 'demo', {
    functionName: 'demo',
    code: Code.fromAsset(lambdaCodeDir),
    handler: 'controllers/demo.handler',
    runtime: Runtime.NODEJS_12_X,
    layers: [layer],
    timeout: Duration.seconds(30),
    tracing: Tracing.ACTIVE,
  })
  return loginLambda
}
