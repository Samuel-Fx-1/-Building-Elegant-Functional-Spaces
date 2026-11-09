const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ORIGINAL = "https://resident-virgina-z5mpray2.cmsfly.com/contact-page";
const CLONE = "http://localhost:3000/contact";

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
      bg: cs.backgroundColor,
      br: cs.borderRadius,
    };
  };
  const sections = [...document.querySelectorAll("section")].map((el) => ({
    cls: el.className,
    ...box(el),
  }));
  const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map((el) => ({
    tag: el.tagName,
    text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 60),
    ...box(el),
  }));
  const formEls = [
    ...document.querySelectorAll(
      ".dorik-form input, .dorik-form textarea, .dorik-form button, .contact-form input, .contact-form textarea, .contact-form button"
    ),
  ].map((el) => ({
    tag: el.tagName,
    type: el.getAttribute("type"),
    name: el.getAttribute("name"),
    ...box(el),
  }));
  const images = [...document.querySelectorAll("section img")]
    .slice(0, 8)
    .map((el) => ({ src: el.getAttribute("src"), ...box(el) }));
  const footer = document.querySelector("footer, .dorik-footer");
  const footerParts = footer
    ? [...footer.querySelectorAll("img,h3,h4,p,a")]
        .slice(0, 20)
        .map((el) => ({
          tag: el.tagName,
          text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 40),
          ...box(el),
        }))
    : [];
  return { sections, headings, formEls, images, footer: box(footer), footerParts };
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
    await page.screenshot({
      path: `data/clone/compare-${label}-contact.png`,
      fullPage: true,
    });
    await page.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
