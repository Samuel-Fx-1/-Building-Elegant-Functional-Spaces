const cheerio = require("cheerio");
const fs = require("fs");

const BASE = "https://resident-virgina-z5mpray2.cmsfly.com";
const PAGES = [
  "/",
  "/about-page",
  "/services-page",
  "/project-page",
  "/blog-page",
  "/contact-page",
  "/Projects-Details/Elmwood-Grand-Heights",
  "/Projects-Details/Riverstone-Edge-Residences",
  "/Projects-Details/Willow-Park-Residences",
  "/Projects-Details/Celestia-Grand-Residences",
  "/post/Understanding-Property-Taxes-Before-You-Buy",
  "/post/Essential-Steps-Before-Buying-Your-First-Property",
];

(async () => {
  fs.mkdirSync("data/raw", { recursive: true });
  for (const p of PAGES) {
    const res = await fetch(BASE + p);
    const html = await res.text();
    const file = p === "/" ? "home" : p.replace(/^\//, "").replaceAll("/", "_");
    fs.writeFileSync(`data/raw/${file}.html`, html);

    const $ = cheerio.load(html);
    $("script, style, noscript").remove();
    const sections = [];
    $("#__next section").each((i, el) => {
      const $el = $(el);
      const texts = [];
      $el.find("h1,h2,h3,h4,h5,h6,p,a,button,span,input,textarea,label").each((j, n) => {
        const tag = n.tagName;
        const t = $(n).children().length === 0 ? $(n).text().trim() : "";
        if (t && !texts.some((x) => x.t === t)) texts.push({ tag, t });
      });
      const imgs = $el.find("img").map((j, n) => $(n).attr("src")).get();
      const bgs = [];
      $el.find("[style]").each((j, n) => {
        const s = $(n).attr("style");
        const m = s && s.match(/background(?:-image)?:[^;]*url\(([^)]+)\)/);
        if (m) bgs.push(m[1]);
      });
      sections.push({
        cls: $el.attr("class"),
        text: texts.slice(0, 80),
        imgs: [...new Set(imgs)],
        bgs: [...new Set(bgs)],
      });
    });
    console.log("\n===== " + p + " | sections: " + sections.length);
    sections.forEach((s, i) => {
      console.log(`\n--- [${i}] ${s.cls}`);
      console.log("TEXT:", s.text.map((x) => `${x.tag}: ${x.t}`).join(" | ").slice(0, 1200));
      if (s.imgs.length) console.log("IMGS:", s.imgs.join(", "));
      if (s.bgs.length) console.log("BGS:", s.bgs.join(", "));
    });
  }
})();
