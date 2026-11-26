# Deployment and environment setup

This Next.js 16 App Router template uses a Turso database for articles, comments and newsletter subscriptions. The live demo is illustrative; each installation needs its own database and credentials. The existing non-commercial and commercial licensing terms are described in [LICENSE.md](LICENSE.md).

## Prerequisites

- Node.js 22 or newer and npm.
- A Vercel account and a Turso account with enough quota for your intended use. Check the providers' current plan terms before provisioning; do not enable paid features unless you intend to pay.
- An empty database created in your own Turso account. Keep production and preview databases separate.

## Environment variables

Copy `.env.example` to `.env.local` and replace the placeholders. Keep that file out of version control.

| Variable | Value | Visibility |
| --- | --- | --- |
| `TURSO_DATABASE_URL` | URL of your own initialized Turso database | Server |
| `TURSO_AUTH_TOKEN` | Database-scoped token for that database | Secret |
| `API_KEY` | Unique random key for the authenticated post creation API | Secret |
| `NEXT_PUBLIC_SITE_URL` | Public HTTPS deployment origin, without a trailing slash | Public |
| `NEXT_PUBLIC_SITE_NAME` | Display name for the blog | Public |

Do not use the demo's database, credentials, analytics identifiers or content as a starting point. Configure optional analytics only if you own the relevant account and have considered consent requirements.

## Initialize and deploy

1. Install dependencies with `npm ci` (or use `pnpm install --frozen-lockfile` with its own lockfile).
2. With your new database credentials configured locally, run `npm run init-db`. The idempotent script creates the posts, comments and newsletter tables and indexes. It does not delete or seed existing records.
3. Run `npm run lint` and `npm run verify:template` locally. The smoke suite uses a disposable local SQLite database and synthetic records, never your configured remote database.
4. Use the README's Deploy with Vercel button. Enter the five required variable values in the deployment flow; do not embed secrets in a deploy URL. The install command is `npm ci` and the build command is `npm run build`.
5. Configure environment-specific credentials in Vercel. Use a separate database/token/API key for preview, and the public origin for production. Redeploy after changing environment values.
6. Check `/`, `/blog`, `/search`, `/feed`, `/robots.txt`, `/sitemap.xml`, `/api/posts?limit=1`, and `/api/og?title=Hello`. The empty blog should load successfully. Create a post using the authenticated API described in [API_DOCUMENTATION.md](API_DOCUMENTATION.md), but perform write tests only on your own disposable or staging database.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Database or table errors | Verify that the correct database URL and scoped token are configured and that `npm run init-db` completed. |
| Post creation returns 401 | Use your own server-side `API_KEY` in the `x-api-key` request header. Never expose it in browser code. |
| Canonical, sitemap or feed links are incorrect | Set `NEXT_PUBLIC_SITE_URL` to your real public origin and redeploy. |
| Dependency installation fails | Use Node.js 22 and the matching lockfile/package manager. Do not bypass peer dependency checks. |
| Preview unexpectedly displays production content | Stop write tests. Check whether preview inherited the production database variables and configure isolated preview credentials. |

Provider documentation: [Vercel environment variables](https://vercel.com/docs/environment-variables), [Vercel Deploy Button](https://vercel.com/docs/deploy-button), [Turso documentation](https://docs.turso.tech/).
