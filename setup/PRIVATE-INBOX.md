# Private inbox setup — prepared, not deployed

Only the new private inbox and two routes are added. Existing visitor submissions still use `api/note.js` and `public.private_notes`. No Supabase SDK/client or new table is introduced. The unused template OAuth URL helper is not an active auth system; no existing Supabase Auth integration was found.

## Addresses

Inbox: `/n-1350c3164f9571a92386ede205b5e6e17aa891a12291d21a`

Sign in: `/s-20bbf1274fbb9e796eb540bad32c3931ae0dd27ebf3dee27`

These are random 192-bit paths, not authorization secrets. They can be found by examining the frontend bundle. Do not share them as public links. Nothing adds them to public navigation, the footer, or a sitemap. Their responses get noindex/nofollow/noarchive, no-store and no-referrer headers; the pages also add robots metadata. Per the later request, the inbox now shows one Passcode box while locked, without revealing any notes. The previous 404-style screen was replaced by this explicit passcode screen. API authorization failures remain HTTP 404.

## 1. Inspect the existing project (read-only)

Use the existing Supabase project `craxrpysnletdampwmna`; do not create another project or table.

In SQL Editor inspect before applying anything:

```sql
select column_name, data_type, is_nullable from information_schema.columns
where table_schema='public' and table_name='private_notes';
select relrowsecurity from pg_class where oid='public.private_notes'::regclass;
select * from pg_policies where schemaname='public' and tablename='private_notes';
```

The repository's existing schema contains id, created_at, name and note. No category column is defined, so the inbox does not invent categories. The live schema/policies have NOT been inspected or modified from this session. If the live schema differs, stop and reconcile it before applying the migration.

## 2. Create your one owner account

In Supabase Dashboard → Authentication → Users, choose **Add user → Create new user**. Enter your owner email and set the desired passcode as the account password privately in Supabase. The passcode is not stored in the repository. The page itself never asks for your email. Confirm the email there (the auto-confirm option) for this manually provisioned account. Copy the resulting User UID. If your owner user already exists, reuse its UID instead.

In Authentication's sign-up settings, disable **Allow new users to sign up** if this project is used only for the portfolio. Do not disable an existing application's registrations without checking first. There is no registration UI or registration API in this implementation. Other valid Supabase accounts still cannot access this inbox.

Forgotten password: manage/reset the account through Supabase; do not put passwords in code, SQL files, environment variables, or chat.

## 3. Review and apply the prepared SQL only after approval

Open `setup/private-notes-inbox.sql`. Replace `REPLACE_WITH_ADMIN_USER_UUID` with the owner's UUID from Step 2. Run it in the existing project's SQL Editor after review.

It adds only `is_read boolean not null default false` and `is_favorite boolean not null default false`. Existing notes become unread and not favorited. No messages are changed or duplicated. It enables RLS, revokes public/anon/authenticated table access, and grants authenticated SELECT/DELETE plus UPDATE of only the two metadata columns. Three RLS policies limit all those operations to the exact owner UUID. Anonymous visitors get none. It preserves the server-only public submission endpoint's INSERT grant. Unexpected pre-existing policies make the migration abort rather than overwrite them blindly.

The same owner UUID must be used in the server environment and SQL. Changing the owner later requires updating both deliberately.

Run `setup/verify-private-notes.sql` after replacing its UUID placeholder. It verifies RLS, actual denied anonymous SELECT/UPDATE/DELETE, a non-owner's zero-row access, and owner read/update/delete. It inserts only a temporary test row and rolls the entire transaction back. This SQL verification has been prepared but NOT run against production.

## 4. Server environment (no VITE_ prefix)

Reuse existing `SUPABASE_URL=https://craxrpysnletdampwmna.supabase.co`.

Add:

- `SUPABASE_PUBLISHABLE_KEY`: the project's publishable key from Project Settings → API Keys. A legacy anon key may instead be supplied as `SUPABASE_ANON_KEY`.
- `NOTES_ADMIN_USER_ID`: the exact Auth UUID used in the SQL migration.
- `NOTES_ADMIN_EMAIL`: that owner account�s email, server-only. The unlock endpoint uses this fixed account and ignores any email supplied by a visitor.

Keep existing `SUPABASE_SECRET_KEY` / `SUPABASE_SERVICE_ROLE_KEY` as they are for public note submission. The inbox never uses that privileged key: its queries use the publishable key AND the authenticated owner's JWT, so RLS applies. Do not put any service key, password, or session token in client code. No new VITE environment variables are required.

For local testing, put the server environment in ignored `.env.local` (do not commit it). After building, run:

```powershell
node --env-file=.env.local scripts/preview-private-notes.mjs
```

Open `http://127.0.0.1:3004` plus the sign-in path. This uses real Supabase Auth once configured; there is no development auth bypass. The existing static preview on port 3003 cannot execute serverless APIs. Do not expect a live login there.

## 5. How to use it on iPhone after approved deployment

Open your production HTTPS website domain plus the inbox path in Safari. Enter only your passcode and tap Open. The alternate unlock path also works. Bookmark the inbox privately; do not put them on the public website. You can also save the inbox with Safari → Share → Add to Home Screen (a normal shortcut, not an offline app).

Access tokens expire within one hour (or the project�s shorter expiry) and automatically renew using a rotating HttpOnly refresh cookie. The device is remembered for up to 30 days since its latest renewal, subject to Supabase session limits, revocation, and Safari clearing cookies. The passcode is never remembered in application storage, and no tokens are stored in localStorage. Lock clears both cookies and revokes the Supabase session. Access tokens already copied elsewhere remain valid until their normal expiry; this is standard JWT behavior.

## Security model and limits

Every management API request validates the access token with Supabase Auth's `/user` endpoint and checks the configured owner UUID before touching the database. The SQL policies independently check `auth.uid()`. Metadata writes are allowlisted, UUIDs validated, DELETE requires explicit confirmation, and same-origin checks plus SameSite=Strict cookies guard mutations against CSRF. Cookies are HttpOnly and Secure in production and scoped to the private API. Passwords and tokens are never returned to browser JavaScript or logged. Text renders as React text, preserving line breaks without interpreting HTML.

Supabase's Auth rate limits remain applicable. This implementation does not add a separate distributed login rate limiter or MFA flow. If you require MFA, implement and test an AAL2 flow before enforcing an MFA-required policy. Dashboard/database owners and server service-role credentials retain privileged access by design.

A secret route and noindex are not security. RLS + server owner checks are the protections. Real production login, RLS denial, and real note mutations remain unverified until you approve the manual setup. No deployment or production database change was performed.

## Validation

- `node --test tests/private-notes-api.test.mjs`: mocked upstream API security and behavior tests.
- `node node_modules/typescript/bin/tsc --noEmit`: TypeScript check.
- Existing build: Vite frontend + esbuild server. No lint script is defined in this repository.
- Browser QA uses mocked API responses, not real visitor data: widths 375, 390, 430, 768 and 1280, both themes; full multi-paragraph text and unbroken URLs, no horizontal overflow, read/favorite actions, delete confirmation/cancel, unlock/locked/expired states. Mocked tests are not proof of production RLS.

No commit, push, deployment, or live SQL execution is authorized by this implementation task.

## Files changed

Inbox additions: `api/private-notes.js`, `client/src/pages/PrivateNotes.tsx`, `client/src/pages/privateNotes.css`, `scripts/preview-private-notes.mjs`, `tests/private-notes-api.test.mjs`, `setup/private-notes-inbox.sql`, `setup/verify-private-notes.sql`, and this guide.

Inbox integration: `client/src/App.tsx` (two isolated lazy routes) and `vercel.json` (headers for those routes only).

Separately requested dark-mode corrections: `client/src/pages/Home.tsx` and `client/src/index.css`. The hero grammar is corrected in mobile and desktop copies; dark mobile Journey descriptions now have 23.4px line-height at 12px font size and natural height. Their desktop typography remains unchanged. The former exact-height fitting code was removed to avoid clipping the more widely spaced lines.

All changes were mirrored into the existing `nora-new-website-dark` deployment checkout. Public note form/button, submission endpoint, bright-mode public styling, and project content were not edited in this task.

Reference: Supabase's [RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security) and [password authentication documentation](https://supabase.com/docs/guides/auth/passwords).

Passcode update validation: 19 mocked API tests now include owner-email pinning, remembered session renewal, cookie rotation, revoked refresh, and non-owner refresh rejection. No supplied passcode is hard-coded or written to configuration. Supabase must still be configured before real unlocking works.
