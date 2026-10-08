/**
 * LA IMAGEN PARA COMPARTIR (1200 × 630), una por idioma. Es la medida que
 * LinkedIn, WhatsApp y X muestran sin reescalar; para un portfolio, que se
 * comparte por enlace, es la primera pantalla que ve la mayoría.
 *
 * Es el hero en chico: el nombre, el puesto y una tira con un cuadro de cada
 * video (los pósters de `tools/videos.mjs`). Se fotografía con Chromium:
 *
 *   npm run og
 */
import { chromium } from "playwright-core";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EJECUTABLE =
  process.env.CHROMIUM_PATH ??
  path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright", "chromium_headless_shell-1234", "chrome-headless-shell-win64", "chrome-headless-shell.exe");

const VIDEOS = ["ask-leonardo-da-vinci", "datos-pauta-oficial", "sevive", "inversiones-en-argentina", "facehunt-2", "mementolife", "freemagicmirror"];

const TEXTOS = {
  es: { archivo: "og-1200x630.png", pie: "9 proyectos · 7 videos" },
  en: { archivo: "og-1200x630-en.png", pie: "9 projects · 7 videos" },
};

const html = (t, cuadros) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600&family=Geist+Mono&display=block" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;overflow:hidden;background:#0a0a0a;color:#ededed;font-family:"Geist",sans-serif;position:relative}
  .reticula{position:absolute;inset:0;background:radial-gradient(60% 50% at 50% 0%,rgba(255,255,255,.08),transparent 72%),linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px) 0 0/64px 64px,linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px) 0 0/64px 64px;background-position:center top;-webkit-mask-image:radial-gradient(70% 70% at 50% 20%,#000 30%,transparent 80%)}
  .contenido{position:absolute;left:0;right:0;top:128px;text-align:center}
  h1{font-size:84px;font-weight:600;letter-spacing:-.055em;line-height:1;background:linear-gradient(to bottom,#fafafa 30%,#a8a8a8);-webkit-background-clip:text;color:transparent;padding-bottom:6px}
  .rol{margin-top:16px;font-size:34px;letter-spacing:-.025em;color:#b4b4b4}
  .tira{position:absolute;left:46px;right:46px;bottom:100px;display:flex;gap:12px}
  .cuadro{width:148px;height:83px;border-radius:9px;overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.14),0 18px 40px -18px rgba(0,0,0,.8)}
  .cuadro img{width:100%;height:100%;object-fit:cover}
  .pie{position:absolute;left:46px;right:46px;bottom:48px;display:flex;justify-content:space-between;font-family:"Geist Mono",monospace;font-size:17px;color:#8f8f8f}
</style></head><body>
<div class="reticula"></div>
<div class="contenido"><h1>Iván Gómez Dell’Osa</h1><p class="rol">Full Stack Developer</p></div>
<div class="tira">${cuadros.map((src) => `<div class="cuadro"><img src="${src}"></div>`).join("")}</div>
<div class="pie"><span>ivangomezdellosa.com.ar</span><span>${t.pie}</span></div>
</body></html>`;

// En base64: una página armada con `setContent` no tiene origen y no puede leer `file://`.
const cuadros = await Promise.all(
  VIDEOS.map(async (v) => "data:image/webp;base64," + (await readFile(path.join(RAIZ, "public", "medios", "videos", `${v}-640.webp`))).toString("base64")),
);
const browser = await chromium.launch({ executablePath: EJECUTABLE, headless: true });
const pagina = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const t of Object.values(TEXTOS)) {
  await pagina.setContent(html(t, cuadros), { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(400);
  await pagina.screenshot({ path: path.join(RAIZ, "public", t.archivo) });
  console.log("✓", t.archivo);
}
await browser.close();
