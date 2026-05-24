import { App, csp, staticFiles } from "fresh";
import type { State } from "@/routes/_middleware.ts";

export const app = new App<State>();

app.use(staticFiles());

// Content-Security-Policy. Fresh 2's `csp` middleware ships sensible
// defaults (default-src 'self', script/style-src 'self' 'unsafe-inline',
// frame-ancestors 'none', base-uri 'self', upgrade-insecure-requests, etc.);
// `useNonce: true` swaps the 'unsafe-inline' allowance for per-request
// nonces that Fresh injects into the inline scripts/styles it emits.
//
// We only need to extend `img-src` to permit the two avatar hosts used by
// developer profiles: GitHub OAuth avatars and Gravatar.
app.use(
  csp({
    useNonce: true,
    csp: [
      "img-src 'self' data: avatars.githubusercontent.com www.gravatar.com",
    ],
  }),
);

app.fsRoutes();

if (import.meta.main) {
  await app.listen();
}

export default app;
