/* Reverse proxy for Clicky tracking code to enable analytics */
import type { FreshContext } from "fresh";
import type { Handlers } from "fresh/compat";
import proxyRequest from "@/utils/proxyRequest.ts";

const proxiedUrl = new URL(
  "https://static.getclicky.com/js?in=%2F335afc1fe2e63",
);

function proxyClickyRequest(ctx: FreshContext) {
  return proxyRequest(proxiedUrl, ctx.req, ctx);
}

export const handler: Handlers = {
  GET: proxyClickyRequest,
  POST: proxyClickyRequest,
};
