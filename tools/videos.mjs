/**
 * LOS VIDEOS DEL SITIO: la vista previa muda de cada proyecto (la que se ve en
 * su sala y en su tela del hero) y el reel. Se corre a mano cuando cambia un
 * video:
 *
 *   npm run videos
 *
 * DE DONDE SALEN. Cada proyecto con video tiene el suyo en YouTube,
 * hecho con Remotion en el repo hermano `portfolio-videos`.
 * El sitio no aloja esos videos (los reproduce YouTube, con su sonido): acá se
 * generan sólo fragmentos mudos, para que cada sala muestre el producto en
 * movimiento antes de que alguien le dé play.
 *
 *   1. Se renderizan los tramos elegidos de la composición «-SinSubtitulos»
 *      de cada video (los publicados llevan los subtítulos en español
 *      quemados) y se unen con fundidos cortos. Cada render queda en
 *      tools/_videos/ con sus tiempos en el nombre y no se repite si ya existe.
 *      Los dos sitios web no tienen video publicado: Rugidos sale de su propia
 *      composición (un recorrido del sitio, sin narración) y Navkok, de una
 *      grabación del sitio publicado, cuadro por cuadro.
 *   2. Cada tramo se vuelve un loop sin costura: el último medio segundo funde
 *      con el primero. H.264 sin audio, a 1280 y a 854 px, con su póster.
 *   3. El reel (lo que se ve en lugar de las telas con movimiento reducido)
 *      junta cuatro segundos de cada video, con fundidos, y escribe sus cortes
 *      en `src/contenido/reel.json`.
 *
 * Los tiempos de `partes` son segundos del video publicado: son los mismos de
 * la composición sin subtítulos.
 */
import sharp from "sharp";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO_VIDEOS = process.env.VIDEOS_REPO ?? path.resolve(RAIZ, "..", "portfolio-videos");
const RENDERS = path.join(RAIZ, "tools", "_videos");
const SALIDA = path.join(RAIZ, "public", "medios", "videos");
const FPS = 30;

const NAVEGADOR =
  process.env.CHROMIUM_PATH ??
  path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright", "chromium_headless_shell-1234", "chrome-headless-shell-win64", "chrome-headless-shell.exe");

/**
 * El tráiler mudo de cada proyecto: uno o varios tramos (`partes`, en
 * segundos), unidos con fundidos. `poster` es el segundo del loop que se usa
 * de póster (lo que se ve antes de que cargue, y siempre con movimiento
 * reducido), y `reel`, el segundo donde empiezan sus cuatro segundos del reel
 * (los sitios web no van en el reel: no tienen video para abrir).
 */
const TRAMOS = [
  // El hero (el taller, con Leonardo junto al fuego), el códice (el mapa de
  // temas y la respuesta), el libro abierto con la lupa y el museo. Sin la
  // estantería 3D del principio de la biblioteca.
  { slug: "ask-leonardo-da-vinci", comp: "AskLeonardo-SinSubtitulos", partes: [[111, 116], [156, 162], [212.3, 217.8], [218, 223]], poster: 2, reel: 0.6 },
  // La marca con sus cifras, la tabla de órdenes y «¿cuánto recibió?».
  { slug: "datos-pauta-oficial", comp: "DatosPauta-SinSubtitulos", partes: [[46, 52], [115, 120], [128.6, 136.6]], poster: 5, reel: 1.5 },
  // Dos alumnos, un solo lugar, el mismo instante.
  { slug: "sevive", comp: "SeViVe-SinSubtitulos", partes: [[43, 55.6]], poster: 5.4, reel: 3.6 },
  // El mapa con las inversiones registradas.
  { slug: "inversiones-en-argentina", comp: "InversionesArgentina-SinSubtitulos", partes: [[64, 82.6]], poster: 8.4, reel: 7 },
  // La marca y la aplicación, paso a paso.
  { slug: "facehunt-2", comp: "FaceHunt-SinSubtitulos", partes: [[28.6, 46]], poster: 1.2, reel: 0.9 },
  // La grilla que se llena, del tema oscuro al claro.
  { slug: "mementolife", comp: "MementoLife-SinSubtitulos", partes: [[14.6, 26.3]], poster: 3.9, reel: 3.2 },
  // El editor: dibujo y stickers sobre la foto.
  { slug: "freemagicmirror", comp: "FreeMagicMirror-SinSubtitulos", partes: [[30, 42]], poster: 8, reel: 6.2 },
  // El sitio de Rugidos, de su composición: el inicio, «¿por qué elegirnos?»,
  // el salón y los servicios adicionales.
  { slug: "rugidos-fiestas", comp: "Rugidos", partes: [[6, 9.5], [14, 17], [21.5, 24.5], [32, 35]], poster: 1.5 },
  // Navkok: el sitio publicado, recorrido de arriba abajo.
  { slug: "navkok-security-group", captura: { url: "https://navkok-website-private.vercel.app", segundos: 12 }, poster: 1 },
];

/** El fundido entre los tramos de un mismo tráiler. */
const FUNDIDO_PARTES = 0.5;

/** El fundido que cierra cada loop sobre su principio. */
const COSTURA = 0.6;
/** Cuánto dura cada proyecto en el reel, y su fundido con el siguiente. */
const REEL_TRAMO = 4;
const REEL_FUNDIDO = 0.6;

function correr(cmd, args, opciones = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", ...opciones });
  if (r.status !== 0) throw new Error(`${cmd} falló: ${args.join(" ")}`);
}

const ffmpeg = (args) => correr("ffmpeg", ["-y", "-v", "error", ...args]);

const duracionDe = (archivo) => {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", archivo], { encoding: "utf8" });
  return Number.parseFloat(r.stdout);
};

/** 1a. Un tramo, renderizado desde la composición. */
function renderizarParte(t, [desde, hasta]) {
  const destino = path.join(RENDERS, `${t.slug}-${desde}-${hasta}.mp4`);
  if (existsSync(destino)) return destino;
  if (!existsSync(REPO_VIDEOS)) throw new Error(`No encuentro el repo de videos en ${REPO_VIDEOS} (variable VIDEOS_REPO).`);
  const cuadros = `${Math.round(desde * FPS)}-${Math.round(hasta * FPS) - 1}`;
  console.log(`  renderizando ${t.comp} ${cuadros}…`);
  correr(
    "npx",
    ["remotion", "render", t.comp, `"${destino}"`, `--frames=${cuadros}`, "--muted", "--gl=angle", "--concurrency=6", "--crf=16", "--timeout=180000", "--log=error"],
    { cwd: REPO_VIDEOS, shell: true },
  );
  // La ruta va entre comillas (pasa por la shell y la carpeta tiene un espacio): si igual no quedó, que se note.
  if (!existsSync(destino)) throw new Error(`Remotion no escribió ${destino}`);
  return destino;
}

/**
 * 1b. La grabación de un sitio: se baja de arriba abajo con un recorrido suave
 * y se saca un cuadro por paso (no un video en tiempo real: así el movimiento
 * no depende de lo que tarde la página en pintar).
 */
async function capturar(t) {
  const destino = path.join(RENDERS, `${t.slug}-captura.mp4`);
  if (existsSync(destino)) return destino;
  const { chromium } = await import("playwright-core");
  const carpeta = path.join(RENDERS, `${t.slug}-cuadros`);
  await mkdir(carpeta, { recursive: true });
  const b = await chromium.launch({ executablePath: NAVEGADOR, headless: true, args: ["--mute-audio", "--hide-scrollbars"] });
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  await p.goto(t.captura.url, { waitUntil: "networkidle" });
  // Se recorre una vez entera para que carguen las imágenes diferidas.
  const alto = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= alto; y += 400) {
    await p.evaluate((v) => scrollTo(0, v), y);
    await p.waitForTimeout(120);
  }
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(1500);
  const n = Math.round(t.captura.segundos * FPS);
  // Un segundo quieto arriba, después baja con una curva suave hasta el final.
  const quieto = FPS;
  for (let i = 0; i < n; i++) {
    const s = Math.max(0, (i - quieto) / (n - quieto - 1));
    const e = s < 0.5 ? 4 * s * s * s : 1 - (-2 * s + 2) ** 3 / 2;
    await p.evaluate((v) => scrollTo(0, v), Math.round(e * alto));
    await p.waitForTimeout(30);
    await p.screenshot({ path: path.join(carpeta, `${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 });
  }
  await b.close();
  ffmpeg(["-framerate", String(FPS), "-i", path.join(carpeta, "%04d.jpg"), "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", destino]);
  await rm(carpeta, { recursive: true, force: true });
  return destino;
}

/** 1. El tráiler entero: sus tramos, unidos con fundidos cortos. */
async function renderizar(t) {
  if (t.captura) return capturar(t);
  const partes = t.partes.map((p) => renderizarParte(t, p));
  if (partes.length === 1) return partes[0];
  const destino = path.join(RENDERS, `${t.slug}-junto.mp4`);
  let filtro = partes.map((_, i) => `[${i}:v]fps=${FPS},settb=AVTB,setpts=PTS-STARTPTS[p${i}]`).join(";") + ";";
  let previo = "p0";
  let largo = duracionDe(partes[0]);
  for (let i = 1; i < partes.length; i++) {
    const salida = i === partes.length - 1 ? "v" : `x${i}`;
    filtro += `[${previo}][p${i}]xfade=transition=fade:duration=${FUNDIDO_PARTES}:offset=${(largo - FUNDIDO_PARTES).toFixed(3)}[${salida}];`;
    largo += duracionDe(partes[i]) - FUNDIDO_PARTES;
    previo = salida;
  }
  ffmpeg([...partes.flatMap((p) => ["-i", p]), "-filter_complex", filtro.replace(/;$/, ""), "-map", "[v]", "-an", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", destino]);
  return destino;
}

/**
 * 2. El loop sin costura. Se descarta el primer `COSTURA` del tramo y, al
 * final, el tramo funde con ese mismo principio: el último cuadro del loop es
 * el primero, y la vuelta no se nota.
 */
function loop(fuente, destino, ancho, crf) {
  const largo = duracionDe(fuente);
  const filtro =
    `[0:v]split[a][b];` +
    `[a]trim=start=${COSTURA},setpts=PTS-STARTPTS[resto];` +
    `[b]trim=end=${COSTURA},setpts=PTS-STARTPTS[inicio];` +
    `[resto][inicio]xfade=transition=fade:duration=${COSTURA}:offset=${(largo - 2 * COSTURA).toFixed(3)},` +
    `scale=${ancho}:-2:flags=lanczos,format=yuv420p[v]`;
  ffmpeg(["-i", fuente, "-filter_complex", filtro, "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-movflags", "+faststart", destino]);
}

/** El póster: un cuadro del loop, en WebP a dos anchos. */
async function poster(video, segundo, base) {
  const png = `${base}-poster.png`;
  ffmpeg(["-ss", String(segundo), "-i", video, "-frames:v", "1", png]);
  for (const ancho of [1280, 640]) {
    await sharp(png).resize({ width: ancho }).webp({ quality: 80, effort: 6 }).toFile(`${base}-${ancho}.webp`);
  }
  await unlink(png);
}

/**
 * 3. El reel: cuatro segundos de cada tramo, encadenados con fundidos, y el
 * mismo cierre sin costura que los loops. Devuelve los cortes (el segundo en
 * que cada proyecto pasa a ser el que se ve) para el sitio.
 */
async function reel(renders) {
  const entradas = renders.flatMap(({ archivo, t }) => ["-ss", String(t.reel), "-t", String(REEL_TRAMO), "-i", archivo]);
  const n = renders.length;
  const paso = REEL_TRAMO - REEL_FUNDIDO;
  let filtro = renders.map((_, i) => `[${i}:v]fps=${FPS},settb=AVTB,setpts=PTS-STARTPTS[t${i}]`).join(";") + ";";
  let previo = "t0";
  for (let i = 1; i < n; i++) {
    const salida = i === n - 1 ? "cadena" : `x${i}`;
    filtro += `[${previo}][t${i}]xfade=transition=fade:duration=${REEL_FUNDIDO}:offset=${(i * paso).toFixed(3)}[${salida}];`;
    previo = salida;
  }
  const largo = n * REEL_TRAMO - (n - 1) * REEL_FUNDIDO;
  // El cierre: el reel arranca `COSTURA` adentro y termina fundiendo con su principio.
  filtro +=
    `[cadena]split[a][b];[a]trim=start=${COSTURA},setpts=PTS-STARTPTS[resto];[b]trim=end=${COSTURA},setpts=PTS-STARTPTS[inicio];` +
    `[resto][inicio]xfade=transition=fade:duration=${COSTURA}:offset=${(largo - 2 * COSTURA).toFixed(3)}[reel];[reel]split[r1][r2];` +
    `[r1]scale=1280:-2:flags=lanczos,format=yuv420p[g];[r2]scale=854:-2:flags=lanczos,format=yuv420p[c]`;
  ffmpeg([
    ...entradas,
    "-filter_complex", filtro,
    "-map", "[g]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "27", "-movflags", "+faststart", path.join(SALIDA, "reel.mp4"),
    "-map", "[c]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-movflags", "+faststart", path.join(SALIDA, "reel-480.mp4"),
  ]);
  await poster(path.join(SALIDA, "reel.mp4"), 1.2, path.join(SALIDA, "reel"));

  // El proyecto i domina desde la mitad de su fundido de entrada; el reel
  // arranca `COSTURA` segundos tarde y vuelve al primero en el fundido final.
  const total = largo - COSTURA;
  const cortes = renders.slice(1).map((_, k) => +((k + 1) * paso + REEL_FUNDIDO / 2 - COSTURA).toFixed(3));
  const vuelta = +(total - COSTURA / 2).toFixed(3);
  return { duracion: +total.toFixed(3), proyectos: renders.map(({ t }) => t.slug), cortes, vuelta };
}

async function main() {
  await mkdir(RENDERS, { recursive: true });
  await mkdir(SALIDA, { recursive: true });
  const renders = [];
  for (const t of TRAMOS) {
    console.log("·", t.slug);
    const archivo = await renderizar(t);
    if (t.reel !== undefined) renders.push({ archivo, t });
    const base = path.join(SALIDA, t.slug);
    // Los dos sitios web sólo se ven en las telas, que usan la versión de 854 px:
    // no llevan la de 1280, y la de 854 se comprime un poco más (un sitio que se
    // desplaza pesa mucho).
    const soloTela = t.reel === undefined;
    if (!soloTela) loop(archivo, `${base}.mp4`, 1280, 26);
    loop(archivo, `${base}-480.mp4`, 854, soloTela ? 31 : 28);
    await poster(soloTela ? `${base}-480.mp4` : `${base}.mp4`, t.poster, base);
    console.log("  ✓", path.relative(RAIZ, `${base}-480.mp4`));
  }
  console.log("· reel");
  const datos = await reel(renders);
  await writeFile(path.join(RAIZ, "src", "contenido", "reel.json"), JSON.stringify(datos, null, 2) + "\n");
  console.log("  ✓ public/medios/videos/reel.mp4 y src/contenido/reel.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
