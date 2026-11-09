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
  return {
    scrollY,
    nav: box(document.querySelector(".dorik-navbar, .site-header__inner")),
    logo: box(document.querySelector(".dorik-navbar--brand img, .site-brand img")),
    heroSection: box(document.querySelector(".dorik-section-c3lq9t5g, .hero")),
    eyebrow: box(document.querySelector(".dorik-iconText-5l2y7cut")),
    title: box(document.querySelector(".dorik-heading-ropoqpn9-wrapper, .hero h1")),
    text: box(document.querySelector(".dorik-text-yoatfu70, .hero__text")),
    button: box(document.querySelector(".dorik-button-q2niagms, .hero .btn")),
    personWrap: box(
      document.querySelector(".dorik-container-kwjuh3cx, .hero__person")
    ),
    person: box(document.querySelector(".dorik-image-ggzg8xxc, .hero__person")),
    buttonCta: box(document.querySelector(".dorik-nav--btn, .nav-cta")),
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
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 4000));
    console.log(label, JSON.stringify(await page.evaluate(measure), null, 2));
    await page.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
