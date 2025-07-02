import { api } from './api'

export const web = new sst.aws.StaticSite('MyWeb', {
  path: 'apps/frontend',
  build: {
    output: 'dist',
    command: 'npm run build',
  },
  environment: {
    VITE_API_URL: api.url,
    VITE_AUTH_URL: api.url,
  },
})
