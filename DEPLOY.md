# Deploying to Modern Deno Deploy

This project ships via **modern Deno Deploy**
([console.deno.com](https://console.deno.com)) using GitHub integration — there
is **no GitHub Actions deploy job**. Deno Deploy handles the build itself when
commits land on the connected branch.

> **Deno Deploy Classic shuts down 2026-07-20.** This repo has been migrated off
> `deployctl@v1`. The classic project on `dash.deno.com` is not
> auto-transferred; follow the runbook below before that date.

## Project settings to configure in console.deno.com

| Setting         | Value                                        |
| --------------- | -------------------------------------------- |
| Build command   | `deno task build`                            |
| Install command | _(none — Deno fetches imports during build)_ |
| Entrypoint      | `main.ts`                                    |
| Root directory  | `.`                                          |

The optional `deploy` block in [`deno.json`](deno.json) (`project: "denodevs"`,
`entrypoint: "./main.ts"`, …) is the source of truth for include/exclude; the
dashboard can read these as defaults.

## Environment variables

These must be configured in console.deno.com — the application reads them at
module load (`utils/config.ts`) and will fail to boot if any required value is
missing.

### Required at **runtime** (production)

| Variable                                    | Purpose                                                         |
| ------------------------------------------- | --------------------------------------------------------------- |
| `SITE_BASE_URL`                             | Canonical site URL used for OAuth redirects, signed links, etc. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth app for developer sign-in.                         |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth app for developer sign-in.                         |
| `RESEND_API_KEY`                            | Resend API key for transactional email.                         |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD`         | HTTP Basic credentials for `/admin/*`.                          |
| `USE_SECURE_COOKIES`                        | `true` in production (required for `Secure` flag).              |
| `CLICKY_SITE_ID`                            | Clicky analytics site ID.                                       |

### Required at **build time**

`utils/config.ts` runs `assertExists` on several env vars at module load, and
the build evaluates that module. Set these in the Deno Deploy project's **Build
Environment** with placeholder values (the real secrets bind at runtime):

```
SITE_BASE_URL          = http://localhost:8000
GITHUB_CLIENT_ID       = build
GITHUB_CLIENT_SECRET   = build
GOOGLE_CLIENT_ID       = build
GOOGLE_CLIENT_SECRET   = build
CLICKY_SITE_ID         = build
```

(Use the same set the old `.github/workflows/deploy.yml` was passing — they were
always placeholders, never real secrets.)

## Modern Deploy gotchas to know about

- **2-region cap** on modern Deploy (vs Classic's 6). Pick the regions closest
  to the user base.
- **Deno Deploy Classic Queues are unsupported** in modern Deploy. This app uses
  no `Deno.cron` and no queues, so we're unaffected — but don't add either
  expecting it to work.
- **KV data is not automatically migrated.** See the cutover runbook below.

## Cutover runbook (one-time)

Execute these steps against the live environment after this branch lands.

1. Sign into [console.deno.com](https://console.deno.com) with the account that
   owns the Classic project.
2. Create a new **organization**.
3. Create a new **project**, connect the `denodevs.com` GitHub repo, point at
   the production branch.
4. Configure the build command (`deno task build`), entrypoint (`main.ts`), and
   the env vars above.
5. Trigger a deploy from a **staging branch** first. You'll need to temporarily
   add the preview `*.deno.net` URL to the GitHub and Google OAuth apps' allowed
   callback URLs to test sign-in end-to-end.
6. **KV data migration**: email `support@deno.com` to request a KV copy from the
   Classic project to the new one. There is no self-serve path. Do this
   **before** flipping DNS, and verify a few keys (`developers`,
   `employers_by_email`, `developer_sessions`) post-copy.
7. Once the new deploy passes a smoke test on its `.deno.net` URL, add the
   production custom domain in console.deno.com, set the `_acme-challenge`
   CNAME, then update the apex/CNAME DNS to point at modern Deploy. DNS
   propagation can take up to 48h.
8. During the cutover window, keep **both** OAuth callback URLs (Classic and
   modern) registered with GitHub and Google. Remove the Classic URLs after DNS
   settles.
9. Smoke test once more on the production domain. Once green, **archive** (don't
   delete) the Classic project. Classic shuts down 2026-07-20 regardless.
