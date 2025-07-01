export const auth = new sst.aws.Auth("MyAuth", {
  issuer: {
    handler: "apps/auth/src/auth.handler",
    runtime: "nodejs22.x",
  },
});