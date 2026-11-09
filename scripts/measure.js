const puppeteer = require("puppeteer-core");
const path = require("node:path");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, "..", "data", "clone");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const [name, route] of [
    ["home", "/"],
    ["contact", "/contact"],
    ["about", "/about"],
    ["projects", "/projects"],
  ]) {
    await page.goto(BASE + route, { waitUntil: "networkidle0" });
    const data = await page.evaluate(() => {
      const rect = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          top: Math.round(r.top + scrollY),
          height: Math.round(r.height),
          width: Math.round(r.width),
          padding: cs.padding,
          font: `${cs.fontSize}/${cs.lineHeight}`,
        };
      };
      const skip = document.querySelector(".skip-link");
      const skipCS = skip ? getComputedStyle(skip) : null;
      return {
        header: rect(".site-header__inner"),
        hero: rect(".hero"),
        innerHero: rect(".inner-hero"),
        heroTitle: rect(".hero h1, .inner-hero h1"),
        heroText: rect(".hero__text, .inner-hero p"),
        firstSection: rect("main > section:nth-of-type(2)"),
        footer: rect(".site-footer"),
        footerBottom: rect(".site-footer__bottom"),
        skip: skipCS && {
          transform: skipCS.transform,
          top: skipCS.top,
          rectTop: Math.round(skip.getBoundingClientRect().top + scrollY),
          visible: skip.getBoundingClientRect().bottom > 0,
        },
        logo: (() => {
          const img = document.querySelector(".site-brand img");
          if (!img) return null;
          return {
            src: img.getAttribute("src"),
            natural: `${img.naturalWidth}x${img.naturalHeight}`,
            rect: `${Math.round(img.getBoundingClientRect().width)}x${Math.round(img.getBoundingClientRect().height)}`,
          };
        })(),
      };
    });
    console.log(name, JSON.stringify(data, null, 2));
    await page.screenshot({
      path: path.join(OUT, `viewport-${name}.png`),
      fullPage: false,
    });
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
