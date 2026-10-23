// Bootstraps the Supabase project for the admin dashboard:
//   1. runs supabase/schema.sql against the project via the Management API
//   2. fetches the project's anon + service_role API keys
//   3. writes/updates .env.local (Supabase keys + an ADMIN_PASSWORD)
//
// Needs a personal access token: https://supabase.com/dashboard/account/tokens
// Put it in .env.local as SUPABASE_ACCESS_TOKEN=..., or pass it as an argument:
//   node scripts/supabase-setup.mjs sbp_... [project-url]

import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_FILE = resolve(root, ".env.local");

function readEnv() {
  const env = {};
  if (!existsSync(ENV_FILE)) return env;
  for (const line of readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match) env[match[1]] = match[2];
  }
  return env;
}

const env = readEnv();
const token = process.argv[2] || env.SUPABASE_ACCESS_TOKEN;
if (!token || token.includes("your_")) {
  console.error(
    "No access token. Create one at https://supabase.com/dashboard/account/tokens,\n" +
      "then run: node scripts/supabase-setup.mjs <token> [<project-url>]"
  );
  process.exit(1);
}

const defaultUrl = "https://pnsjuyhrcitrrlfmchfm.supabase.co";
const projectUrl = process.argv[3] || env.NEXT_PUBLIC_SUPABASE_URL || defaultUrl;
if (!projectUrl.includes("your_") && existsSync(ENV_FILE)) {
  // normalize to exactly what .env.local should hold
  env._url = projectUrl;
} else {
  env._url = defaultUrl;
}

const ref = (env._url.match(/^https:\/\/([^.]+)\.supabase\.co/) ?? [])[1];
if (!ref) {
  console.error(`Could not read a project ref from "${env._url}".`);
  process.exit(1);
}

const API = "https://api.supabase.com";
const api = async (path, init = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${path} → ${res.status} ${JSON.stringify(body).slice(0, 400)}`);
  }
  return body;
};

// ---------------------------------------------------------------- run schema
const schemaSql = readFileSync(resolve(root, "supabase/schema.sql"), "utf8");
console.log(`Running schema against project '${ref}' …`);
try {
  await api(`/v1/projects/${ref}/database/query`, {
    method: "POST",
    body: JSON.stringify({ query: schemaSql }),
  });
  console.log("✓ schema.sql executed");
} catch (error) {
  const message = String(error.message ?? error);
  if (/already exists/i.test(message)) {
    console.log(`✓ schema already applied (continuing) — ${message}`);
  } else {
    console.error(`✗ schema failed: ${message}`);
    process.exit(1);
  }
}

// -------------------------------------------------------------- fetch keys
console.log("Fetching API keys …");
let anonKey, serviceKey;
try {
  const keys = await api(`/v1/projects/${ref}/api-keys?reveal=true`);
  const flat = Array.isArray(keys) ? keys : keys?.keys ?? [];
  for (const entry of flat) {
    const name = String(entry?.name ?? entry?.type ?? "").toLowerCase();
    const value = entry?.api_key ?? entry?.secret_key ?? entry?.value;
    if (!value) continue;
    if (/\b(anon|publishable)\b/.test(name) && !anonKey) anonKey = value;
    if (/\b(service.?role|secret)\b/.test(name) && !serviceKey) serviceKey = value;
  }
} catch (error) {
  console.error(`✗ could not fetch keys: ${error.message}`);
  console.error("  You can copy them by hand: Dashboard → Project Settings → API keys");
}
if (!anonKey || !serviceKey) {
  console.error("✗ Could not determine both keys. Paste them into .env.local manually.");
  process.exit(1);
}
console.log(
  `✓ keys fetched (anon ${anonKey.slice(0, 8)}…, service ${serviceKey.slice(0, 8)}…)`
);

// --------------------------------------------------------------- write env
if (!existsSync(ENV_FILE)) {
  // start from the example so anything documented stays documented
  const example = resolve(root, ".env.local.example");
  if (existsSync(example)) {
    copy: {
      const src = readFileSync(example, "utf8");
      writeFileSync(ENV_FILE, src, "utf8");
      break copy;
    }
  }
}

let dotEnv = readFileSync(ENV_FILE, "utf8");
const setLine = (key, value) => {
  const re = new RegExp(`^\\s*${key}\\s*=.*$`, "m");
  if (re.test(dotEnv)) {
    dotEnv = dotEnv.replace(re, `${key}=${value}`);
  } else {
    dotEnv = `${dotEnv.trimEnd()}\n${key}=${value}\n`;
  }
};

setLine("NEXT_PUBLIC_SUPABASE_URL", env._url);
setLine("NEXT_PUBLIC_SUPABASE_ANON_KEY", anonKey);
setLine("SUPABASE_SERVICE_ROLE_KEY", serviceKey);
if (!env.ADMIN_PASSWORD) {
  setLine("ADMIN_PASSWORD", `pjc-admin-${randomBytes(4).toString("hex")}`);
} else {
  setLine("ADMIN_PASSWORD", env.ADMIN_PASSWORD);
}

writeFileSync(ENV_FILE, dotEnv, "utf8");
console.log(`✓ .env.local updated (${resolve(root, ".env.local")})`);

// ------------------------------------------------------------------ report
const finalEnv = readEnv();
const password = finalEnv.ADMIN_PASSWORD;
if (password && !env.ADMIN_PASSWORD) {
  console.log(`\nGenerated admin password: ${password}`);
  console.log("(It is stored in .env.local — change it anytime with ADMIN_PASSWORD=...)");
}
console.log("\nNext: restart the dev server, open http://localhost:3000/admin/login and sign in.");
