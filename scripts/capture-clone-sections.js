const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUT = path.join(__dirname, "..", "data", "clone", "sections");
const pages = [
  ["home", "/"],
  ["about", "/about"],
  ["services", "/services"],
  ["projects", "/projects"],
  ["project-detail", "/projects/elmwood-grand-heights"],
  ["blog", "/blog"],
  ["post", "/blog/understanding-property-taxes-before-you-buy"],
  ["contact", "/contact"],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);

  for (const [name, route] of pages) {
    await page.goto("http://localhost:3000" + route, { waitUntil: "networkidle0", timeout: 30000 });
    await page.addStyleTag({
      content: `
        *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
        [data-reveal] { opacity: 1 !important; transform: none !important; visibility: visible !important; }
        .reveal { opacity: 1 !important; transform: none !important; }
      `,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      await Promise.all([...document.images].map((img) => {
        img.loading = "eager";
        img.removeAttribute("loading");
        if (img.complete && img.naturalWidth > 0) return true;
        return new Promise((res) => {
          img.addEventListener("load", res, { once: true });
          img.addEventListener("error", res, { once: true });
          setTimeout(res, 5000);
        });
      }));
    });
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 25));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 150));
    });

    const blocks = await page.evaluate(() => {
      const main = document.querySelector("main");
      const footer = document.querySelector(".site-footer");
      const items = [...main.children]
        .filter((el) => el.matches("section, article, .hero, .inner-hero, .project-title-block"))
        .map((el, i) => {
          const r = el.getBoundingClientRect();
          return {
            index: i,
            cls: el.className,
            y: Math.round(r.y + window.scrollY),
            h: Math.round(r.height),
          };
        });
      if (footer) {
        const r = footer.getBoundingClientRect();
        items.push({ index: items.length, cls: "site-footer", y: Math.round(r.y + window.scrollY), h: Math.round(r.height) });
      }
      return items;
    });

    for (const block of blocks) {
      const slice = await page.evaluate((info) => {
        const main = document.querySelector("main");
        const footer = document.querySelector(".site-footer");
        const els = [...main.children].filter((el) => el.matches("section, article, .hero, .inner-hero, .project-title-block"));
        const el = info.cls === "site-footer" ? footer : els[info.index];
        const r = el.getBoundingClientRect();
        return { x: 0, y: Math.round(r.y + window.scrollY), w: document.documentElement.clientWidth, h: Math.round(r.height) };
      }, block);
      await page.screenshot({
        path: path.join(OUT, `${name}-${block.index}.png`),
        clip: { x: 0, y: slice.y, width: slice.w, height: slice.h },
        captureBeyondViewport: true,
      });
    }
    console.log(`${name}: ${blocks.length} blocks`, blocks.map((b) => `${b.index}:${b.h}`).join(" "));
  }

  await browser.close();
})();
