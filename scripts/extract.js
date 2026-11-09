const cheerio = require("cheerio");
const fs = require("fs");

const file = process.argv[2];
const html = fs.readFileSync(file, "utf8");
const $ = cheerio.load(html);
$("script, style, noscript").remove();

console.log("TITLE:", $("title").text());
console.log("\n=== LINKS ===");
$("a").each((i, a) => {
  const href = $(a).attr("href");
  const text = $(a).text().replace(/\s+/g, " ").trim();
  const img = $(a).find("img").attr("src");
  if (href && (href.includes("Project") || href.includes("post") || href.includes("page"))) {
    console.log(`${href} | ${text.slice(0, 80)} | ${img || ""}`);
  }
});

console.log("\n=== IMAGES ===");
$("img").each((i, img) => {
  console.log(`${$(img).attr("src")} | alt="${$(img).attr("alt") || ""}" | w=${$(img).attr("width") || ""} | class=${$(img).attr("class") || ""}`);
});

console.log("\n=== TEXT NODES ===");
$("h1,h2,h3,h4,h5,h6,p,li,label,button").each((i, n) => {
  const t = $(n).text().replace(/\s+/g, " ").trim();
  if (t) console.log(`[${n.tagName}] ${t}`);
});
