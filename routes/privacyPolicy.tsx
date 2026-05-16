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
        /* Markup comes from a trusted, repo-local markdown file rendered
          at module load — not from user input. */
      }
      {/* deno-lint-ignore react-no-danger */}
      <div
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </main>
  );
});
