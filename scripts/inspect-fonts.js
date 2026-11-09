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
  for (const [label, base] of [
    ["ORIGINAL", "https://resident-virgina-z5mpray2.cmsfly.com"],
    ["CLONE", "http://localhost:3000"],
  ]) {
    await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 1000));
    const data = await page.evaluate(() => {
      const faces = [];
      for (const sheet of document.styleSheets) {
        let rules;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of rules) {
          if (rule instanceof CSSFontFaceRule) {
            faces.push({
              family: rule.style.getPropertyValue("font-family"),
              weight: rule.style.getPropertyValue("font-weight"),
              style: rule.style.getPropertyValue("font-style"),
              src: rule.style.getPropertyValue("src"),
              unicodeRange: rule.style.getPropertyValue("unicode-range"),
            });
          }
        }
      }
      const measure = (family, weight) => {
        const c = document.createElement("canvas").getContext("2d");
        c.font = `${weight} 72px ${family}`;
        return {
          font: c.font,
          building: Math.round(c.measureText("Building").width * 100) / 100,
          buildingSpace: Math.round(c.measureText("Building ").width * 100) / 100,
          elegant: Math.round(c.measureText("Elegant").width * 100) / 100,
          full: Math.round(c.measureText("Building Elegant &").width * 100) / 100,
        };
      };
      return {
        fonts: [...document.fonts].map((f) => ({
          family: f.family,
          weight: f.weight,
          style: f.style,
          status: f.status,
        })),
        faces,
        measureAlbert: measure('"Albert Sans"', 700),
        measureInter: measure("Inter", 400),
        h1Font: getComputedStyle(document.querySelector("h1")).fontFamily,
        h1LetterSpacing: getComputedStyle(document.querySelector("h1")).letterSpacing,
      };
    });
    console.log("=== " + label + " ===");
    console.log(JSON.stringify(data, null, 2));
  }
  await browser.close();
})();
