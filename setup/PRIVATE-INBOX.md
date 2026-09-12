# Private notes passcode

The inbox uses a standalone passcode. Supabase Auth accounts and recovery emails are no longer used.

Production server environment:
- SUPABASE_URL
- SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY)
- NOTES_PASSCODE_HASH: random 16-byte salt in hex, colon, 64-byte scrypt hash in hex.

Never prefix these with VITE_. Never commit a real passcode or hash. The server checks the passcode and issues a signed HttpOnly, Secure, SameSite=Strict cookie valid for 24 hours. Changing the hash and redeploying invalidates old sessions. Logout clears the browser cookie. Login attempts are throttled per server instance; this is not a globally distributed rate limit.

The API authenticates before reading or modifying private_notes using the existing server-only database key. Supabase RLS stays enabled for direct browser access; the server key bypasses RLS, so API authorization and field validation are mandatory. Only is_read/is_favorite can be edited; deletion requires explicit confirmation.

The older Supabase Auth setup SQL is retained as historical setup material, not required for passcode login. Existing notes and schema are preserved.
