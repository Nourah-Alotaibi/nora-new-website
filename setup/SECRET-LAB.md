# Nora × Sara Secret Lab

This is an integrated route in Nora’s existing React/Vite/Wouter portfolio: `/nora-and-sara-lab`. It uses the existing theme provider, app boundary, build, Express server, and Vercel deployment. It is absent from the public navigation. Both supported servers send no-index, no-store and framing-protection headers.

## Connect the existing Supabase project

1. Run `setup/secret-lab.sql` once in the existing project's SQL editor. It creates only new `lab_*` tables and functions, enables RLS, and publishes item/connection changes for Realtime. It does not change portfolio inbox tables.
2. In Supabase Auth create two confirmed password users. The visible login uses **nora** or **sara**, never email. Supabase needs an internal email identifier; dedicated identifiers such as `nora@lab.invalid` and `sara@lab.invalid` work with admin-created, confirmed users. Do not enable public signup for this feature. Use unique strong passwords and deliver them privately.
3. Insert the two actual Auth UUIDs into `lab_members`, assigning exactly `nora` and `sara`. SQL examples are at the bottom of the migration. Client users cannot enroll themselves. To revoke access, remove the membership row; original attribution remains intact. Revocation stops database/API access immediately and clears the open page at its next access check (up to 30 seconds).
4. Reuse the site's server-only `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (or legacy `SUPABASE_SERVICE_ROLE_KEY`). Add the same project's `SUPABASE_PUBLISHABLE_KEY` (or legacy `SUPABASE_ANON_KEY`). The config endpoint deliberately returns only the project URL and validated publishable/anon key, never the secret key. No `VITE_` secrets are required.
5. Add `GEMINI_API_KEY` and `GEMINI_MODEL` to enable the floating assistant. Select an available model in your Google project. Only the typed question is sent; the board and earlier messages are not automatically sent. The assistant is stateless and cannot modify data.
6. Add `YOUTUBE_API_KEY` with YouTube Data API v3 enabled. GitHub repository discovery works without a token, or accepts server-only `GITHUB_DISCOVERY_TOKEN` for higher limits. Discovery searches are sent to the selected provider. Resources can always be added by URL.
7. Deploy through the existing site's normal deployment. Vercel serves `api/lab.js` automatically. For the Express build, set environment variables, run `pnpm build`, and start `dist/index.js`. Plain `vite preview` does not execute serverless APIs; use Express or Vercel for full integration.

## Behavior

- Signed-out visitors see only the in-route username/password entrance. The workspace module is lazy-loaded after session and membership validation.
- Authenticated nonmembers are redirected to `/`. Wrong credentials get a generic error. Failed configuration remains closed.
- Shared sticky notes, cases, tasks, resources and shopping entries support creation, editing, search, case association, dates, progress, paper colors, and archival.
- Dashboard shows counts and recent records; Kanban groups tasks by status; Timeline groups all records by date; Detective Mode saves bidirectional clue links with duplicate protection.
- Supabase Realtime refreshes item/connection changes. A 30-second refresh provides a fallback and rechecks membership. Authentication tokens refresh through Supabase.
- Database triggers stamp true creator/editor identities and increment versions. Stale edits are rejected instead of overwriting another user's changes.
- Archived data stays in the database with `deleted=true`; no permanent-delete grant exists for client users. A database administrator can restore an archived record.
- AI/discovery endpoints validate Supabase tokens and Lab membership. Shared database rate limits cap login attempts and provider calls across server instances.

## Verification

`pnpm check`

`pnpm build`

`node --test tests/secret-lab-api.test.mjs tests/private-notes-api.test.mjs`

The isolated `tests/lab-fixture.tsx` contains sample data for UI checks and is not referenced by the application or production build. Do not publish that fixture. Database RLS was also exercised in a local Postgres-compatible PGlite instance. Realtime publication and two-account collaboration still require verification on the actual Supabase project.

After configuration, verify: Nora/Sara login; wrong-password rejection; an outsider account redirects; updates appear in a second session; simultaneous changes reject a stale save; sign-out clears the workspace; removal of membership blocks REST and AI access; live Gemini and discovery results.

References: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase Realtime](https://supabase.com/docs/guides/realtime/postgres-changes), [Gemini generateContent](https://ai.google.dev/api/generate-content).
