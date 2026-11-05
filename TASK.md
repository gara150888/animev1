# Tasks

## Content Admin API
- [x] Create content zod schemas at `packages/zod/src/content/index.ts`
- [x] Create content service at `packages/api/src/server/services/content/index.ts` (CRUD + genre linking)
- [x] Create content router at `packages/api/src/routers/route/content.ts` using `adminProcedure`
- [x] Register `contentRouter` in `packages/api/src/routers/index.ts`
- [x] Verify with `check-types`

## Admin Content UI
- [x] Create `apps/web/src/components/content/types.ts` (ContentItem + labels)
- [x] Create `apps/web/src/components/content/content-table.tsx` (shadcn Table + delete AlertDialog)
- [x] Create `apps/web/src/components/content/content-form-dialog.tsx` (create/edit Dialog form, zod client validation)
- [x] Create `apps/web/src/app/(protected)/admin/content/page.tsx` (list + create/edit/delete mutations)
- [x] Verify with `check-types`

## Admin Seasons
- [x] Season zod schemas (`seasonCreateSchema`, `seasonUpdateSchema`, `seasonIdSchema`) in `packages/zod/src/content/index.ts`
- [x] Season services (list/create/update/delete) in `packages/api/src/server/services/content/index.ts`
- [x] Nested `seasons` router (adminProcedure) in `packages/api/src/routers/route/content.ts`
- [x] `SeasonFormDialog` + `SeasonsTable` components, `SeasonItem` type
- [x] Admin seasons page at `apps/web/src/app/(protected)/admin/content/[id]/seasons/page.tsx`
- [x] Seasons link action in content table
- [x] Verify with `check-types`

## Admin Episodes
- [x] Episode zod schemas (`episodeCreateSchema`, `episodeUpdateSchema`, `episodeIdSchema`) in `packages/zod/src/content/index.ts`
- [x] Episode services (list/create/update/delete) in `packages/api/src/server/services/content/index.ts`
- [x] Nested `episodes` router (adminProcedure) under `content.seasons` in `packages/api/src/routers/route/content.ts`
- [x] `EpisodeFormDialog` + `EpisodesTable` components, `EpisodeItem` type
- [x] Admin episodes page at `apps/web/src/app/(protected)/admin/content/[id]/seasons/[seasonId]/episodes/page.tsx`
- [x] Episodes link action in seasons table
- [x] Verify with `check-types`
