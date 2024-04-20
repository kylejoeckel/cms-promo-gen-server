import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        timeout: 900,
        path: "requestPromo",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
