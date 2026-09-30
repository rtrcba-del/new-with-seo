// client/scripts/indexnow.mjs
//
// Pings IndexNow (Bing, Yandex, Seznam, Naver and others) with every URL in
// dist/sitemap.xml so new/changed pages are crawled within hours instead of
// days. Run it AFTER each deploy:   npm run indexnow --prefix client
//
// The ownership key is the file public/<key>.txt (already in this repo and
// served at https://adhikarichandra.com.np/<key>.txt). Google does not use
// IndexNow; for Google use Search Console's sitemap submission.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "adhikarichandra.com.np";
const KEY = "5bd907f035ebd516c63e037265f36cdb";

const xml = fs.readFileSync(path.join(root, "dist/sitemap.xml"), "utf8");
const urlList = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URLs -> HTTP ${res.status} (200/202 = accepted)`);
