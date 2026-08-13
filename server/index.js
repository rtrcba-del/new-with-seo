import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

const dataPath = (f) => path.join(__dirname, "data", f);
const readJSON = (f) => { try { return JSON.parse(fs.readFileSync(dataPath(f), "utf-8")); } catch { return null; } };
const writeJSON = (f, d) => fs.writeFileSync(dataPath(f), JSON.stringify(d, null, 2));

/* ── Visitor counter ── */
app.get("/api/visit", (req, res) => {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "unknown";
  const v = readJSON("visitors.json") || { count: 10001, ips: [] };
  if (!v.ips.includes(ip)) {
    v.ips.push(ip);
    if (v.ips.length > 50000) v.ips = v.ips.slice(-50000);
    v.count += 1;
    writeJSON("visitors.json", v);
  }
  res.json({ count: v.count });
});

/* ── Content ── */
app.get("/api/content", (_req, res) => {
  const c = readJSON("content.json");
  if (!c) return res.status(500).json({ error: "unavailable" });
  res.json(c);
});

/* ── Contact (backup storage) ── */
app.post("/api/contact", (req, res) => {
  const { name, email, message, topic } = req.body ?? {};
  const errs = {};
  if (!name || name.trim().length < 2) errs.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email || "").trim())) errs.email = "Enter a valid email.";
  if (!message || message.trim().length < 10) errs.message = "Write at least 10 characters.";
  if (Object.keys(errs).length) return res.status(400).json({ ok: false, errors: errs });
  const msgs = readJSON("messages.json") || [];
  msgs.push({ id: Date.now().toString(36), name: name.trim(), email: email.trim(), topic, message: message.trim(), at: new Date().toISOString() });
  writeJSON("messages.json", msgs);
  res.status(201).json({ ok: true, message: "Received — Chandra will reply soon." });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

/* ── Serve built frontend ── */
const dist = path.join(__dirname, "../client/dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
