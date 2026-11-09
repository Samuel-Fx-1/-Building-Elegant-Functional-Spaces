const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  await page.goto("https://resident-virgina-z5mpray2.cmsfly.com/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));
  await page.addStyleTag({ content: `[data-aos]{opacity:1!important;transform:none!important;transition:none!important} *{animation:none!important}` });
  await page.evaluate(() => { document.querySelectorAll("img").forEach(i => { i.loading = "eager"; }); });
  await page.evaluate(async () => { window.scrollTo(0, 2000); await new Promise(r => setTimeout(r, 1500)); window.scrollTo(0, 3300); await new Promise(r => setTimeout(r, 1500)); });
  await page.screenshot({ path: "data/screens/debug-services.png" });
  const svc = await page.evaluate(() => {
    const s = [...document.querySelectorAll('#__next section')][4];
    const els = [...s.querySelectorAll('h2,h3,p,img')].map(e => {
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return { tag: e.tagName, text: (e.textContent || '').slice(0, 40), opacity: cs.opacity, visibility: cs.visibility, display: cs.display, transform: cs.transform, color: cs.color, w: r.width, h: r.height, y: r.y, nw: e.naturalWidth };
    });
    return { html: s.innerHTML.slice(0, 2000), els: els.slice(0, 30) };
  });
  console.log(JSON.stringify(svc, null, 1));
  await browser.close();
})();
