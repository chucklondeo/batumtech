# Batumtech Website

Next.js 15 + TypeScript + Payload CMS 3 website and content platform.

## Local setup

1. Copy `.env.example` to `.env` and replace all placeholder secrets.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Install packages with `pnpm install`.
4. Generate Payload artifacts with `pnpm generate:types` and `pnpm generate:importmap`.
5. Start the application with `pnpm dev`, then open `/admin` to create the first user.

The legacy PHP source, MySQL export and `uploadfile/upfiles` must remain read-only migration inputs. Do not place production secrets or database dumps in Git.

## Automated release and SEO protection

- Every push to `main` runs type checks, legacy redirect tests and a production build.
- Hostinger deploys `main` automatically after GitHub receives the commit.
- The production SEO monitor checks canonical URLs, robots.txt, sitemap.xml and representative legacy 301 redirects each day when the GitHub variable `SEO_MONITOR_ENABLED=true` is set.
- Optional Baidu submission uses the GitHub Actions secret `BAIDU_PUSH_TOKEN`; the token must never be committed to this repository.
- Keep `PAYLOAD_DB_PUSH=false` in production after the initial database schema has been created.
