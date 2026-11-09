const puppeteer = require("puppeteer-core");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle0" });
  const data = await page.evaluate(() => {
    const p = document.querySelector(".newsletter__head p");
    const clone = p.cloneNode(true);
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.width = "auto";
    clone.style.maxWidth = "none";
    clone.style.whiteSpace = "nowrap";
    document.body.appendChild(clone);
    const natural = clone.getBoundingClientRect().width;
    clone.remove();

    const footer = document.querySelector(".site-footer");
    const fr = footer.getBoundingClientRect();
    const rel = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: Math.round(r.x),
        y: Math.round(r.y - fr.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fs: cs.fontSize,
        lh: cs.lineHeight,
        mar: cs.margin,
      };
    };
    const formFields = [...document.querySelectorAll(".contact-form > *")].map((el) => {
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, cls: el.className, y: Math.round(r.y), h: Math.round(r.height) };
    });
    return {
      naturalTextWidth: Math.round(natural),
      footer: { h: Math.round(fr.height), pad: getComputedStyle(footer).padding },
      grid: rel(".site-footer__grid"),
      brand: rel(".site-footer__brand"),
      logoLink: rel(".site-footer__logo"),
      logo: rel(".site-footer__logo img"),
      tagline: rel(".site-footer__brand p"),
      socialLabel: rel(".site-footer__social-label"),
      socialList: rel(".social-list"),
      quickHeading: rel(".site-footer__col h3"),
      quickFirst: rel(".footer-links a"),
      bottom: rel(".site-footer__bottom"),
      copyright: rel(".site-footer__bottom p"),
      legal: rel(".site-footer__legal"),
      formFields,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
