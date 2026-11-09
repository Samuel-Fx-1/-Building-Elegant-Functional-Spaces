const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, "..", "data", "clone");

const pages = [
  ["home", "/"],
  ["about", "/about"],
  ["services", "/services"],
  ["projects", "/projects"],
  ["project-detail", "/projects/elmwood-grand-heights"],
  ["blog", "/blog"],
  ["post", "/blog/understanding-property-taxes-before-you-buy"],
  ["contact", "/contact"],
  ["404", "/does-not-exist"],
];

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const step = window.innerHeight * 0.75;

    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(120);
    }

    window.scrollTo(0, document.body.scrollHeight);
    await delay(500);
    window.scrollTo(0, 0);
    await delay(300);
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });

  const report = { desktop: [], mobile: [] };

  const run = async (deviceLabel, viewport, routes) => {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);

    const errors = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("requestfailed", (request) => {
      errors.push(`requestfailed: ${request.url()} — ${request.failure()?.errorText}`);
    });

    for (const [name, route] of routes) {
      errors.length = 0;
      const response = await page.goto(BASE + route, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      await scrollThrough(page);
      await page.screenshot({
        path: path.join(OUT, `${deviceLabel}-${name}.png`),
        fullPage: true,
      });

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        height: document.body.scrollHeight,
        title: document.title,
        h1: document.querySelector("h1")?.textContent.trim() || "",
      }));

      const result = {
        name,
        route,
        status: response ? response.status() : null,
        ...metrics,
        errors: [...errors],
      };

      report[deviceLabel].push(result);
      console.log(JSON.stringify(result));
    }

    await page.close();
  };

  await run("desktop", { width: 1440, height: 900 }, pages);
  await run(
    "mobile",
    { width: 390, height: 844, isMobile: true, hasTouch: true },
    pages.slice(0, 8)
  );

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
