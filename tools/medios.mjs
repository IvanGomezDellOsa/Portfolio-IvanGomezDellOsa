/**
 * LOS MEDIOS DEL SITIO, generados desde sus fuentes. Se corre a mano:
 *
 *   npm run capturas   (sitios en vivo → tools/_capturas/)
 *   npm run medios     (esto)
 *
 * DE DONDE SALE CADA ARCHIVO. Todo viene de los repositorios hermanos de
 * `Git-Repositorios/` (el mismo material que usa cada proyecto en su sitio o su
 * README) o de las capturas de los sitios publicados. Nada se dibuja a mano ni
 * se genera con IA para este portfolio.
 *
 * FORMATOS. Imágenes en WebP con dos anchos (960 y 1600) para que el navegador
 * elija con `srcset`; videos en H.264 sin audio con `faststart`, que es lo que
 * reproduce cualquier navegador sin descargar el archivo entero antes de
 * arrancar. Los videos se recortan a lo que se muestra: un loop de segundos, no
 * el original.
 *
 * Los fragmentos de los videos de cada proyecto (las vistas previas y el reel
 * del hero) los genera aparte `tools/videos.mjs`.
 *
 * ⚠ LO QUE NO SE USA A PROPOSITO:
 *   · el video y el póster del hero de Rugidos, y las fotos del salón con chicos
 *     (ver `tools/capturas.mjs`);
 *   · la galería de FreeMagicMirror (fotos reales de gente): se muestran las
 *     pantallas de la aplicación, que son animaciones sin personas.
 */
import sharp from "sharp";
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPOS = path.resolve(RAIZ, "..");
const CAPTURAS = path.join(RAIZ, "tools", "_capturas");
const SALIDA = path.join(RAIZ, "public", "medios");
const FOTO = process.env.FOTO_CV ?? "C:/Users/IvanGomezD/OneDrive/Documentos/CV/FotoCV.jpeg";

const repo = (...partes) => path.join(REPOS, ...partes);
const cap = (nombre) => path.join(CAPTURAS, nombre);
const out = (...partes) => path.join(SALIDA, ...partes);

/** WebP en uno o más anchos. Nunca agranda: si la fuente es más chica, sale a su tamaño. */
async function webp(fuente, destino, anchos = [960, 1600], { calidad = 80, recorte } = {}) {
  if (!existsSync(fuente)) return console.warn("  falta", fuente);
  await mkdir(path.dirname(destino), { recursive: true });
  for (const ancho of anchos) {
    let img = sharp(fuente);
    if (recorte) img = img.extract(recorte);
    const archivo = anchos.length > 1 ? `${destino}-${ancho}.webp` : `${destino}.webp`;
    await img.resize({ width: ancho, withoutEnlargement: true }).webp({ quality: calidad, effort: 6 }).toFile(archivo);
  }
  console.log("  ✓", path.relative(SALIDA, destino));
}

function ffmpeg(args) {
  const r = spawnSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg falló: " + args.join(" "));
}

/** Loop de video: recorte, escala y H.264 liviano, más un póster del primer cuadro útil. */
async function video(fuente, destino, { desde = 0, duracion, ancho, crf = 29, fps, poster = 0.4 } = {}) {
  if (!existsSync(fuente)) return console.warn("  falta", fuente);
  await mkdir(path.dirname(destino), { recursive: true });
  const filtros = [`scale=${ancho}:-2`, fps ? `fps=${fps}` : null].filter(Boolean).join(",");
  ffmpeg([
    "-ss", String(desde), ...(duracion ? ["-t", String(duracion)] : []), "-i", fuente,
    "-an", "-vf", filtros, "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${destino}.mp4`,
  ]);
  const png = `${destino}-poster.png`;
  ffmpeg(["-ss", String(poster), "-i", `${destino}.mp4`, "-frames:v", "1", png]);
  await sharp(png).webp({ quality: 78 }).toFile(`${destino}.webp`);
  await import("node:fs/promises").then((fs) => fs.unlink(png));
  console.log("  ✓", path.relative(SALIDA, destino), "(video)");
}

/** Marca chica y cuadrada, sobre transparente o con su fondo. */
async function marca(fuente, destino, { recorte, lado = 160 } = {}) {
  if (!existsSync(fuente)) return console.warn("  falta", fuente);
  await mkdir(path.dirname(destino), { recursive: true });
  let img = sharp(fuente);
  if (recorte) img = img.extract(recorte);
  await img.resize({ width: lado, height: lado, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 88 }).toFile(`${destino}.webp`);
  console.log("  ✓", path.relative(SALIDA, destino), "(marca)");
}

/**
 * LOS VECTORES REALES DE ASK LEONARDO. `proyeccion.json` es el mismo archivo
 * que dibuja la sección «Espacio vectorial» del sitio: los 1.402 pasajes del
 * índice llevados de 384 dimensiones a 3. Acá sólo se achica: posiciones y
 * direcciones con tres decimales pasan a enteros (× 1000), que es la misma
 * precisión en menos bytes.
 */
async function vectores() {
  const fuente = repo("Repositorio Ask_Leonardo_da_Vinci", "public", "proyeccion.json");
  const p = JSON.parse(await readFile(fuente, "utf8"));
  const entero = (v) => Math.round(v * 1000);
  const datos = { n: p.n, pos: p.pos.map(entero), dir: p.dir.map(entero), sec: p.sec };
  await mkdir(path.join(RAIZ, "public", "datos"), { recursive: true });
  await writeFile(path.join(RAIZ, "public", "datos", "vectores.json"), JSON.stringify(datos));
  console.log("  ✓ datos/vectores.json", p.n, "vectores");
}

async function main() {
  const L = "Repositorio Ask_Leonardo_da_Vinci";
  console.log("Ask Leonardo da Vinci");
  for (const idioma of ["es", "en"]) {
    await webp(repo(L, ".github", "readme", `codice-${idioma}.webp`), out("leonardo", `codice-${idioma}`));
    await webp(repo(L, ".github", "readme", `biblioteca-estante-${idioma}.webp`), out("leonardo", `biblioteca-estante-${idioma}`));
    await webp(repo(L, ".github", "readme", `biblioteca-libro-${idioma}.webp`), out("leonardo", `biblioteca-libro-${idioma}`));
    await webp(repo(L, ".github", "readme", `museo-${idioma}.webp`), out("leonardo", `museo-${idioma}`));
  }
  // La marca sin la inscripción: a 28 px el texto de abajo sería una mancha.
  await marca(repo(L, "public", "espacio-marca.webp"), out("leonardo", "marca"));
  await vectores();

  console.log("Datos Pauta Oficial");
  await webp(cap("datos-pauta.png"), out("datos-pauta", "sitio"));
  await webp(cap("datos-pauta-movil.png"), out("datos-pauta", "movil"), [640]);
  await marca(repo("Repositorio DatosPautaOficial", "public", "nav-icon.webp"), out("datos-pauta", "marca"));

  console.log("SeViVe");
  // La marca es la de su tela del hero (`espera.webp`, que no sale de acá): el símbolo, sin el nombre.
  await marca(out("sevive", "espera.webp"), out("sevive", "marca"), { recorte: { left: 475, top: 52, width: 330, height: 330 } });

  console.log("Inversiones en Argentina");
  await webp(cap("inversiones.png"), out("inversiones", "sitio"));
  // La marca es la de su tela del hero (`espera.webp`): la bandera en círculo, sin el nombre.
  await marca(out("inversiones", "espera.webp"), out("inversiones", "marca"), { recorte: { left: 128, top: 212, width: 296, height: 296 } });

  console.log("FaceHunt 2");
  await webp(cap("facehunt-2-interfaz.png"), out("facehunt-2", "interfaz"));
  await webp(repo("Repositorio FaceHunt", "FaceHunt", "assets", "wf_0.webp"), out("facehunt-2", "v1"), [1280]);
  // El ícono de FaceHunt 2 es el cuadrado central de la miniatura de su demo.
  await marca(cap("demo-facehunt-2.jpg"), out("facehunt-2", "marca"), { recorte: { left: 300, top: 20, width: 680, height: 680 } });

  console.log("MementoLife");
  const M = ["Repositorio MementoLife", "extension", "brand"];
  await webp(repo(...M, "store", "1-dark.png"), out("mementolife", "oscuro"), [960, 1280]);
  await webp(repo(...M, "store", "2-light.png"), out("mementolife", "claro"), [960, 1280]);
  await webp(repo(...M, "store", "3-opciones.png"), out("mementolife", "opciones"), [960]);
  await webp(repo(...M, "store", "4-efemeride.png"), out("mementolife", "efemeride"), [960]);
  await marca(repo(...M, "hourglass.png"), out("mementolife", "marca"));

  console.log("Rugidos Fiestas");
  await webp(cap("rugidos-servicios.png"), out("rugidos", "servicios"));
  await webp(cap("rugidos-espacio.png"), out("rugidos", "espacio"));
  await webp(cap("rugidos-movil.png"), out("rugidos", "movil"), [640]);
  await webp(
    repo("Repositorio RugidosWebSite-2023-Legacy", "RugidosWebSite", "Screenshots -- RugidosWebSite-2023-legacy", "1_S_Inicio.png"),
    out("rugidos", "primera-version"),
  );
  await marca(repo("Repositorio RugidosWebSite", "public", "logo_rugidos.png"), out("rugidos", "marca"));

  console.log("Navkok Security Group");
  await webp(cap("navkok.png"), out("navkok", "sitio"));
  await webp(cap("navkok-movil.png"), out("navkok", "movil"), [640]);
  await marca(repo("Repositorio Navkok-W__private", "public", "images", "logos", "logo__navkok.png"), out("navkok", "marca"));

  console.log("FreeMagicMirror");
  const F = ["Repositorio FreeMagicMirror", "FreeMagicMirror", "assets", "videos"];
  await video(repo(...F, "start_loop.mp4"), out("freemagicmirror", "inicio"), { ancho: 540, crf: 30, poster: 2 });
  await video(repo(...F, "pose_prompt.mp4"), out("freemagicmirror", "pose"), { ancho: 540, crf: 30, poster: 2 });
  await video(repo(...F, "countdown.mp4"), out("freemagicmirror", "cuenta"), { ancho: 540, crf: 30, poster: 2 });
  // La marca es la de su tela del hero (`espera.webp`): la cámara, sin el nombre.
  await marca(out("freemagicmirror", "espera.webp"), out("freemagicmirror", "marca"), { recorte: { left: 380, top: 10, width: 520, height: 520 } });

  console.log("Persona");
  // La foto del CV, recortada a retrato: la cabeza sobre el tercio superior.
  await webp(FOTO, out("persona", "foto"), [480, 900], { calidad: 82, recorte: { left: 150, top: 30, width: 900, height: 994 } });

  console.log("listo");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
