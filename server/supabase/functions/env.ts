import { config } from "https://deno.land/x/dotenv@v3.2.0/mod.ts";

try {
  config({ export: true });
} catch (_) {
  
}

export function getRequiredEnv(name: string) {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}
