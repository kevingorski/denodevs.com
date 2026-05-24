import { defineRoute } from "fresh/compat";
import { marked } from "marked";
import { SITE_NAME } from "@/utils/constants.ts";

const lastUpdated = new Date(2023, 8, 25);
const md = await Deno.readTextFile("static/privacyPolicy.md");
const markup = await marked.parse(md);

export default defineRoute(() => {
  return (
    <main>
      <h1>{SITE_NAME} Privacy Policy</h1>
      <p>
        Last updated:{" "}
        <time>
          {lastUpdated.toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </p>
      {
        /* Renders a repo-local markdown file (not user input). The
          react-no-danger rule is disabled project-wide in deno.json. */
      }
      <div
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </main>
  );
});
