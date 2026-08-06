import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

// Load .env into Deno.env when available (local dev)
try {
  config({ export: true });
} catch (_) {
  // noop in environments without a .env
}

export function getRequiredEnv(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}
