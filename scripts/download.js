const fs = require("fs");
const path = require("path");

const urls = fs.readFileSync("data/asset-urls.txt", "utf8").split(/\r?\n/).filter(Boolean);
urls.push(
  "https://cdn.cmsfly.com/6a251a6a1d4caa024336cf69/images/TheArboraCollection-Vz01g.png",
  "https://cdn.cmsfly.com/6a251a6a1d4caa024336cf69/images/TheHavenstoneResidences-oTFbQ.png"
);
const dir = "public/images";
fs.mkdirSync(dir, { recursive: true });

(async () => {
  const unique = [...new Set(urls)];
  const results = await Promise.all(unique.map(async (u) => {
    const name = decodeURIComponent(u.split("/").pop());
    const dest = path.join(dir, name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return `${name} (cached)`;
    try {
      const res = await fetch(u);
      if (!res.ok) return `${name} FAILED ${res.status}`;
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      return `${name} ${Math.round(buf.length / 1024)} KB`;
    } catch (e) {
      return `${name} ERROR ${e.message}`;
    }
  }));
  console.log(results.join("\n"));
})();
