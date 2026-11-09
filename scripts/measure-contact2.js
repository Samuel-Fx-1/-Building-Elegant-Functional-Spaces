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
      transform: cs.transform,
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
      "input, textarea, form button, .contact-form button, .newsletter button"
    ),
  ].map((el) => ({
    tag: el.tagName,
    type: el.getAttribute("type"),
    name: el.getAttribute("name") || el.textContent.trim().slice(0, 20),
    ...box(el),
  }));
  const images = [...document.querySelectorAll("section img")]
    .slice(0, 6)
    .map((el) => ({
      src: el.getAttribute("src")?.split("/").pop(),
      ...box(el),
    }));
  const last = [...document.querySelectorAll("section")].pop();
  const footerParts = last
    ? [...last.querySelectorAll("img,h3,h4,p,a,ul")]
        .slice(0, 18)
        .map((el) => ({
          tag: el.tagName,
          text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 40),
          ...box(el),
        }))
    : [];
  return { sections, headings, formEls, images, footerParts };
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

    await page.evaluate(async () => {
      const delay = (ms) => new Promise((r) => setTimeout(r, ms));
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.7) {
        window.scrollTo(0, y);
        await delay(180);
      }
      window.scrollTo(0, document.body.scrollHeight);
      await delay(1000);
      window.scrollTo(0, 0);
      await delay(600);
    });
    await new Promise((r) => setTimeout(r, 1500));

    console.log(label, JSON.stringify(await page.evaluate(measure), null, 2));
    await page.screenshot({
      path: `data/clone/settled-${label}-contact.png`,
      fullPage: true,
    });
    await page.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
