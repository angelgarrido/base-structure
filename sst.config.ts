/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'base-structure',
      removal: input?.stage === 'prod' ? 'retain' : 'remove',
      protect: input.stage === 'prod',
      version: '>= 3.9.14',
      home: 'aws',
      providers: {
        aws: {
          profile: input.stage === 'prod' ? 'neurobrew-prod' : 'neurobrew-dev',
          region: 'eu-central-1',
          defaultTags: {
            tags: {
              project: 'base-structure',
              env: input.stage,
            },
          },
        },
      },
    }
  },
  async run() {
    const database = await import('./infra/database')
    const api = await import('./infra/api')
    const frontend = await import('./infra/frontend')
    return {
      frontend: frontend.web.url,
    }
  },
})
