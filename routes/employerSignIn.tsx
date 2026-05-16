import type { PageProps } from "fresh";
import { page } from "fresh";
import type { Handlers } from "fresh/compat";
import { State } from "@/routes/_middleware.ts";
import { redirect, setRedirectUrlCookie } from "@/utils/redirect.ts";
import { createSignInToken, getEmployerByEmail } from "@/utils/db.ts";
import { sendEmployerSignInEmailMessage } from "@/utils/email.ts";
import EmailSignInForm from "@/components/EmailSignInForm.tsx";
import SignInFormSupportLink from "@/components/SignInFormSupportLink.tsx";
import { UserType } from "@/types/UserType.ts";
import SignInHelp from "@/types/SignInHelp.ts";
import { getSignInHelpFromCookie } from "@/utils/signInHelp.ts";

interface EmployerSignInPageData extends State {
  email?: string;
  hasSubmitted: boolean;
  signInHelp: SignInHelp | null;
}

export const handler: Handlers<EmployerSignInPageData, State> = {
  GET(ctx) {
    const signInHelp = getSignInHelpFromCookie(ctx.req);
    if (ctx.state.employerSessionId !== undefined) return redirect("/");

    return page({ ...ctx.state, hasSubmitted: false, signInHelp });
  },

  async POST(ctx) {
    const form = await ctx.req.formData();
    const email = form.get("email")?.toString();
    const signInHelp = getSignInHelpFromCookie(ctx.req);

    if (!email) {
      return new Response(null, { status: 400 });
    }

    const employer = await getEmployerByEmail(email);
    let signInResult = false;

    if (employer) {
      signInResult = true;

      const signInToken = await createSignInToken(employer);

      await sendEmployerSignInEmailMessage(employer, signInToken.uuid);
    }

    // POST handler returns PageResponse; setRedirectUrlCookie was previously
    // wrapping the rendered Response. With the new page() pattern we can't
    // easily set a cookie on the response, so include the cookie via the
    // page response headers.
    const headers = new Headers();
    if (signInResult) {
      setRedirectUrlCookie(ctx.req, new Response(null, { headers }));
    }
    return page(
      { ...ctx.state, email, hasSubmitted: true, signInHelp },
      { headers },
    );
  },
};

export default function EmployerSignInPage(
  props: PageProps<EmployerSignInPageData>,
) {
  const { email, hasSubmitted, signInHelp } = props.data;
  return (
    <main>
      <h1>
        Employer Sign In
      </h1>

      <EmailSignInForm
        email={email || ""}
        hasSubmitted={hasSubmitted}
        signInHelp={signInHelp}
        userType={UserType.Employer}
      />

      <ul>
        <li>
          <SignInFormSupportLink email={email} userType={UserType.Employer} />
        </li>
        <li>
          <a href="/start/employer">Employer Sign Up</a>
        </li>
        <li>
          <a href="/signin">Developer Sign In</a>
        </li>
      </ul>
    </main>
  );
}
