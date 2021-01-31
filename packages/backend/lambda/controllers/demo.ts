import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export type LambdaEvent = APIGatewayProxyEvent & {
  requestContext: {
    authorizer: {
      lineUserId: string
    }
  }
}

export const handler = async (event: LambdaEvent): Promise<APIGatewayProxyResult> => {
  console.log('event: ', JSON.stringify(event, null, 2))
  const lineUserId = event.requestContext.authorizer.lineUserId

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify({
      lineUserId,
    }),
  }
}
