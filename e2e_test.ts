import { app } from "@/main.ts";
import {
  assert,
  assertEquals,
  assertFalse,
  assertInstanceOf,
} from "@std/assert";

// TODO(fresh-2): Fresh 2's file-system route registration via app.fsRoutes()
// reads from the build cache in `_fresh/`. Calling `app.handler()` without a
// prior `deno task build` returns 404 for all routes. This test was disabled
// during the Fresh 1 → 2 migration; re-enable once we have a `test` task that
// runs the build first (or a Fresh 2 in-memory test harness lands upstream).
Deno.test.ignore("[http]", async (test) => {
  const handler = app.handler();

  await test.step("GET /", async () => {
    const response = await handler(new Request("http://localhost"));

    assert(response.ok);
    assertInstanceOf(response.body, ReadableStream);
    assertEquals(
      response.headers.get("content-type"),
      "text/html; charset=utf-8",
    );
    assertEquals(response.status, 200);
  });

  await test.step("GET /account", async () => {
    const response = await handler(
      new Request("http://localhost/account"),
    );

    assertFalse(response.ok);
    assertFalse(response.body);
    assertEquals(
      response.headers.get("location"),
      "/signin?from=http://localhost/account",
    );
    assertEquals(response.status, 303);
  });

  await test.step("GET /signout", async () => {
    const response = await handler(
      new Request("http://localhost/signout"),
    );

    assertFalse(response.ok);
    assertFalse(response.body);
    assertEquals(response.headers.get("location"), "/");
    assertEquals(response.status, 302);
  });
});
