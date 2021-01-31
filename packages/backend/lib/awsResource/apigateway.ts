import * as apigateway from '@aws-cdk/aws-apigateway'
import * as cdk from '@aws-cdk/core'

export function createApigateway(scope: cdk.Construct): apigateway.RestApi {
  // Create ApiGateway
  const api = new apigateway.RestApi(scope, 'api', {
    restApiName: 'api',
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
      statusCode: 200,
    },
    deployOptions: {
      tracingEnabled: true,
    },
  })
  return api
}
