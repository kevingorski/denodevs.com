import type { PageProps } from "fresh";
import ContactSupportLink from "@/components/ContactSupportLink.tsx";
import { SITE_NAME } from "@/utils/constants.ts";

export default function NotFoundPage({ url }: PageProps) {
  // NB: Fresh 2 removed the `<Head>` helper. The site-wide `<title>` rendered
  // by routes/_app.tsx serves as the fallback for the 404 page.
  const supportMessageBody = `Hello, this is [Your Name Here].
  I was trying to access "${url}" on ${SITE_NAME}, but it wasn't found.
  I think it should work because [Your Reason Here].
  Please help!`;
  return (
    <main>
      <h1>Page not found ∅</h1>
      <p>
        It doesn't look like this page exists &mdash; if you think it should,
        {" "}
        <ContactSupportLink
          linkText="contact Kevin"
          messageBody={supportMessageBody}
          messageSubject="Deno Devs Page Not Found"
        />.
      </p>
      <p>
        <a href="/">Return home</a>
      </p>
    </main>
  );
}
