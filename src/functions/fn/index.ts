import schema from "./schema";
import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 30,
  events: [
    {
      http: {
        method: "post",
        // warmup: true,
        path: "/test",
        request: {
          schema: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
