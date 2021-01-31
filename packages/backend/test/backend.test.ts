import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import * as Backend from '../lib/backend-stack'

test('Empty Stack', () => {
  const app = new cdk.App()
  // WHEN
  const stack = new Backend.BackendStack(app, 'MyTestStack', {
    env: { region: 'ap-northeast-1' },
    clientId: 'test',
    lambdaLayerDir: 'test',
    lambdaCodeDir: 'test',
  })
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  )
})
