import { defineRoute } from "fresh/compat";
import { HttpError } from "fresh";
import { signIn } from "kv_oauth";
import {
  gitHubOAuth2Client,
  googleOAuth2Client,
} from "../../utils/oauth2_clients.ts";
import { OAuthProvider } from "@/types/OAuthProvider.ts";

export default defineRoute(
  async (ctx) => {
    const requestUrl = new URL(ctx.req.url);
    const provider = requestUrl.searchParams.get("provider");
    let client;
    switch (provider) {
      case OAuthProvider.GITHUB:
        client = gitHubOAuth2Client;
        break;
      case OAuthProvider.GOOGLE:
        client = googleOAuth2Client;
        break;
      default:
        throw new HttpError(404);
    }
    return await signIn(ctx.req, client);
  },
);
