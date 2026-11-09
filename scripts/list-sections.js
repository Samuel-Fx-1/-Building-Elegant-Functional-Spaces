const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
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
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (const [name, route] of pages) {
    await page.goto("http://localhost:3000" + route, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const sections = await page.evaluate(() =>
      [...document.querySelectorAll("main section")].map((s, i) => {
        const r = s.getBoundingClientRect();
        return {
          i,
          cls: s.className,
          y: Math.round(r.y + window.scrollY),
          h: Math.round(r.height),
          heading: (s.querySelector("h1, h2")?.textContent || "").trim().slice(0, 60),
        };
      })
    );
    console.log(name, JSON.stringify(sections));
  }
  await browser.close();
})();
