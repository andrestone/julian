import * as AWS from 'aws-sdk';
import { Handler } from 'aws-lambda';


const rds = new AWS.RDSDataService();

export const handler: Handler = async(event, context, callback) => {
  console.log(event);
  // Call RDS
  const result = await rds.executeStatement({
    sql: 'select * from pg_catalog.pg_tables',
    secretArn: process.env['RDS_SECRET']!,
    resourceArn: process.env['RDS_CLUSTER_ARN']!
  }).promise()
  console.log(result.records)
}
