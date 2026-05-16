#!/usr/bin/env -S deno run -A --watch=routes/,utils/,styles/

import "@std/dotenv/load";
import { Builder } from "fresh/dev";
import { browserslistToTargets, bundle } from "lightningcss";
import browserslist from "browserslist";

// Pre-build step: bundle styles/index.css (Open Props + custom) into
// static/styles.gen.css via Lightning CSS. The result is consumed as a
// static asset by _app.tsx (<link href="/styles.gen.css" />).
const targets = browserslistToTargets(
  browserslist("last 2 versions, not dead, > 0.2%"),
);
const { code, map } = bundle({
  filename: "./styles/index.css",
  minify: true,
  sourceMap: true,
  targets,
});

if (!map) throw new Error("No source map");

await Promise.all([
  Deno.writeTextFile(
    "./static/styles.gen.css",
    new TextDecoder().decode(code),
  ),
  Deno.writeTextFile(
    "./static/styles.gen.css.map",
    new TextDecoder().decode(map),
  ),
]);

const builder = new Builder();

if (Deno.args.includes("build")) {
  await builder.build();
} else {
  await builder.listen(() => import("./main.ts"));
}
