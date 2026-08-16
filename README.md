# Batumtech Website

Next.js 15 + TypeScript + Payload CMS 3 website and content platform.

## Local setup

1. Copy `.env.example` to `.env` and replace all placeholder secrets.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Install packages with `pnpm install`.
4. Generate Payload artifacts with `pnpm generate:types` and `pnpm generate:importmap`.
5. Start the application with `pnpm dev`, then open `/admin` to create the first user.

The legacy PHP source, MySQL export and `uploadfile/upfiles` must remain read-only migration inputs. Do not place production secrets or database dumps in Git.

