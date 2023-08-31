import type { Handlers } from "$fresh/server.ts";
import { stripe } from "@/utils/payments.ts";
import { State } from "@/routes/_middleware.ts";
import { createUser, createUserLoginToken, newUserProps } from "@/utils/db.ts";
import { sendWelcomeDevEmailMessage } from "@/utils/email.ts";
import { redirect } from "@/utils/redirect.ts";

export const handler: Handlers<State, State> = {
  GET(_, ctx) {
    return ctx.render(ctx.state);
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email")?.toString();

    if (!email) {
      return new Response(null, { status: 400 });
    }

    const user = {
      ...newUserProps(),
      email,
    };

    try {
      await createUser(user);
    } catch (e) {
      // TODO: handle duplicate email
      return new Response(null, { status: 500 });
    }

    const loginToken = await createUserLoginToken(user);
    await sendWelcomeDevEmailMessage(user, loginToken.uuid);

    return redirect("/start/developer/thanks");
  },
};

export default function DeveloperPage() {
  return (
    <main>
      <h1>
        Hello developer!
      </h1>

      <p>
        To start creating your profile, first login with your GitHub account.
        The details of your GitHub account will be used to create your profile,
        but you can edit it and connect other accounts to it afterward.
      </p>

      <p>
        Your email address will be used to confirm your identity and send you
        updates about job matches and DenoDevs updates. If the email address on
        your GitHub account is not the one you'd like to use, it can be updated
        after the initial setup.
      </p>

      <p>
        In the future, you'll be able to showcase work on GitHub through this
        integration.
      </p>

      <form method="post">
        <label>
          Email:{" "}
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            maxLength={255}
            required
          />
        </label>
        <button type="submit">Sign up</button>
      </form>

      <div>TK: Remind me later</div>

      <h2>
        <a href="/">Home</a>
      </h2>
    </main>
  );
}
