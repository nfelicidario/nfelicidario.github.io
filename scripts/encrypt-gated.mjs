#!/usr/bin/env node
/**
 * Encrypts every gated page in ./gated-src into ./src/content/gated.
 *
 * Layout:
 *   gated-src/<slug>/index.html   self-contained HTML (inline CSS/JS/images as data URIs)
 *   src/content/gated/<slug>.json { v, kdf, iterations, salt, iv, ct }   committed
 *
 * The passphrase comes from PORTFOLIO_GATE_PASSPHRASE. Nothing in gated-src is
 * ever committed; only the ciphertext is. The browser derives the same key with
 * WebCrypto PBKDF2-SHA256 and decrypts with AES-256-GCM.
 *
 * Usage: PORTFOLIO_GATE_PASSPHRASE="four words here" npm run gate
 */
import { createCipheriv, pbkdf2Sync, randomBytes } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ITERATIONS = 600_000;
const SRC = "gated-src";
const OUT = join("src", "content", "gated");

const pass = process.env.PORTFOLIO_GATE_PASSPHRASE;
if (!pass || pass.length < 16) {
  console.error("Set PORTFOLIO_GATE_PASSPHRASE to a passphrase of at least 16 characters.");
  process.exit(1);
}
if (!existsSync(SRC)) {
  console.error(`No ${SRC}/ folder found.`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const slugs = readdirSync(SRC).filter((d) => statSync(join(SRC, d)).isDirectory());
for (const slug of slugs) {
  const file = join(SRC, slug, "index.html");
  if (!existsSync(file)) {
    console.warn(`skip ${slug}: no index.html`);
    continue;
  }
  const plaintext = readFileSync(file);
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(pass, salt, ITERATIONS, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);
  const out = {
    v: 1,
    kdf: "PBKDF2-SHA256",
    iterations: ITERATIONS,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    ct: ct.toString("base64"),
  };
  writeFileSync(join(OUT, `${slug}.json`), JSON.stringify(out));
  console.log(`encrypted ${slug} (${plaintext.length} bytes → ${ct.length} bytes)`);
}
