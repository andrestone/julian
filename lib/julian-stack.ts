import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as fn from '@aws-cdk/aws-lambda';
import * as path from 'path';

export class JulianStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here

    const vpc = new ec2.Vpc(this, 'myrdsvpc');

    const cluster = new rds.ServerlessCluster(this, 'AnotherCluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_10_14,
      }),
      vpc,
      scaling: {
        autoPause: cdk.Duration.minutes(10), // default is to pause after 5 minutes of idle time
        minCapacity: rds.AuroraCapacityUnit.ACU_8, // default is 2 Aurora capacity units (ACUs)
        maxCapacity: rds.AuroraCapacityUnit.ACU_32, // default is 16 Aurora capacity units (ACUs)
      },
      enableDataApi: true
    });

    const api = new fn.Function(this, 'LambdaAPI', {
      runtime: fn.Runtime.NODEJS_12_X,
      code: fn.Code.fromAsset(path.join(__dirname, '../assets/lambda')),
      handler: 'index.handler',
      environment: {
        RDS_CLUSTER_ARN: cluster.clusterArn,
        RDS_SECRET: cluster.secret!.secretArn,
      },
    });

    cluster.grantDataApiAccess(api.grantPrincipal);
  }
}
