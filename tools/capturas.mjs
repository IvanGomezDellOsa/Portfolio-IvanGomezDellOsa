/**
 * CAPTURAS DE LOS SITIOS EN VIVO, que después `tools/medios.mjs` convierte en los
 * WebP de `public/medios/`. Se corre a mano cuando cambia un sitio:
 *
 *   npm run capturas
 *
 * Las capturas crudas quedan en `tools/_capturas/` (fuera de Git). No se sube
 * nada: sólo se abren los sitios públicos, como los abriría cualquier visitante.
 *
 * NAVEGADOR. Usa el `chrome-headless-shell` que instala Playwright
 * (`npx playwright install chromium-headless-shell`). Otra ruta se puede pasar
 * con la variable CHROMIUM_PATH.
 *
 * ⚠ RUGIDOS NO SE CAPTURA DESDE EL HERO. El video y el póster del hero muestran
 * chicos reconocibles: en el sitio del salón tiene sentido, en un portfolio
 * personal no. Las capturas arrancan en «¿Por qué elegirnos?».
 */
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const SALIDA = path.join(RAIZ, "_capturas");
const REPOS = path.resolve(RAIZ, "..", "..");

const EJECUTABLE =
  process.env.CHROMIUM_PATH ??
  path.join(
    process.env.LOCALAPPDATA ?? "",
    "ms-playwright",
    "chromium_headless_shell-1234",
    "chrome-headless-shell-win64",
    "chrome-headless-shell.exe",
  );

const ESCRITORIO = { width: 1440, height: 900 };
const TELEFONO = { width: 390, height: 844 };

/**
 * Qué se captura. `desplazar` es cuántos píxeles se baja antes de la foto: los
 * sitios con animaciones de entrada necesitan que la sección haya entrado en
 * pantalla para verse terminada.
 */
const TOMAS = [
  { nombre: "datos-pauta", url: "https://datospautaoficial.com.ar", vista: ESCRITORIO, espera: 6000 },
  { nombre: "datos-pauta-movil", url: "https://datospautaoficial.com.ar", vista: TELEFONO, espera: 6000 },
  { nombre: "inversiones", url: "https://www.inversionesargentina.com.ar", vista: ESCRITORIO, espera: 6000 },
  { nombre: "navkok", url: "https://navkok-website-private.vercel.app", vista: ESCRITORIO, espera: 7000 },
  { nombre: "navkok-movil", url: "https://navkok-website-private.vercel.app", vista: TELEFONO, espera: 7000 },
  { nombre: "rugidos-elegirnos", url: "https://www.rugidosfiestas.com.ar", vista: ESCRITORIO, espera: 6000, desplazar: 810 },
  { nombre: "rugidos-servicios", url: "https://www.rugidosfiestas.com.ar", vista: ESCRITORIO, espera: 6000, desplazar: 2430 },
  { nombre: "rugidos-espacio", url: "https://www.rugidosfiestas.com.ar", vista: ESCRITORIO, espera: 6000, desplazar: 3240 },
  { nombre: "rugidos-movil", url: "https://www.rugidosfiestas.com.ar", vista: TELEFONO, espera: 6000, desplazar: 760 },
];

/**
 * Miniaturas de dos demos propias anteriores en YouTube: de ellas salen las
 * marcas de FaceHunt 2 y FreeMagicMirror (sus repos no tienen un ícono que
 * sirva a ese tamaño). Los videos actuales de cada proyecto no pasan por acá:
 * los reproduce YouTube y sus fragmentos salen de `tools/videos.mjs`.
 */
const DEMOS = {
  "facehunt-2": "rJLyYJcEm7c",
  freemagicmirror: "V_Qmx1kqg2M",
};

/** Sirve la interfaz web de FaceHunt 2 (HTML sin build) para capturarla. */
function servirCarpeta(carpeta) {
  const tipos = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".ico": "image/x-icon" };
  const servidor = createServer(async (req, res) => {
    const ruta = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const archivo = path.join(carpeta, ruta === "/" ? "index.html" : ruta);
    try {
      const datos = await readFile(archivo);
      res.writeHead(200, { "content-type": tipos[path.extname(archivo)] ?? "application/octet-stream" });
      res.end(datos);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  return new Promise((ok) => servidor.listen(0, "127.0.0.1", () => ok(servidor)));
}

async function tomar(browser, { nombre, url, vista, espera, desplazar = 0 }) {
  const ctx = await browser.newContext({ viewport: vista, deviceScaleFactor: 2, locale: "es-AR", isMobile: vista.width < 600, hasTouch: vista.width < 600 });
  const pagina = await ctx.newPage();
  try {
    await pagina.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await pagina.waitForTimeout(espera);
    if (desplazar) {
      // En pasos, como un visitante: los IntersectionObserver de cada sección
      // tienen que dispararse para que la sección se vea terminada.
      for (let y = 0; y < desplazar; y += 270) {
        await pagina.mouse.wheel(0, Math.min(270, desplazar - y));
        await pagina.waitForTimeout(160);
      }
      await pagina.waitForTimeout(2600);
    }
    await pagina.screenshot({ path: path.join(SALIDA, `${nombre}.png`) });
    console.log("✓", nombre);
  } catch (e) {
    console.error("✗", nombre, e.message);
  } finally {
    await ctx.close();
  }
}

async function main() {
  if (!existsSync(EJECUTABLE)) throw new Error(`No encuentro Chromium en ${EJECUTABLE}. Definí CHROMIUM_PATH.`);
  await mkdir(SALIDA, { recursive: true });
  const browser = await chromium.launch({ executablePath: EJECUTABLE, headless: true, args: ["--mute-audio"] });

  for (const toma of TOMAS) await tomar(browser, toma);

  const fh2 = path.join(REPOS, "Repositorio FaceHunt", "FaceHunt-2", "web");
  if (existsSync(fh2)) {
    const servidor = await servirCarpeta(fh2);
    const { port } = servidor.address();
    await tomar(browser, { nombre: "facehunt-2-interfaz", url: `http://127.0.0.1:${port}/`, vista: ESCRITORIO, espera: 2500 });
    servidor.close();
  }
  await browser.close();

  for (const [nombre, id] of Object.entries(DEMOS)) {
    for (const calidad of ["maxresdefault", "hqdefault"]) {
      const res = await fetch(`https://i.ytimg.com/vi/${id}/${calidad}.jpg`);
      const datos = Buffer.from(await res.arrayBuffer());
      // YouTube responde 200 con un gris de 120 × 90 cuando no hay maxres.
      if (res.ok && datos.length > 4000) {
        await writeFile(path.join(SALIDA, `demo-${nombre}.jpg`), datos);
        console.log("✓ demo", nombre, calidad);
        break;
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
