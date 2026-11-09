const puppeteer = require("puppeteer-core");
const fs = require("fs");

const targets = [
  ["home", "/"],
  ["about", "/about-page"],
  ["services", "/services-page"],
  ["projects", "/project-page"],
  ["blog", "/blog-page"],
  ["contact", "/contact-page"],
  ["project-detail", "/Projects-Details/Elmwood-Grand-Heights"],
  ["post", "/post/Understanding-Property-Taxes-Before-You-Buy"],
];

(async () => {
  fs.mkdirSync("data/sections", { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  for (const [name, path] of targets) {
    try {
      await page.goto("https://resident-virgina-z5mpray2.cmsfly.com" + path, { waitUntil: "networkidle2", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 2000));
      await page.addStyleTag({
        content: `[data-aos]{opacity:1!important;transform:none!important;transition:none!important} *{animation:none!important;scroll-behavior:auto!important}`,
      });
      await page.evaluate(() => document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; i.removeAttribute("loading"); }));
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
      });
      await new Promise((r) => setTimeout(r, 1000));
      await page.evaluate(async () => {
        await Promise.all([...document.images].map((img) => (img.complete && img.naturalWidth > 0) ? true : new Promise((res) => {
          img.addEventListener("load", res, { once: true });
          img.addEventListener("error", res, { once: true });
          setTimeout(res, 6000);
        })));
      });
      const count = await page.evaluate(() => document.querySelectorAll("#__next section").length);
      for (let i = 0; i < count; i++) {
        const sel = `#__next section:nth-of-type(${i + 1})`;
        const el = await page.$(sel);
        if (!el) continue;
        await page.evaluate((idx) => {
          const s = document.querySelectorAll("#__next section")[idx];
          s.scrollIntoView({ block: "start" });
        }, i);
        await new Promise((r) => setTimeout(r, 300));
        try {
          await el.screenshot({ path: `data/sections/${name}-${i}.png` });
        } catch (e) {
          console.log(`${name}-${i} err ${e.message.slice(0, 60)}`);
        }
      }
      console.log(`${name}: ${count} sections`);
    } catch (e) {
      console.log(`${name}: ERROR ${e.message}`);
    }
  }
  await browser.close();
})();
