import {
  createDeveloper,
  type Developer,
  getDeveloper,
  getDeveloperByEmail,
  getDeveloperByStripeCustomer,
  getManyDevelopers,
  newDeveloperProps,
  updateDeveloper,
} from "./db.ts";
import {
  assertArrayIncludes,
  assertEquals,
  assertRejects,
} from "std/testing/asserts.ts";

function genNewDeveloper(): Developer {
  return {
    ...newDeveloperProps(),
    email: `${crypto.randomUUID()}@example.com`,
    stripeCustomerId: crypto.randomUUID(),
    name: null,
    company: null,
    location: null,
    bio: null,
  };
}

Deno.test("[db] developer", async () => {
  const developer = genNewDeveloper();

  assertEquals(await getDeveloper(developer.id), null);
  assertEquals(await getDeveloperByEmail(developer.email), null);
  assertEquals(
    await getDeveloperByStripeCustomer(developer.stripeCustomerId!),
    null,
  );

  await createDeveloper(developer);
  await assertRejects(async () => await createDeveloper(developer));
  assertEquals(await getDeveloper(developer.id), developer);
  assertEquals(await getDeveloperByEmail(developer.email), developer);
  assertEquals(
    await getDeveloperByStripeCustomer(developer.stripeCustomerId!),
    developer,
  );

  const developer1 = genNewDeveloper();
  await createDeveloper(developer1);
  assertArrayIncludes(await getManyDevelopers([developer.id, developer1.id]), [
    developer,
    developer1,
  ]);

  const newDeveloper: Developer = { ...developer };
  await updateDeveloper(newDeveloper);
  assertEquals(await getDeveloper(newDeveloper.id), newDeveloper);
  assertEquals(await getDeveloperByEmail(newDeveloper.email), newDeveloper);
  assertEquals(
    await getDeveloperByStripeCustomer(newDeveloper.stripeCustomerId!),
    newDeveloper,
  );
});
