#!/usr/bin/env node
/**
 * Records each case-study hero's autoplay loop into a GIF.
 *
 *   node scripts/record-gifs.mjs [baseUrl] [slug ...]
 *   default baseUrl: http://127.0.0.1:3100  (a static server over ./out)
 *
 * For each slug: opens /work/<slug>/, switches the hero stage to the Animation tier,
 * screenshots the stage every FRAME_MS for DURATION_MS, then encodes with ffmpeg
 * (two-pass palette) to public/work/<slug>/hero.gif at 12 fps, 960px wide.
 * Requires: ffmpeg on PATH, Google Chrome installed, puppeteer-core (devDependency).
 */
import puppeteer from "puppeteer-core";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const base = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://127.0.0.1:3100";
const slugs = process.argv.slice(process.argv[2]?.startsWith("http") ? 3 : 2);
const ALL = ["rcs-studio", "provisioning", "making-the-team-faster", "stride"];
const DURATION = { "rcs-studio": 32000, provisioning: 13000, "making-the-team-faster": 13000, stride: 10000 };
const FRAME_MS = 125; // 8 fps capture; encoded at the same rate
const WIDTH = 1200;

const targets = slugs.length ? slugs : ALL;
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-first-run", "--no-default-browser-check", "--hide-scrollbars", `--window-size=${WIDTH},900`],
  defaultViewport: { width: WIDTH, height: 900, deviceScaleFactor: 1 },
});

try {
  for (const slug of targets) {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
    await page.goto(`${base}/work/${slug}/`, { waitUntil: "networkidle0" });
    // switch the stage to the Animation tier
    await page.waitForSelector('figure [role="group"] button[title="Animation"]', { timeout: 15000 });
    await page.click('figure [role="group"] button[title="Animation"]');
    await new Promise((r) => setTimeout(r, 300));
    const stage = await page.$("figure > div:first-child");
    const box = await stage.boundingBox();

    const dir = join("/tmp", `gif-${slug}`);
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir, { recursive: true });

    const total = DURATION[slug] ?? 12000;
    const frames = Math.ceil(total / FRAME_MS);
    const t0 = Date.now();
    for (let i = 0; i < frames; i++) {
      const due = t0 + i * FRAME_MS;
      const wait = due - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      await page.screenshot({
        path: join(dir, `f${String(i).padStart(4, "0")}.png`),
        clip: { x: box.x, y: box.y, width: Math.round(box.width), height: Math.round(box.height) },
      });
    }
    await page.close();

    const outDir = join("public", "work", slug);
    mkdirSync(outDir, { recursive: true });
    const out = join(outDir, "hero.gif");
    const fps = Math.round(1000 / FRAME_MS);
    const palette = join(dir, "palette.png");
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(dir, "f%04d.png"),
      "-vf", "scale=960:-1:flags=lanczos,palettegen=max_colors=160:stats_mode=diff", palette]);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(fps), "-i", join(dir, "f%04d.png"), "-i", palette,
      "-lavfi", "scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle",
      "-loop", "0", out]);
    rmSync(dir, { recursive: true, force: true });
    const kb = Math.round(statSync(out).size / 1024);
    console.log(`${slug}: ${frames} frames → ${out} (${kb} KB)`);
    if (!existsSync(out)) throw new Error(`no gif for ${slug}`);
  }
} finally {
  await browser.close();
}
