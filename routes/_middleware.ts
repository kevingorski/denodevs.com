import type { FreshContext } from "fresh";
import { getSessionId } from "kv_oauth";
import type { MetaProps } from "@/components/Meta.tsx";
import { EMPLOYER_SESSION_COOKIE_NAME } from "@/utils/constants.ts";
import { getCookies } from "@std/http/cookie";

export interface State extends MetaProps {
  employerSessionId?: string;
  sessionId?: string;
}

async function setState(ctx: FreshContext<State>) {
  const sessionId = await getSessionId(ctx.req);
  ctx.state.sessionId = sessionId;

  const employerSessionId =
    getCookies(ctx.req.headers)[EMPLOYER_SESSION_COOKIE_NAME];

  if (employerSessionId) {
    ctx.state.employerSessionId = employerSessionId;
  }

  return await ctx.next();
}

export const handler = [
  setState,
];
