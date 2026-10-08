/**
 * REVISION VISUAL: recorre una página del sitio como un visitante (bajando de
 * a una pantalla, para que se revelen las salas y carguen los medios) y saca
 * una captura por pantalla. Sirve para mirar el diseño a tamaños exactos.
 *
 *   node tools/revisar.mjs <url> <nombre> [ancho] [alto] [pantallas]
 *
 * Las capturas quedan en `tools/_capturas/revision/`.
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SALIDA = path.join(RAIZ, "tools", "_capturas", "revision");
const EJECUTABLE =
  process.env.CHROMIUM_PATH ??
  path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright", "chromium_headless_shell-1234", "chrome-headless-shell-win64", "chrome-headless-shell.exe");

const [, , url, nombre, ancho = "1440", alto = "900", pantallas = "30", espera = "5200"] = process.argv;
await mkdir(SALIDA, { recursive: true });
const browser = await chromium.launch({ executablePath: EJECUTABLE, headless: true, args: ["--autoplay-policy=no-user-gesture-required", "--mute-audio"] });
const movil = +ancho < 700;
const ctx = await browser.newContext({ viewport: { width: +ancho, height: +alto }, deviceScaleFactor: 1, isMobile: movil, hasTouch: movil });
const pagina = await ctx.newPage();
const errores = [];
pagina.on("console", (m) => m.type() === "error" && errores.push(m.text()));
pagina.on("pageerror", (e) => errores.push(e.message));
await pagina.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await pagina.waitForTimeout(+espera);
const total = await pagina.evaluate(() => document.documentElement.scrollHeight);
let n = 0;
for (let y = 0; y < total && n < +pantallas; y += +alto * 0.92, n++) {
  await pagina.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
  await pagina.waitForTimeout(1500);
  await pagina.screenshot({ path: path.join(SALIDA, `${nombre}-${String(n).padStart(2, "0")}.png`) });
}
console.log(`${nombre}: ${n} capturas, alto total ${total}px`);
if (errores.length) console.log("errores de consola:\n  " + [...new Set(errores)].join("\n  "));
await browser.close();
