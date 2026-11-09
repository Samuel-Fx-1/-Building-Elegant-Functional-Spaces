const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = "https://resident-virgina-z5mpray2.cmsfly.com";

const rect = (el) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    x: Math.round(r.x),
    y: Math.round(r.y),
    w: Math.round(r.width),
    h: Math.round(r.height),
  };
};
const style = (el, props) => {
  if (!el) return null;
  const cs = getComputedStyle(el);
  return Object.fromEntries(props.map((p) => [p, cs[p]]));
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (const route of ["/", "/about-page"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));
    const data = await page.evaluate(() => {
      const rect = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
      };
      const style = (el, props) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        return Object.fromEntries(props.map((p) => [p, cs[p]]));
      };
      const header = document.querySelector("header");
      const navLinks = [...document.querySelectorAll("header nav a")];
      const cta = [...document.querySelectorAll("header a")].find((a) => /book now/i.test(a.textContent));
      const hero = document.querySelector("#__next section");
      const h1 = hero?.querySelector("h1");
      const paragraph =
        hero?.querySelector("p") ||
        [...(hero?.querySelectorAll("p") || [])].find((p) => p.textContent.trim().length > 40);
      const eyebrow = hero?.querySelector("h6, .eyebrow") || [...(hero?.querySelectorAll("h5,h6,span") || [])].find((el) => /alex smith/i.test(el.textContent) && el.textContent.trim().length < 30);
      const heroBg = hero ? getComputedStyle(hero).backgroundImage : null;
      const h1Range = h1 ? (() => {
        const range = document.createRange();
        range.selectNodeContents(h1);
        const rects = [...range.getClientRects()].map((r) => ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }));
        return rects;
      })() : null;
      const pRange = paragraph ? (() => {
        const range = document.createRange();
        range.selectNodeContents(paragraph);
        const rects = [...range.getClientRects()].map((r) => ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }));
        return rects;
      })() : null;
      const headerInner = header?.firstElementChild;
      const nav = header?.querySelector("nav");
      const logo = header?.querySelector("img, svg");
      return {
        route: location.pathname,
        header: rect(header),
        headerStyle: style(header, ["height", "position", "background", "padding", "fontFamily"]),
        headerInner: rect(headerInner),
        headerInnerStyle: style(headerInner, ["display", "gridTemplateColumns", "padding", "margin", "maxWidth", "width", "height", "justifyContent", "alignItems", "gap"]),
        nav: rect(nav),
        navStyle: style(nav, ["display", "fontFamily", "fontSize", "fontWeight", "gap"]),
        navLinks: navLinks.map((a) => ({
          text: a.textContent.trim(),
          rect: rect(a),
          style: style(a, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "padding", "margin", "textDecoration"]),
          cls: a.className,
          aria: a.getAttribute("aria-current"),
        })),
        cta: cta && {
          text: cta.textContent.trim(),
          rect: rect(cta),
          style: style(cta, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "color", "background", "borderRadius", "padding", "margin", "gap"]),
        },
        logo: logo && { rect: rect(logo), tag: logo.tagName, src: logo.getAttribute("src") || null },
        hero: rect(hero),
        heroStyle: style(hero, ["backgroundImage", "backgroundPosition", "backgroundSize", "backgroundColor", "minHeight", "padding"]),
        heroBg,
        eyebrow: eyebrow && { text: eyebrow.textContent.trim(), rect: rect(eyebrow), style: style(eyebrow, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "margin"]) },
        h1: h1 && {
          text: h1.textContent.trim(),
          html: h1.innerHTML,
          rect: rect(h1),
          style: style(h1, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "wordSpacing", "color", "maxWidth", "margin"]),
          lines: h1Range,
        },
        paragraph: paragraph && {
          text: paragraph.textContent.trim(),
          html: paragraph.innerHTML,
          rect: rect(paragraph),
          style: style(paragraph, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "maxWidth", "margin"]),
          lines: pRange,
        },
      };
    });
    console.log(JSON.stringify(data, null, 2));
  }
  await browser.close();
})();
