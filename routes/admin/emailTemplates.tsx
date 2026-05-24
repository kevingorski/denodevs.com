import type { PageProps } from "fresh";
import { page } from "fresh";
import type { Handlers } from "fresh/compat";
import { AdminState } from "@/utils/adminAccessHandler.ts";
import { renderTemplateSamples, TemplateSample } from "@/utils/email.ts";

interface Props extends AdminState {
  templateSamples: TemplateSample[];
}

export const handler: Handlers<Props, AdminState> = {
  GET(ctx) {
    return page({
      ...ctx.state,
      templateSamples: renderTemplateSamples(),
    });
  },
};

export default function EmailTemplatesPage(props: PageProps<Props>) {
  return (
    <main>
      <h1>Email Templates</h1>
      <hr />
      {props.data.templateSamples.map((sample) => {
        const innerHtml = { __html: sample.message.html };
        return (
          <>
            <h2>{sample.name}</h2>
            <ul>
              <li>To: {sample.message.to}</li>
              <li>Subject: {sample.message.subject}</li>
            </ul>
            {
              /* Admin-only preview of email templates rendered by our own
                Resend helper (not user-controlled). The react-no-danger
                rule is disabled project-wide in deno.json. */
            }
            <div dangerouslySetInnerHTML={innerHtml} />
          </>
        );
      })}
    </main>
  );
}
