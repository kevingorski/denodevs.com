import type { PageProps } from "fresh";
import { page } from "fresh";
import type { Handlers } from "fresh/compat";
import { State } from "@/routes/_middleware.ts";
import { SITE_NAME } from "@/utils/constants.ts";

export const handler: Handlers<State, State> = {
  GET(ctx) {
    return page(ctx.state);
  },
};

export default function StartPage(props: PageProps<State>) {
  const devMessage = (
    <a href="/signin">
      I'm a Deno developer looking for work
    </a>
  );
  return (
    <main>
      <h1>
        What brings you to {SITE_NAME} today?
      </h1>

      <h2>
        {props.state.sessionId ? <del>{devMessage}</del> : devMessage}
      </h2>

      <h2>
        <a href="/start/employer">I'm an employer hiring Deno developers</a>
      </h2>
    </main>
  );
}
