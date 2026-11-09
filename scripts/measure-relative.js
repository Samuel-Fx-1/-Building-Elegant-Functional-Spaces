const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ORIGINAL = "https://resident-virgina-z5mpray2.cmsfly.com/contact-page";
const CLONE = "http://localhost:3000/contact";

const measure = () => {
  const result = [];
  const sections = [...document.querySelectorAll("section")];
  for (const section of sections) {
    const sr = section.getBoundingClientRect();
    const entries = [];
    const nodes = section.querySelectorAll(
      "h1,h2,h3,h4,h5,h6,p,label,input,textarea,button,form,img,a,ul"
    );
    for (const el of nodes) {
      if (el.closest(".dorik-navbar") || el.closest(".site-header")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      const cs = getComputedStyle(el);
      const text = (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40);
      entries.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className).slice(0, 36),
        text,
        x: Math.round(r.x - sr.x),
        y: Math.round(r.y - sr.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
        fs: cs.fontSize,
        lh: cs.lineHeight,
        fw: cs.fontWeight,
        mar: cs.margin,
        pad: cs.padding,
      });
    }
    result.push({
      idx: sections.indexOf(section),
      cls: section.className,
      h: Math.round(sr.height),
      entries: entries.slice(0, 45),
    });
  }
  return result;
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
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.6) {
        window.scrollTo(0, y);
        await delay(200);
      }
      window.scrollTo(0, document.body.scrollHeight);
      await delay(1200);
      window.scrollTo(0, 0);
      await delay(800);
    });
    await new Promise((r) => setTimeout(r, 1000));
    const data = await page.evaluate(measure);
    console.log("=== " + label + " ===");
    for (const section of data) {
      console.log(`SECTION ${section.idx} ${section.cls} h=${section.h}`);
      for (const e of section.entries) {
        console.log(
          `${e.tag.padEnd(7)} x=${String(e.x).padStart(4)} y=${String(e.y).padStart(4)} w=${String(e.w).padStart(4)} h=${String(e.h).padStart(3)} fs=${e.fs}/${e.lh} fw=${e.fw} | ${e.text} | ${e.cls} | mar=${e.mar}`
        );
      }
    }
    await page.close();
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
