#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { JulianStack } from '../lib/julian-stack';

const app = new cdk.App();
new JulianStack(app, 'JulianStack');
