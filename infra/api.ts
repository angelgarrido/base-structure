import { auth } from "./auth";

export const api = new sst.aws.Function("MyApi", {
  url: true,
  link: [auth],
  handler: "apps/backend-api/src/api.handler",
  runtime: "nodejs22.x",
});