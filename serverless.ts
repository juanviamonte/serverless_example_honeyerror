const fs = require("fs");
import type { AWS } from "@serverless/typescript";

import fn from "@functions/fn";

const serverlessConfiguration: AWS = {
  service: "a-service",
  frameworkVersion: "3",
  package: {
    individually: true,
  },

  custom: {
    stage: "${opt:stage, self:provider.stage}",
    region: "${opt:region, self:provider.region}",
    prefix: "${self:service}-${self:custom.stage}",

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
    },
    ["serverless-offline"]: {
      httpPort: 3003,
    },
  },
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-dotenv-plugin",
  ],
  provider: {
    name: "aws",
    timeout: 30,
    stage: "localhost",
    runtime: "nodejs14.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      REGION: "${self:custom.region}",
      STAGE: "${self:custom.stage}",
      DYNAMODB_LOCAL_ENDPOINT: "http://localhost:8000",
    },
    lambdaHashingVersion: "20201221",
  },
  functions: {
    // @ts-ignore
    fn,
  },
  resources: {},
};

// It creates a serverless.yml file
// eslint-disable-next-line @typescript-eslint/no-var-requires
const YAML = require("json-to-pretty-yaml");
const data = YAML.stringify(
  JSON.parse(JSON.stringify(serverlessConfiguration))
);

console.log(data);

fs.writeFile("serverless.yaml", data);

module.exports = serverlessConfiguration;
