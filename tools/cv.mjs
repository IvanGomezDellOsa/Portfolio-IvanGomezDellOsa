/**
 * EL CV DEL SITIO, SIN TELEFONO. Se corre a mano cuando cambia el CV:
 *
 *   node tools/cv.mjs
 *
 * Parte de la fuente HTML del CV vigente (la misma que genera el PDF que se
 * adjunta en las postulaciones) y lo imprime igual, con una sola diferencia:
 * **se quita el teléfono**. El PDF de una postulación lo recibe una persona; el
 * de un sitio público lo lee cualquiera, incluidos los programas que juntan
 * números para spam. El contacto del sitio es el email y LinkedIn.
 *
 * Si la fuente cambia de lugar, se pasa con la variable CV_FUENTE.
 */
import { chromium } from "playwright-core";
import { readFile, writeFile, mkdir, copyFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FUENTE = process.env.CV_FUENTE ?? "C:/Users/IvanGomezD/OneDrive/Documentos/CV/CV fuente + Linkedin/fuente";
const VERSION = process.env.CV_VERSION ?? "10-26_v4";
const TEMPORAL = path.join(RAIZ, "tools", "_capturas", "cv");
const EJECUTABLE =
  process.env.CHROMIUM_PATH ??
  path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright", "chromium_headless_shell-1234", "chrome-headless-shell-win64", "chrome-headless-shell.exe");

const DOCUMENTOS = [
  { fuente: `CV_IvanGomezDellOsa_${VERSION}.html`, salida: "CV_IvanGomezDellOsa.pdf", titulo: "CV Iván Gómez Dell'Osa" },
  { fuente: `Resume_IvanGomezDellOsa_${VERSION}.html`, salida: "Resume_IvanGomezDellOsa.pdf", titulo: "Resume Iván Gómez Dell'Osa" },
];

/** El teléfono va en la línea del email, después de un «·». Se quita con su separador. */
const sinTelefono = (html) => {
  const limpio = html.replace(/\s*·\s*\+54[\d\s]+(?=<br>)/, "");
  if (limpio === html) throw new Error("No encontré el teléfono en la fuente: revisar el patrón antes de publicar.");
  return limpio;
};

async function main() {
  await mkdir(TEMPORAL, { recursive: true });
  await mkdir(path.join(RAIZ, "public", "cv"), { recursive: true });
  await copyFile(path.join(FUENTE, "foto_cv.png"), path.join(TEMPORAL, "foto_cv.png"));

  const browser = await chromium.launch({ executablePath: EJECUTABLE, headless: true });
  const pagina = await browser.newPage();
  for (const doc of DOCUMENTOS) {
    const html = sinTelefono(await readFile(path.join(FUENTE, doc.fuente), "utf8"));
    const temporal = path.join(TEMPORAL, doc.fuente);
    await writeFile(temporal, html);
    await pagina.goto(pathToFileURL(temporal).href, { waitUntil: "load" });
    const destino = path.join(RAIZ, "public", "cv", doc.salida);
    await pagina.pdf({ path: destino, preferCSSPageSize: true, printBackground: true });

    // Chrome ignora <meta name="author">: el autor se escribe después, como en
    // el PDF original. Si no hay Python con PyMuPDF, el PDF queda igual de válido.
    spawnSync("python", [
      "-c",
      "import fitz,sys; d=fitz.open(sys.argv[1]); m=d.metadata; m['author']=sys.argv[2]; m['title']=sys.argv[3]; " +
        "d.set_metadata(m); d.saveIncr()",
      destino, "Iván Gómez Dell'Osa", doc.titulo,
    ]);
    console.log("✓", path.relative(RAIZ, destino));
  }
  await browser.close();
  await rm(TEMPORAL, { recursive: true, force: true });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
