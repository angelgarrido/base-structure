import { RDSDataClient } from '@aws-sdk/client-rds-data'
import { drizzle } from 'drizzle-orm/aws-data-api/pg'
import { Resource } from 'sst'

const client = new RDSDataClient({
  requestHandler: {
    requestTimeout: 0,
    httpsAgent: { maxSockets: 100 },
  },
})

export const db = drizzle(client, {
  database: Resource.DbRel.database,
  secretArn: Resource.DbRel.secretArn,
  resourceArn: Resource.DbRel.clusterArn,
})
