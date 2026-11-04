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
