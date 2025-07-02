export const api = new sst.aws.Function('MyApi', {
  url: true,
  link: [],
  handler: 'apps/backend-api/src/api.handler',
  runtime: 'nodejs22.x',
})
