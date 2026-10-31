# Zlo — Anime / Subscription Tracker

## Overview
Zlo is a monorepo (Turborepo + Bun) for a subscription/anime tracking web app. It tracks recurring charges, normalises weekly/monthly/yearly billing into one monthly cost, and warns before renewals. Includes watch history, watchlist, dashboard, analytics, and content/genre/anime data.

## Repo layout
```
apps/web/            Next.js 16 app (port 3000), React 19, Tailwind 4, shadcn/ui
packages/api/        tRPC API (@Zlo/api), routers, context, server services
packages/auth/       better-auth (@Zlo/auth), drizzle adapter, PG provider
packages/config/     shared tsconfig base (@Zlo/config)
packages/db/         drizzle-orm + neon (@Zlo/db), schema, migrations, crypto
packages/env/        @t3-oss/env schemas (@Zlo/env): server/web/native
packages/zod/        shared zod schemas (@Zlo/zod): subscription, reminder, dashboard, analytics, calculations
```

## Key tech stack
- Runtime/package manager: Bun 1.3.14 (isolated linker)
- Framework: Next.js 16 (turbopack, reactCompiler, typedRoutes), React 19
- API: tRPC 11 (@trpc/server, @trpc/client, @trpc/tanstack-react-query), TanStack Query 5
- Auth: better-auth 1.6.22 + @better-auth/drizzle-adapter, email/password + Google
- DB: PostgreSQL via @neondatabase/serverless, drizzle-orm 0.45.3
- Validation: zod 4
- Env: @t3-oss/env-core / @t3-oss/env-nextjs
- Styling: Tailwind CSS 4, class-variance-authority, clsx, cn, lucide-react, motion, sonner
- Testing: vitest 4, jsdom, @testing-library/*
- TypeScript: ^6.0.3 (root), strict mode, noUnusedLocals/Parameters, isolatedModules

## Scripts (root)
- `dev` — `turbo dev`
- `build` — `turbo build`
- `check-types` — `turbo check-types`
- `dev:web` — `turbo -F web dev`
- `db:push` / `db:studio` / `db:generate` / `db:migrate` — `turbo -F @Zlo/db <cmd>`
- `test` — `bun run --filter @Zlo/api test`

## Important implementation details
- **tRPC**: entry at `packages/api/src/index.ts`; `publicProcedure`, `protectedProcedure` (requires session), `adminProcedure` (hardcoded admin `vg312809@gmail.com`). Routers in `packages/api/src/routers/` (`index.ts` exports `appRouter` + `HomeRouter`; `home.ts`).
- **Auth context**: `packages/api/src/context.ts` creates `Context { session }` from `better-auth` session via `NextRequest` headers.
- **Auth**: `packages/auth/src/index.ts` builds `betterAuth` with drizzle adapter (PG), `emailAndPassword.enabled`, Google social provider, `nextCookies()` plugin. Trusted origin from `env.CORS_ORIGIN`.
- **DB client**: `packages/db/src/index.ts` — `neon(env.DATABASE_URL)` + `drizzle(sql, { schema })`. Schema split into `schema/auth/` and `schema/content/` (content.ts, enums.ts, episodes.ts, genres.ts, seasons.ts, sources.ts, users.ts, watch-history.ts, watchlist.ts, content-genres.ts).
- **Env**: `packages/env/src/server.ts` validates `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN`, `NODE_ENV`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. `web.ts` is empty client env. `native.ts` for `EXPO_PUBLIC_` prefix (unused).
- **Crypto**: `packages/db/src/server/crypto.ts` — AES-256-GCM encryption for Instagram tokens (`INSTAGRAM_ENCRYPTION_KEY` env required).
- **tRPC client**: `apps/web/src/utils/trpc.ts` — `httpBatchLink` to `/api/trpc` with `credentials: "include"`.
- **Auth client**: `apps/web/src/lib/auth-client.ts` — `createAuthClient({})` from better-auth/react.
- **Routes**: `apps/web/src/lib/routes.ts` exports `AppRoute = Route`. App router under `apps/web/src/app/` (`page.tsx` hero, `layout.tsx`, `(protected)/`, `login/`, `api/`, `opengraph-image.tsx`, `robots.ts`, `sitemap.ts`, `types/logo.ts`).
- **SEO**: `apps/web/src/lib/seo.ts` + `components/seo/json-ld.tsx`; structured data for Organization/WebSite/WebApplication (FinanceApplication).
- **turbo.json**: global env passthrough includes `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CORS_ORIGIN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NODE_ENV`. `dev` task is persistent & uncached.
- **vercel.json**: routes everything to `apps/web` Next.js service.
- **tsconfig**: root extends `@Zlo/config/tsconfig.base.json` (strict, ESNext, bundler resolution, verbatimModuleSyntax, noUncheckedIndexedAccess).

## Conventions
- Workspace packages use `"type": "module"` and ESM exports via `package.json` `exports` map.
- Import workspace packages as `@Zlo/<name>`.
- Components under `apps/web/src/components/` (ui/, layout/, seo/).
- No commits unless explicitly requested. Run `check-types` / `build` / `test` before considering work complete.
