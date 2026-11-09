const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "https://resident-virgina-z5mpray2.cmsfly.com";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));
  await page.addStyleTag({
    content: `[data-aos]{opacity:1!important;transform:none!important;transition:none!important} *{animation:none!important;scroll-behavior:auto!important}`,
  });
  await page.evaluate(() => document.querySelectorAll("img").forEach((i) => { i.loading = "eager"; i.removeAttribute("loading"); }));
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.evaluate(async () => {
    await Promise.all([...document.images].map((img) => (img.complete && img.naturalWidth > 0) ? true : new Promise((res) => {
      img.addEventListener("load", res, { once: true });
      img.addEventListener("error", res, { once: true });
      setTimeout(res, 5000);
    })));
  });
  const data = await page.evaluate(() => {
    const s = document.querySelectorAll("#__next section")[4];
    const r = s.getBoundingClientRect();
    const rows = [...s.querySelectorAll("h3")].map((h) => {
      const b = h.getBoundingClientRect();
      return { title: h.textContent.trim(), y: Math.round(b.y + window.scrollY), h: Math.round(b.height) };
    });
    const imgs = [...s.querySelectorAll("img")].map((img) => {
      const b = img.getBoundingClientRect();
      return { src: img.getAttribute("src")?.split("/").pop(), y: Math.round(b.y + window.scrollY), w: Math.round(b.width), h: Math.round(b.height), natural: img.naturalWidth + "x" + img.naturalHeight };
    });
    return {
      scrollHeight: document.body.scrollHeight,
      section: { y: Math.round(r.y + window.scrollY), h: Math.round(r.height) },
      htmlText: s.innerText.slice(0, 2000),
      rows,
      imgs,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  const el = await page.$("#__next section:nth-of-type(5)");
  await page.evaluate(() => {
    const s = document.querySelectorAll("#__next section")[4];
    s.scrollIntoView({ block: "start" });
  });
  await new Promise((r) => setTimeout(r, 800));
  await el.screenshot({ path: "data/original-home-services.png" });
  await browser.close();
})();
