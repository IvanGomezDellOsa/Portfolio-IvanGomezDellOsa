/**
 * CONTRASTE DE CADA AMBIENTE, medido y no estimado. Importa las paletas de
 * `src/contenido/salas.ts` (Node 24 lee TypeScript sin compilar) y calcula el
 * contraste WCAG de cada tinta contra su fondo y contra su superficie. Se corre
 * después de tocar un color:
 *
 *   npm run contraste
 *
 * Mínimos: el cuerpo pasa 7:1; la tinta secundaria y las etiquetas también son
 * texto y necesitan 4,5:1; el acento se usa en trazos, puntos y texto grande,
 * y alcanza con 3:1.
 */
import { SALAS } from "../src/contenido/salas.ts";

/** oklch(L% C H) → sRGB lineal → luminancia relativa. */
function luminancia(oklch) {
  const m = oklch.match(/oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)/);
  if (!m) throw new Error("color no reconocido: " + oklch);
  const L = +m[1] / 100, C = +m[2], h = (+m[3] * Math.PI) / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, mm = m_ ** 3, s = s_ ** 3;
  const clamp = (x) => Math.min(1, Math.max(0, x));
  const r = clamp(4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s);
  const bb = clamp(-0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s);
  return 0.2126 * r + 0.7152 * g + 0.0722 * bb;
}

const contraste = (x, y) => {
  const [a, b] = [luminancia(x), luminancia(y)].sort((p, q) => q - p);
  return (a + 0.05) / (b + 0.05);
};

const MINIMOS = [
  ["tinta", 7],
  ["tinta2", 4.5],
  ["tinta3", 4.5],
  ["acento", 3],
];

let fallas = 0;
for (const [nombre, a] of Object.entries(SALAS)) {
  const partes = MINIMOS.map(([k, minimo]) => {
    // El peor caso de las dos superficies: el fondo y los paneles (`fondo2`).
    const r = Math.min(contraste(a[k], a.fondo), contraste(a[k], a.fondo2));
    if (r < minimo) fallas++;
    return `${k} ${r.toFixed(2)}${r < minimo ? " ✗" : ""}`;
  });
  console.log(nombre.padEnd(26), partes.join("   "));
}
if (fallas) {
  console.error(`\n${fallas} combinación(es) por debajo del mínimo.`);
  process.exit(1);
}
