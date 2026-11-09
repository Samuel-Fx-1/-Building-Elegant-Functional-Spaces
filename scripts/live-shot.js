const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ORIGINAL = "https://resident-virgina-z5mpray2.cmsfly.com/";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(ORIGINAL, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));
  console.log(
    await page.evaluate(() => {
      return {
        scrollY,
        title: document.title,
        h1s: [...document.querySelectorAll("h1")].map((el) => {
          const r = el.getBoundingClientRect();
          return {
            text: el.textContent.trim().slice(0, 50),
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height,
            parent: el.closest("section")?.className,
          };
        }),
        sections: [...document.querySelectorAll("section")].slice(0, 4).map((el) => {
          const r = el.getBoundingClientRect();
          return { cls: el.className, y: r.y, h: r.height };
        }),
        bodyTransform: getComputedStyle(document.body).transform,
      };
    })
  );
  await page.screenshot({ path: "data/clone/live-original-top.png" });
  await browser.close();
})();
