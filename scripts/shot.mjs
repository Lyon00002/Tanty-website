// Screenshot helper: node scripts/shot.mjs <url> <out.png> [width] [height] [full|viewport] [light|dark]
// Reduced motion by default; prefix MOTION=1 to capture with motion, SCROLL=<selector|px> to capture a scrolled viewport.
import { chromium } from "playwright-core";

const [url, out, w = "1440", h = "900", mode = "viewport", scheme = "light"] = process.argv.slice(2);
if (!url || !out) {
  console.error("usage: node scripts/shot.mjs <url> <out.png> [width] [height] [full|viewport] [light|dark]");
  process.exit(1);
}
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  // 2x for small viewports, except full-page captures (Chrome caps captures at 16384 px).
  deviceScaleFactor: Number(w) < 600 && mode !== "full" ? 2 : 1,
  colorScheme: scheme,
  reducedMotion: process.env.MOTION === "1" ? "no-preference" : "reduce",
});
// The dev server keeps an HMR socket open, so "networkidle" never fires: wait for load instead.
await page.goto(url, { waitUntil: "load", timeout: 90_000 });
await page.evaluate(() => document.fonts.ready);
// Hide the Next.js dev overlay badge and error portal.
await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });
if (mode === "full") {
  // Walk the page so lazy content and scroll-triggered states settle.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
} else if (process.env.SCROLL) {
  // SCROLL=<selector or px>: bring a section into view, let scroll-driven states settle.
  const target = process.env.SCROLL;
  await page.evaluate(async (t) => {
    const el = /^\d+$/.test(t) ? null : document.querySelector(t);
    const y = el ? el.getBoundingClientRect().top + window.scrollY - 120 : Number(t);
    for (let s = 0; s <= y; s += 200) {
      window.scrollTo(0, s);
      await new Promise((r) => setTimeout(r, 30));
    }
    window.scrollTo(0, y);
  }, target);
  await page.waitForTimeout(1500);
} else {
  await page.waitForTimeout(500);
}
await page.screenshot({ path: out, fullPage: mode === "full" });
await browser.close();
console.log("saved", out);
