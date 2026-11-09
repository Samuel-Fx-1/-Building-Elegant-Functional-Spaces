const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ORIGINAL = "https://resident-virgina-z5mpray2.cmsfly.com/";
const CLONE = "http://localhost:3000/";

const measure = () => {
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      x: Math.round(r.x),
      y: Math.round(r.y + scrollY),
      w: Math.round(r.width),
      h: Math.round(r.height),
      fs: cs.fontSize,
      lh: cs.lineHeight,
      pad: cs.padding,
      mar: cs.margin,
    };
  };
  const q = (sel) => box(document.querySelector(sel));
  const nav = document.querySelector("header, .dorik-navbar, .site-header");
  const navInner = document.querySelector(".dorik-navbar, .site-header__inner");
  const navLinks = [...document.querySelectorAll("nav a, .dorik-nav--link")].slice(0, 8).map((a) => ({
    text: a.textContent.trim(),
    ...box(a),
  }));
  return {
    nav: box(nav),
    navInner: box(navInner),
    logo: box(document.querySelector(".dorik-navbar--brand img, .site-brand img")),
    heroTitle: q("h1"),
    heroEyebrow: box(document.querySelector(".dorik-iconText-5l2y7cut, .hero__eyebrow")),
    heroText: box(
      document.querySelector(
        ".dorik-text-yoatfu70, .hero__text, .inner-hero p"
      )
    ),
    heroButton: box(
      document.querySelector(
        ".dorik-button-q2niagms, .hero .btn, .inner-hero .btn"
      )
    ),
    heroImage: box(document.querySelector(".dorik-image-ggzg8xxc, .hero__person")),
    heroSection: box(
      document.querySelector(
        ".dorik-section-c3lq9t5g, .hero, .inner-hero"
      )
    ),
    navLinks,
  };
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });
  for (const [label, url] of [
    ["original", ORIGINAL],
    ["clone", CLONE],
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    try {
      const res = await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      console.log(label, "status", res && res.status());
      await new Promise((r) => setTimeout(r, 1500));
      console.log(label, JSON.stringify(await page.evaluate(measure), null, 2));
    } catch (error) {
      console.log(label, "ERROR", error.message);
    }
    await page.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
