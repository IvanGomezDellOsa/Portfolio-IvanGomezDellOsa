/**
 * EL RETRATO DEL HERO: la cara que sigue al cursor y, si le hacen clic, niega
 * con la cabeza, se va y a los diez segundos vuelve. Se corre a mano:
 *
 *   npm run retrato
 *
 * DE DONDE SALE. Tres fuentes de la misma sesión (la misma pared, la misma luz,
 * el mismo buzo), llevadas a un solo encuadre: el de `Completo.mp4`.
 *
 *   · `Completo.mp4` (576×1024 a 30 cps), una toma fija y sin cortes: mira
 *     abajo y gira la cabeza en círculo (abajo-derecha, derecha,
 *     arriba-derecha, arriba, arriba-izquierda, izquierda, abajo-izquierda) y
 *     vuelve al frente. De acá sale el anillo de poses.
 *   · `Solo me voy.mp4`, otra toma: de frente, niega y sale por la derecha.
 *     De acá salen el frente, la salida y la vuelta (la salida al revés).
 *   · `izquierda/…17.26.21 (2).jpeg`, una foto: en la toma, la pose izquierda
 *     mira abajo-izquierda; la foto mira a la izquierda derecho.
 *
 * LOS CUADROS DEL ANILLO (números de cuadro de `Completo`). De cada pose quieta,
 * el cuadro con menos movimiento; entre pose y pose, tres intermedios repartidos
 * por el movimiento acumulado del giro (al cuarto, a la mitad y a los tres
 * cuartos): la cabeza gira de verdad en vez de saltar. Entre abajo-izquierda y
 * abajo la toma no tiene giro (de ahí vuelve al frente): esos tres lugares son
 * los del camino de abajo-izquierda al frente.
 *
 * CÓMO SE ALINEAN (medido una vez, con OpenCV, y anotado acá):
 *   · `Solo` tiene más zoom: alineada por la cara (SIFT + RANSAC) contra el
 *     frente de `Completo`, va a 0,895 de escala, 92 px a la derecha y 18 más
 *     abajo. No llega al borde izquierdo del encuadre: esa franja es pared, y
 *     se rellena con la pared vacía de `Completo` (su último cuadro), igualada
 *     fila por fila al brillo de la pared de `Solo` junto a la unión y fundida
 *     en 36 px. Así la unión no se ve ni con la pared sola.
 *   · La foto, por el tamaño de la cabeza (0,645, lo mismo que da la oreja) y
 *     con la oreja donde está en los cuadros vecinos de la toma (el pivote de
 *     la cabeza al inclinarla). Sin giro: la cámara estaba derecha. El color se
 *     iguala a los cuadros vecinos (media y desvío en Lab, llevados a una
 *     ganancia y un desplazamiento por canal) y un desenfoque de 0,5 px la deja
 *     tan nítida como el video.
 *
 * SALIDA (`public/medios/persona/retrato/`):
 *   · anillo.webp  los 33 cuadros en una grilla de 6×6: el anillo y el frente;
 *   · frente.webp  el frente solo (lo primero que se pinta);
 *   · salida.mp4   del frente a la pared vacía; termina quieta en la pared;
 *   · vuelta.mp4   la salida al revés: de la pared vacía a mirar a cámara.
 * Los dos videos, H.264 sin audio; el último cuadro de uno es el primero del otro.
 */
import sharp from "sharp";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CARPETA = process.env.RETRATO ?? "C:/Users/IvanGomezD/Downloads/Hero imagen - video";
const COMPLETO = path.join(CARPETA, "Completo.mp4");
const SOLO = path.join(CARPETA, "Solo me voy.mp4");
const FOTO_IZQUIERDA = path.join(CARPETA, "izquierda", "WhatsApp Image 2026-10-08 at 17.26.21 (2).jpeg");
const SALIDA = path.join(RAIZ, "public", "medios", "persona", "retrato");

/** El encuadre, en píxeles de `Completo`: el ancho entero, desde 60 px abajo del borde. Cabe la cabeza en todas las poses. */
const ANCHO = 576;
const ALTO = 1024;
const ARRIBA = 60;
const CELDA = 300;
const COLUMNAS = 6;

/** Las ocho poses en el orden de la toma, cada una con sus tres intermedios hacia la siguiente. */
const ANILLO = [
  11, 30, 34, 38, // abajo
  69, 85, 88, 91, // abajo-derecha
  117, 149, 152, 155, // derecha
  207, 223, 226, 231, // arriba-derecha
  265, 290, 293, 296, // arriba
  321, 350, 354, 358, // arriba-izquierda
  "foto", 409, 412, 416, // izquierda (la foto; en la toma, el 387 mira abajo-izquierda)
  437, 473, 478, 484, // abajo-izquierda, y su camino al frente
];
const PARED = 609; // el último cuadro de `Completo`: la pared sola

/** `Solo me voy`: quieto de frente hasta el 13, niega del 14 al 41, sale del 42 al 64. */
const SOLO_FRENTE = 8;
const SOLO_FIN = 80; // ya fuera de cuadro, con la exposición casi asentada
const SOLO_VUELVE = 41; // la vuelta termina acá, mirando a cámara
const SOLO_ESCALA = [515, 916]; // 576×1024 a 0,895
const SOLO_X = 92;
const SOLO_Y = 18;
const UNION = 36;

const FOTO_ESCALA = 0.645;
const FOTO_X = 268 - FOTO_ESCALA * 605; // la oreja: (605, 485) en la foto, (268, 394) en la toma
const FOTO_Y = 394 - FOTO_ESCALA * 485;
const FOTO_GANANCIA = [0.948, 0.958, 0.962];
const FOTO_DESPLAZAMIENTO = [12.0, 10.2, 11.3];

function ffmpeg(args) {
  const r = spawnSync("ffmpeg", ["-y", "-v", "error", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg falló: " + args.join(" "));
}

/** Del YUV de las tomas (BT.709, rango TV) a RGB con la misma matriz que usa el navegador para el video. */
const A_RGB = "in_color_matrix=bt709:in_range=tv:out_range=pc";

const crudo = async (entrada) => (await sharp(entrada).removeAlpha().raw().toBuffer({ resolveWithObject: true })).data;

/** De un cuadro en coordenadas de `Completo` (crudo o archivo) a la celda de 300. */
async function encuadrar(entrada, opciones) {
  const recorte = await sharp(entrada, opciones)
    .extract({ left: 0, top: ARRIBA, width: ANCHO, height: ANCHO })
    .png({ compressionLevel: 0 })
    .toBuffer();
  return sharp(recorte).resize(CELDA, CELDA, { kernel: "lanczos3" }).png().toBuffer();
}

/** Media gaussiana de una columna de valores (la ganancia por fila). */
function suavizar(valores, sigma) {
  const radio = Math.ceil(sigma * 3);
  const pesos = Array.from({ length: 2 * radio + 1 }, (_, i) => Math.exp(-((i - radio) ** 2) / (2 * sigma * sigma)));
  return valores.map((_, y) => {
    let suma = 0;
    let total = 0;
    for (let k = -radio; k <= radio; k++) {
      const v = valores[Math.min(valores.length - 1, Math.max(0, y + k))];
      suma += v * pesos[k + radio];
      total += pesos[k + radio];
    }
    return suma / total;
  });
}

/**
 * Un cuadro de `Solo` ya escalado y ubicado: la franja de la izquierda que no
 * tiene se rellena con la pared vacía, con el brillo de su propia pared.
 */
function rellenar(solo, pared) {
  const px = (x, y) => (y * ANCHO + x) * 3;
  const ganancia = [[], [], []];
  for (let y = 0; y < ALTO; y++) {
    const suma = [0, 0, 0];
    const base = [0, 0, 0];
    for (let x = SOLO_X + 4; x < SOLO_X + 40; x++) {
      const i = px(x, y);
      const claro = (b) => (b[i] + b[i + 1] + b[i + 2]) / 3 > 150;
      if (!claro(solo) || !claro(pared)) continue;
      for (let c = 0; c < 3; c++) {
        suma[c] += solo[i + c];
        base[c] += pared[i + c];
      }
    }
    for (let c = 0; c < 3; c++) ganancia[c][y] = base[c] > 0 ? suma[c] / base[c] : null;
  }
  // Las filas sin pared junto a la unión (el buzo, o fuera de la toma) toman la más cercana.
  for (const g of ganancia) {
    const conDato = g.flatMap((v, y) => (v === null ? [] : [y]));
    for (let y = 0; y < ALTO; y++) {
      if (g[y] === null) g[y] = g[conDato.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a))];
    }
  }
  const suave = ganancia.map((g) => suavizar(g, 20));
  const salida = Buffer.from(solo);
  for (let y = ARRIBA; y < ARRIBA + ANCHO; y++) {
    for (let x = 0; x < SOLO_X + 3 + UNION; x++) {
      const t = Math.min(1, Math.max(0, (x - SOLO_X - 3) / UNION));
      const a = t * t * (3 - 2 * t);
      const i = px(x, y);
      for (let c = 0; c < 3; c++) salida[i + c] = Math.round(a * solo[i + c] + (1 - a) * Math.min(255, pared[i + c] * suave[c][y]));
    }
  }
  return salida;
}

/** La foto, a escala de la toma, con la oreja en su lugar y el color de los cuadros vecinos. */
async function fotoIzquierda() {
  const lado = Math.round(1280 * FOTO_ESCALA);
  const escalada = await sharp(FOTO_IZQUIERDA).rotate().resize(lado, lado, { kernel: "lanczos3" }).toBuffer();
  const izquierda = Math.round(-FOTO_X);
  const arriba = Math.round(ARRIBA - FOTO_Y);
  const extra = Math.max(0, -arriba); // la foto empieza 21 px más abajo que el encuadre: espejo de pared
  const extendida = await sharp(escalada).extend({ top: extra, extendWith: "mirror" }).toBuffer();
  const recorte = await sharp(extendida)
    .extract({ left: izquierda, top: arriba + extra, width: ANCHO, height: ANCHO })
    .linear(FOTO_GANANCIA, FOTO_DESPLAZAMIENTO)
    .toBuffer();
  const celda = await sharp(recorte).resize(CELDA, CELDA, { kernel: "lanczos3" }).toBuffer();
  return sharp(celda).blur(0.5).png().toBuffer();
}

/** H.264 desde una secuencia de PNG, de vuelta a YUV con la matriz BT.709. */
function video(entrada, destino, extra = []) {
  ffmpeg([
    "-framerate", "30", ...extra, "-i", entrada, "-an",
    "-vf", `${extra.includes("-start_number") ? "reverse," : ""}scale=out_color_matrix=bt709:out_range=tv,format=yuv420p`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "22",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-movflags", "+faststart", destino,
  ]);
}

async function main() {
  for (const f of [COMPLETO, SOLO, FOTO_IZQUIERDA]) if (!existsSync(f)) throw new Error(`falta ${f} (la carpeta se pasa en RETRATO=...)`);
  await mkdir(SALIDA, { recursive: true });
  const tmp = await mkdtemp(path.join(os.tmpdir(), "retrato-"));
  await mkdir(path.join(tmp, "solo"));

  // Los cuadros de `Completo`, de una pasada y en orden (la lista va de menor a mayor).
  const deLaToma = [...ANILLO.filter((n) => typeof n === "number"), PARED];
  const elegir = deLaToma.map((n) => `eq(n\\,${n})`).join("+");
  ffmpeg(["-i", COMPLETO, "-vf", `select='${elegir}',scale=${A_RGB},format=rgb24`, "-fps_mode", "passthrough", path.join(tmp, "c%02d.png")]);
  const deCompleto = (n) => path.join(tmp, `c${String(deLaToma.indexOf(n) + 1).padStart(2, "0")}.png`);

  const celdas = [];
  for (const n of ANILLO) celdas.push(n === "foto" ? await fotoIzquierda() : await encuadrar(deCompleto(n)));

  // `Solo`, del frente a la pared: escalada y ubicada en el encuadre de `Completo`, con su franja rellena.
  const [sw, sh] = SOLO_ESCALA;
  ffmpeg([
    "-i", SOLO, "-vf",
    `select='between(n\\,${SOLO_FRENTE}\\,${SOLO_FIN})',scale=${sw}:${sh}:flags=lanczos:${A_RGB},format=rgb24,` +
      `pad=${SOLO_X + sw}:${ALTO}:${SOLO_X}:${SOLO_Y},crop=${ANCHO}:${ALTO}:0:0`,
    "-fps_mode", "passthrough", path.join(tmp, "s%03d.png"),
  ]);
  const pared = await crudo(deCompleto(PARED));
  const cuadrosSolo = SOLO_FIN - SOLO_FRENTE + 1;
  for (let i = 1; i <= cuadrosSolo; i++) {
    const relleno = rellenar(await crudo(path.join(tmp, `s${String(i).padStart(3, "0")}.png`)), pared);
    const celda = await encuadrar(relleno, { raw: { width: ANCHO, height: ALTO, channels: 3 } });
    await writeFile(path.join(tmp, "solo", `${String(i).padStart(3, "0")}.png`), celda);
    if (i === 1) celdas.push(celda); // el frente
  }

  const filas = Math.ceil(celdas.length / COLUMNAS);
  await sharp({ create: { width: COLUMNAS * CELDA, height: filas * CELDA, channels: 3, background: "#000" } })
    .composite(celdas.map((input, i) => ({ input, left: (i % COLUMNAS) * CELDA, top: Math.floor(i / COLUMNAS) * CELDA })))
    .webp({ quality: 78, effort: 6 })
    .toFile(path.join(SALIDA, "anillo.webp"));
  await sharp(celdas.at(-1)).webp({ quality: 82, effort: 6 }).toFile(path.join(SALIDA, "frente.webp"));

  const secuencia = path.join(tmp, "solo", "%03d.png");
  video(secuencia, path.join(SALIDA, "salida.mp4"));
  // La vuelta: del último cuadro de la salida hasta que mira a cámara, al revés.
  video(secuencia, path.join(SALIDA, "vuelta.mp4"), ["-start_number", String(SOLO_VUELVE - SOLO_FRENTE + 1)]);

  await rm(tmp, { recursive: true, force: true });
  console.log(`  ✓ retrato: ${celdas.length} cuadros en ${COLUMNAS}×${filas}, frente, salida y vuelta`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
