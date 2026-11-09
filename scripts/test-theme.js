const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "http://localhost:3000";
const OUT = path.join(__dirname, "..", "data", "theme");

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.setItem("theme", "dark"));
  await page.reload({ waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 600));

  const initial = await page.evaluate(() => {
    const toggle = document.querySelector("[data-theme-toggle]");
    const body = getComputedStyle(document.body);
    const card = document.querySelector(".blog-card");
    const section = document.querySelector(".section--features");
    return {
      theme: document.documentElement.dataset.theme,
      toggleLabel: toggle?.getAttribute("aria-label"),
      togglePressed: toggle?.getAttribute("aria-pressed"),
      bodyBg: body.backgroundColor,
      bodyColor: body.color,
      featureBg: section ? getComputedStyle(section).backgroundColor : null,
      cardBg: card ? getComputedStyle(card).backgroundColor : null,
      stored: localStorage.getItem("theme"),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });

  await page.screenshot({ path: path.join(OUT, "desktop-home-dark.png") });

  for (const [name, route] of [
    ["about", "/about"],
    ["services", "/services"],
    ["projects", "/projects"],
    ["project-detail", "/projects/elmwood-grand-heights"],
    ["blog", "/blog"],
    ["post", "/blog/understanding-property-taxes-before-you-buy"],
    ["contact", "/contact"],
  ]) {
    await page.goto(BASE + route, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({ path: path.join(OUT, `desktop-${name}-dark.png`) });
    const metrics = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    console.log(name, JSON.stringify(metrics));
  }

  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await page.click("[data-theme-toggle]");
  await new Promise((r) => setTimeout(r, 250));
  const toggled = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    stored: localStorage.getItem("theme"),
    label: document.querySelector("[data-theme-toggle]")?.getAttribute("aria-label"),
    pressed: document.querySelector("[data-theme-toggle]")?.getAttribute("aria-pressed"),
    bodyBg: getComputedStyle(document.body).backgroundColor,
  }));
  await page.screenshot({ path: path.join(OUT, "desktop-home-light.png") });

  await page.reload({ waitUntil: "networkidle0" });
  const persistedLight = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    stored: localStorage.getItem("theme"),
  }));

  await page.click("[data-theme-toggle]");
  await page.reload({ waitUntil: "networkidle0" });
  const persistedDark = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    stored: localStorage.getItem("theme"),
  }));

  const mobile = await browser.newPage();
  await mobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobile.goto(BASE + "/", { waitUntil: "networkidle0" });
  await mobile.evaluate(() => localStorage.setItem("theme", "dark"));
  await mobile.reload({ waitUntil: "networkidle0" });
  await mobile.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  const mobileBefore = await mobile.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    theme: document.documentElement.dataset.theme,
    toggleVisible: !!document.querySelector("[data-theme-toggle]")?.getClientRects().length,
  }));
  await mobile.click("[data-nav-toggle]");
  await new Promise((r) => setTimeout(r, 250));
  const mobileNav = await mobile.evaluate(() => ({
    expanded: document.querySelector("[data-nav-toggle]")?.getAttribute("aria-expanded"),
    navOpen: document.querySelector("#primary-nav")?.classList.contains("is-open"),
  }));
  await mobile.screenshot({ path: path.join(OUT, "mobile-home-dark-nav.png") });
  await mobile.click("[data-nav-toggle]");
  await mobile.screenshot({ path: path.join(OUT, "mobile-home-dark.png") });
  await mobile.goto(BASE + "/contact", { waitUntil: "networkidle0" });
  await mobile.screenshot({ path: path.join(OUT, "mobile-contact-dark.png") });

  const system = await browser.newPage();
  await system.goto(BASE + "/", { waitUntil: "networkidle0" });
  await system.evaluate(() => localStorage.removeItem("theme"));
  await system.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await system.reload({ waitUntil: "networkidle0" });
  const systemTheme = await system.evaluate(() => document.documentElement.dataset.theme);

  console.log(
    JSON.stringify(
      { initial, toggled, persistedLight, persistedDark, mobileBefore, mobileNav, systemTheme, errors },
      null,
      2
    )
  );
  await browser.close();
})();
