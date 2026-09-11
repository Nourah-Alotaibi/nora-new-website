# Private notes setup

1. Create a project in a Supabase Free organization at https://supabase.com/dashboard.
2. Run private-notes.sql in its SQL editor.
3. Add SUPABASE_URL and SUPABASE_SECRET_KEY as server-only environment variables in Vercel. Never use a VITE_ prefix for the service-role key.
4. Add VITE_NOTE_ENDPOINT=/api/note in Vercel and redeploy.
5. Read submissions in Supabase's Table Editor, private_notes. No public reading endpoint exists.

Until connected, the panel explains that delivery is unavailable and does not pretend to save notes. Vite's static local preview does not run the Vercel function. Use Vercel's deployed preview to test delivery.
