/* Reverse proxy for Clicky beacon to enable analytics */
import type { FreshContext } from "fresh";
import type { Handlers } from "fresh/compat";
import proxyRequest from "@/utils/proxyRequest.ts";

const proxiedUrl = "https://in.getclicky.com/in.php";

function proxyClickyRequest(ctx: FreshContext) {
  const requestedUrl = new URL(ctx.req.url);
  const withQueryString = new URL(proxiedUrl);
  withQueryString.search = requestedUrl.search;
  return proxyRequest(withQueryString, ctx.req, ctx);
}

export const handler: Handlers = {
  GET: proxyClickyRequest,
  POST: proxyClickyRequest,
};
