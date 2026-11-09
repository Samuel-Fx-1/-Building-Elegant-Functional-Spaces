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
  const data = await page.evaluate(() => {
    const sections = [...document.querySelectorAll("#__next section")];
    const out = [];
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const r = s.getBoundingClientRect();
      const texts = [...s.querySelectorAll("h2,h3,h4,h5,h6,p,img")]
        .slice(0, 80)
        .map((el) => {
          const b = el.getBoundingClientRect();
          const c = getComputedStyle(el);
          return {
            tag: el.tagName,
            text: el.tagName === "IMG" ? el.getAttribute("src")?.split("/").pop() : el.textContent.trim().slice(0, 70),
            y: Math.round(b.y + window.scrollY),
            h: Math.round(b.height),
            opacity: c.opacity,
            visibility: c.visibility,
            display: c.display,
          };
        })
        .filter((x) => x.text);
      out.push({
        i,
        cls: s.className,
        y: Math.round(r.y + window.scrollY),
        h: Math.round(r.height),
        texts,
      });
    }
    return {
      scrollHeight: document.body.scrollHeight,
      sections: out,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
