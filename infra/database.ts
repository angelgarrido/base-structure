const dbName = 'DbRel'
const vpcName = 'DatabaseVPC'

// Create new VPC and Aurora instance for database stages
const vpc = new sst.aws.Vpc(vpcName)

const database = new sst.aws.Aurora(dbName, {
  engine: 'postgres',
  dataApi: true,
  scaling: {
    min: '0 ACU',
    max: '4 ACU',
    pauseAfter: '5 minutes',
  },
  vpc,
  username: 'postgres',
})

export { database, vpc }
