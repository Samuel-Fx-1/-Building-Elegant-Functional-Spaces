const puppeteer = require("puppeteer-core");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ORIGINAL = "https://resident-virgina-z5mpray2.cmsfly.com";
const CLONE = "http://localhost:3000";

async function inspect(page, base, route) {
  await page.goto(base + route, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));
  return page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    const cs = (el, props) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return Object.fromEntries(props.map((p) => [p, s[p]]));
    };
    const textNodes = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const out = [];
      let n;
      while ((n = walker.nextNode())) {
        if (n.textContent.trim()) out.push(n.textContent);
      }
      return out;
    };

    const contact = [...document.querySelectorAll("a")].find((a) => a.textContent.trim() === "Contact Me");
    const parents = [];
    let el = contact;
    for (let i = 0; i < 5 && el; i++) {
      parents.push({ tag: el.tagName, cls: el.className, id: el.id, rect: rect(el), text: el.textContent.trim().slice(0, 60) });
      el = el.parentElement;
    }
    const nav = contact?.parentElement?.parentElement;
    const header = nav?.parentElement;
    const hero = document.querySelector("#__next section") || document.querySelector("main section");
    const h1 = hero?.querySelector("h1");
    const h1Spans = h1 ? [...h1.querySelectorAll("span")].map((s) => ({
      text: s.textContent,
      rect: rect(s),
      style: cs(s, ["display", "margin", "padding", "letterSpacing", "wordSpacing", "fontSize", "fontWeight"]),
    })) : [];
    const h1Range = h1 ? (() => {
      const range = document.createRange();
      range.selectNodeContents(h1);
      return [...range.getClientRects()].map((r) => ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }));
    })() : [];
    const paras = [...(hero?.querySelectorAll("p") || [])];
    const bodyP = paras.find((p) => p.textContent.trim().length > 40);
    const pRange = bodyP ? (() => {
      const range = document.createRange();
      range.selectNodeContents(bodyP);
      return [...range.getClientRects()].map((r) => ({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }));
    })() : [];
    return {
      headerChain: parents,
      headerRect: rect(header),
      headerStyle: cs(header, ["position", "top", "left", "right", "height", "padding", "background", "zIndex", "display", "gridTemplateColumns"]),
      navRect: rect(nav),
      navStyle: cs(nav, ["display", "gap", "alignItems", "justifyContent", "fontFamily", "fontSize", "fontWeight"]),
      navLinks: [...(nav?.querySelectorAll("a") || [])].map((a) => ({
        text: a.textContent.trim(),
        rect: rect(a),
        style: cs(a, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "padding", "margin"]),
      })),
      cta: (() => {
        const a = [...document.querySelectorAll("a")].find((x) => /book now/i.test(x.textContent) && rect(x)?.y < 100);
        return a ? { rect: rect(a), style: cs(a, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "padding", "borderRadius", "background", "gap"]) } : null;
      })(),
      heroText: textNodes(hero).slice(0, 12),
      eyebrow: (() => {
        const e = [...hero.querySelectorAll("*")].find((x) => x.children.length === 0 && /alex smith/i.test(x.textContent) && x.textContent.trim().length < 20);
        return e ? { tag: e.tagName, text: e.textContent.trim(), rect: rect(e), style: cs(e, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "color", "margin"]) } : null;
      })(),
      h1: h1 && { text: h1.textContent.trim(), rect: rect(h1), style: cs(h1, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "wordSpacing", "textAlign", "margin", "maxWidth"]), spans: h1Spans, range: h1Range },
      paragraph: bodyP && { text: bodyP.textContent.trim().slice(0, 200), rect: rect(bodyP), style: cs(bodyP, ["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing", "color", "margin", "maxWidth", "textAlign"]), range: pRange },
    };
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--force-device-scale-factor=1"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  for (const [label, base, route] of [["ORIGINAL", ORIGINAL, "/"], ["CLONE", CLONE, "/"], ["ORIGINAL-ABOUT", ORIGINAL, "/about-page"], ["CLONE-ABOUT", CLONE, "/about"]]) {
    console.log("=== " + label + " ===");
    console.log(JSON.stringify(await inspect(page, base, route), null, 2));
  }
  await browser.close();
})();
