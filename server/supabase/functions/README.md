Supabase Edge Functions (TypeScript)

How to run locally

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Ensure you have the project `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set in your environment or a `.env` when running locally.

Serve functions locally from the `server` folder:

```bash
cd server
supabase functions serve
```

Endpoints added
- `create-session` (POST) — body: `{ user_id, duration, started_at }`
- `get-sessions` (GET) — query: `?user_id=<id>`
- `complete-session` (PATCH/POST) — body: `{ id, completed_at?, notes? }`
- `get-stats` (GET) — query: `?user_id=<id>`
 - `create-account` (POST) — body: `{ email, password?, phone?, user_metadata? }` (server-side create via Admin API)

Environment
- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side only)

Deploy

Use the Supabase CLI to deploy functions when ready:

```bash
cd server
supabase login
supabase functions deploy create-session
supabase functions deploy get-sessions
supabase functions deploy complete-session
supabase functions deploy get-stats
```

# Input validation

All functions perform basic input validation and return `400` with an error message when requests are malformed. See `server/functions/validate.ts` for rules (email format, password length, session duration > 0, required fields).

