import fetch from 'node-fetch'
import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  lineUserId?: string,
): APIGatewayAuthorizerResult => {
  const policy = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  }
  return lineUserId ? Object.assign(policy, { context: { lineUserId } }) : policy
}

export async function handler(event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {
  console.log(event)
  const idToken = event.authorizationToken.split(' ')[1]
  return await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `id_token=${idToken}&client_id=${process.env.CLIENT_ID!}`,
  })
    .then(res => res.json())
    .then(json => {
      console.log('Social API Response: ' + JSON.stringify(json, null, 2))
      if (json.error) {
        return generatePolicy('user', 'Deny', event.methodArn)
      } else {
        return generatePolicy('user', 'Allow', event.methodArn, json.sub)
      }
    })
}
