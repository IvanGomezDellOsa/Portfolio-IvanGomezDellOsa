/**
 * LOS ICONOS, desde `public/favicon.svg`: las iniciales «IGD’O» en Geist (los
 * trazados de la fuente, no texto: se ven igual sin la tipografía instalada)
 * sobre el negro del sitio. El de Apple va sin esquinas redondeadas ni borde
 * (iOS los redondea) y sin transparencia.
 *
 *   npm run iconos
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const svg = await readFile(path.join(RAIZ, "public", "favicon.svg"), "utf8");
const cuadrado = svg.replace('rx="14"', 'rx="0"').replace(/\s*<rect x="0\.75"[^>]*\/>/, "");

await sharp(Buffer.from(svg), { density: 600 }).resize(192, 192).png().toFile(path.join(RAIZ, "public", "icono-192.png"));
await sharp(Buffer.from(cuadrado), { density: 600 }).resize(180, 180).flatten({ background: "#0a0a0a" }).png().toFile(path.join(RAIZ, "public", "icono-180.png"));
console.log("✓ icono-192.png, icono-180.png");
