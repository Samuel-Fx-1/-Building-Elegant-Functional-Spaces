const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function measure(page, base, route, selector) {
  await page.goto(base + route, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));
  await page.addStyleTag({ content: `[data-aos]{opacity:1!important;transform:none!important;visibility:visible!important;transition:none!important} *{animation:none!important}` });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((img) => (img.complete && img.naturalWidth > 0) ? true : new Promise((res) => {
      img.addEventListener("load", res, { once: true });
      img.addEventListener("error", res, { once: true });
      setTimeout(res, 3000);
    })));
  });
  return page.evaluate((selector) => {
    const sec = document.querySelector(selector);
    if (!sec) return null;
    const sr = sec.getBoundingClientRect();
    const rel = (el) => {
      const r = el.getBoundingClientRect();
      const c = getComputedStyle(el);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y - sr.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        pad: c.padding,
        mar: c.margin,
        fs: c.fontSize,
        lh: c.lineHeight,
        fw: c.fontWeight,
      };
    };
    return {
      section: { x: Math.round(sr.x), y: Math.round(sr.y + window.scrollY), w: Math.round(sr.width), h: Math.round(sr.height), pad: getComputedStyle(sec).padding },
      images: [...sec.querySelectorAll("img")].map(rel),
      titles: [...sec.querySelectorAll("h3,h4")].map(rel),
      texts: [...sec.querySelectorAll("p")].map(rel),
    };
  }, selector);
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (const [label, base, route, selector] of [
    ["LIVE HOME", "https://resident-virgina-z5mpray2.cmsfly.com", "/", "#__next section:nth-of-type(2)"],
    ["CLONE HOME", "http://localhost:3000", "/", ".section--features"],
    ["LIVE ABOUT", "https://resident-virgina-z5mpray2.cmsfly.com", "/about-page", "#__next section:nth-of-type(4)"],
    ["CLONE ABOUT", "http://localhost:3000", "/about", "main > section:nth-of-type(4)"],
  ]) {
    console.log("=== " + label + " ===");
    console.log(JSON.stringify(await measure(page, base, route, selector), null, 2));
  }
  await browser.close();
})();
