const puppeteer = require("puppeteer-core");
const fs = require("fs");

const pages = [
  ["home", "/"],
  ["about", "/about-page"],
  ["services", "/services-page"],
  ["projects", "/project-page"],
  ["blog", "/blog-page"],
  ["contact", "/contact-page"],
  ["project-elmwood", "/Projects-Details/Elmwood-Grand-Heights"],
  ["project-riverstone", "/Projects-Details/Riverstone-Edge-Residences"],
  ["project-willow", "/Projects-Details/Willow-Park-Residences"],
  ["project-celestia", "/Projects-Details/Celestia-Grand-Residences"],
  ["project-arborea", "/Projects-Details/The-Arborea-Collection"],
  ["project-havenstone", "/Projects-Details/The-Havenstone-Residences"],
  ["post-taxes", "/post/Understanding-Property-Taxes-Before-You-Buy"],
  ["post-steps", "/post/Essential-Steps-Before-Buying-Your-First-Property"],
];

(async () => {
  fs.mkdirSync("data/screens", { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  for (const [name, path] of pages) {
    try {
      await page.goto("https://resident-virgina-z5mpray2.cmsfly.com" + path, {
        waitUntil: "load",
        timeout: 60000,
      });
      await new Promise((r) => setTimeout(r, 2500));
      await page.addStyleTag({
        content: `[data-aos]{opacity:1!important;transform:none!important;transition:none!important}
        *{animation:none!important}`
      });
      await page.evaluate(async () => {
        document.querySelectorAll("img").forEach((img) => {
          img.loading = "eager";
          img.removeAttribute("loading");
        });
        const step = 700;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 100));
        }
      });
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images].map((img) =>
            img.complete && img.naturalWidth > 0
              ? true
              : new Promise((resolve) => {
                  img.addEventListener("load", resolve, { once: true });
                  img.addEventListener("error", resolve, { once: true });
                  setTimeout(resolve, 8000);
                })
          )
        );
        window.scrollTo(0, 0);
      });
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: `data/screens/${name}.png`, fullPage: true });
      const loaded = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth > 0).length);
      console.log(`${name}: images ${loaded}/${await page.evaluate(() => document.images.length)}`);
    } catch (e) {
      console.log(`${name}: ERROR ${e.message}`);
    }
  }
  await browser.close();
})();
