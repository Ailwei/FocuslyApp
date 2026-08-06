# Focusly Server

This folder is intended for backend-only code, API routes, database scripts, and integrations that should not be bundled into the mobile app.

## What to put here

## Current contents

## How to use
If you add a backend implementation later, install dependencies in `server/` and run standard Node/Express commands there.
# server

## Supabase Edge Functions

This folder contains Supabase Edge Functions in `server/functions` implemented in TypeScript.

Quick local run:

```bash
cd server
supabase functions serve
```

Make sure to set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in your environment when running locally.
