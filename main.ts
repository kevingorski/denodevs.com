import { App, staticFiles } from "fresh";
import type { State } from "@/routes/_middleware.ts";

export const app = new App<State>();

app.use(staticFiles());
app.fsRoutes();

if (import.meta.main) {
  await app.listen();
}

export default app;
