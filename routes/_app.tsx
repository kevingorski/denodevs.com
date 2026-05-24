import type { PageProps } from "fresh";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import Meta from "@/components/Meta.tsx";
import { SITE_DESCRIPTION } from "../utils/constants.ts";
import { CLICKY_SITE_ID } from "@/utils/config.ts";
import buildPageTitle from "@/utils/pageTitle.ts";

// deno-lint-ignore no-explicit-any
export default function App(props: PageProps<any>) {
  const data = props.data ?? {};
  const title = buildPageTitle(data.title);

  return (
    <html lang="en">
      <head>
        <Meta
          title={title}
          description={data.description ?? SITE_DESCRIPTION}
          href={props.url.href}
        />
        <meta name="viewport" content="width=device-width" />
        <link href="/styles.gen.css" rel="stylesheet" />
      </head>
      <body>
        <Header
          employerSessionId={data.employerSessionId}
          sessionId={data.sessionId}
        />
        <props.Component />
        <Footer
          employerSessionId={data.employerSessionId}
          sessionId={data.sessionId}
        />
        <script async data-id={CLICKY_SITE_ID} src="/56ac6c4e308a9" />
      </body>
    </html>
  );
}
