const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "https://resident-virgina-z5mpray2.cmsfly.com";

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (const [label, route, idx] of [["HOME-FEATURES", "/", 1], ["ABOUT-FEATURES", "/about-page", 3], ["LOGO-STRIP", "/", 3], ["ABOUT-LOGO-STRIP", "/about-page", 2]]) {
    await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));
    await page.addStyleTag({ content: `[data-aos]{opacity:1!important;transform:none!important;visibility:visible!important;transition:none!important} *{animation:none!important}` });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    await page.evaluate(async () => {
      await Promise.all([...document.images].map((img) => (img.complete && img.naturalWidth > 0) ? true : new Promise((res) => {
        img.addEventListener("load", res, { once: true });
        img.addEventListener("error", res, { once: true });
        setTimeout(res, 4000);
      })));
    });
    await new Promise((r) => setTimeout(r, 300));
    const data = await page.evaluate((idx) => {
      const rect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const c = getComputedStyle(el);
        return {
          x: Math.round(r.x),
          y: Math.round(r.y + window.scrollY),
          relY: null,
          w: Math.round(r.width),
          h: Math.round(r.height),
          pad: c.padding,
          mar: c.margin,
          fs: c.fontSize,
          lh: c.lineHeight,
          fw: c.fontWeight,
          vis: c.visibility,
          op: c.opacity,
        };
      };
      const s = document.querySelectorAll("#__next section")[idx];
      const sr = s.getBoundingClientRect();
      const base = Math.round(sr.y + window.scrollY);
      const rel = (el) => {
        const r = rect(el);
        if (r) r.relY = r.y - base;
        return r;
      };
      const section = rel(s);
      section.base = base;
      const feature = s.querySelector("h4")?.closest("div");
      const img = s.querySelector("img");
      const h4 = s.querySelector("h4");
      const p = s.querySelector("p");
      return {
        section,
        img: rel(img),
        feature: rel(feature),
        h4: rel(h4),
        p: rel(p),
        innerHTML: s.innerHTML.slice(0, 1500).replace(/\s+/g, " "),
      };
    }, idx);
    console.log("=== " + label + " ===");
    console.log(JSON.stringify(data, null, 2));
  }
  await browser.close();
})();
