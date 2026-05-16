import { assertEquals } from "@std/assert";
import { maskEmail } from "@/utils/signInHelp.ts";

Deno.test("[signInHelp] maskEmail()", () => {
  const email = "account@example.com";

  const maskedEmail = maskEmail(email);
  assertEquals(maskedEmail, "a***t@example.com");
});
