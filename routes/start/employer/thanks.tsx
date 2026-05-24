import type { Handlers } from "fresh/compat";
import { page } from "fresh";
import { State } from "@/routes/_middleware.ts";
import { UserType } from "@/types/UserType.ts";
import SignUpSupportLink from "@/components/SignUpSupportLink.tsx";
import { SITE_NAME } from "@/utils/constants.ts";

export const handler: Handlers<State, State> = {
  GET(ctx) {
    return page(ctx.state);
  },
};

export default function EmployerThanksPage() {
  return (
    <main>
      <h1>
        Thanks For Signing Up!
      </h1>

      <p>
        You should receive a confirmation email from {SITE_NAME}{" "}
        shortly, which will let you get started.
      </p>

      <ul>
        <li>
          <SignUpSupportLink
            userType={UserType.Employer}
          />
        </li>
        <li>
          <a href="/">Home</a>
        </li>
      </ul>
    </main>
  );
}
