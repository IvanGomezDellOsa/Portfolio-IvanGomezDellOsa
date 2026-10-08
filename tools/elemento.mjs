/**
 * Captura de un elemento puntual del sitio (para revisar una pieza sin recorrer
 * toda la página):  node tools/elemento.mjs <url> <selector> <archivo> [ancho] [alto]
 */
import { chromium } from "playwright-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EJECUTABLE =
  process.env.CHROMIUM_PATH ??
  path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright", "chromium_headless_shell-1234", "chrome-headless-shell-win64", "chrome-headless-shell.exe");
const [, , url, selector, archivo, ancho = "1440", alto = "900"] = process.argv;
const browser = await chromium.launch({ executablePath: EJECUTABLE, headless: true, args: ["--mute-audio"] });
const movil = +ancho < 700;
const pagina = await browser.newPage({ viewport: { width: +ancho, height: +alto }, isMobile: movil, hasTouch: movil });
await pagina.goto(url, { waitUntil: "networkidle" });
const el = pagina.locator(selector).first();
await el.scrollIntoViewIfNeeded();
await pagina.waitForTimeout(2600);
await el.screenshot({ path: path.join(RAIZ, "tools", "_capturas", "revision", archivo) });
console.log("✓", archivo);
await browser.close();
