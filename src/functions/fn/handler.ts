import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { formatJSONResponse } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import schema from "./schema";

import * as Honeybadger from "@honeybadger-io/js";
Honeybadger.configure({ apiKey: "test" });

const fn: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  Honeybadger.notify("message", {
    name: "name",
    component: "component",
    action: "action",
    params: {},
  });

  return formatJSONResponse({ success: true });
};

export const main = Honeybadger.lambdaHandler(middyfy(fn));
