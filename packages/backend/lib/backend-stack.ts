import { Construct, Stack, StackProps } from '@aws-cdk/core'
import { AuthorizationType, LambdaIntegration, TokenAuthorizer } from '@aws-cdk/aws-apigateway'
import { createApigateway } from './awsResource/apigateway'
import { createLambdaAuthorizer, createLambdaLayer, createDemoLambda } from './awsResource/lambda'

type BackendStackProps = StackProps & {
  clientId: string
  lambdaLayerDir: string
  lambdaCodeDir: string
}

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props)

    const api = createApigateway(this)
    const layer = createLambdaLayer(this, props.lambdaLayerDir)
    const demoLambda = createDemoLambda(this, layer, props.lambdaCodeDir)
    const lambdaAuthorizerEnvironment = {
      CLIENT_ID: props.clientId,
    }
    const lambdaAuthorizer = createLambdaAuthorizer(this, lambdaAuthorizerEnvironment, layer, props.lambdaCodeDir)

    // Integration API Gateway Lambda
    const login = api.root.addResource('demo')
    const authorizer = new TokenAuthorizer(this, 'authorizer', {
      handler: lambdaAuthorizer,
      validationRegex: '^(Bearer )[a-zA-Z0-9\\-_]+?\\.[a-zA-Z0-9\\-_]+?\\.([a-zA-Z0-9\\-_]+)$',
    })
    login.addMethod('GET', new LambdaIntegration(demoLambda), {
      authorizationType: AuthorizationType.CUSTOM,
      authorizer,
    })
  }
}
