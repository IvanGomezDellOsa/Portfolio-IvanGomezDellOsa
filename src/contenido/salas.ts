/**
 * LOS AMBIENTES. Todo el sitio es oscuro, neutro y sobrio; cada proyecto se
 * distingue por el tinte de su producto: un negro con el matiz de su marca
 * (azul noche en Datos Pauta, violeta en FaceHunt 2, dorado en Navkok…) y su
 * color de acento. El marco (tipografía, pelos, etiquetas) es siempre el mismo:
 * lo que cambia es el tinte. El hero y la galería son neutros.
 *
 * EN OKLCH A PROPOSITO: dos colores con la misma claridad se ven igual de
 * claros aunque tengan croma distinto, y eso deja que diez ambientes de
 * matices distintos mantengan la misma jerarquía de lectura.
 *
 * Cada paleta se mide con `npm run contraste`: la tinta pasa 7:1, la tinta
 * secundaria y las etiquetas 4,5:1, y el acento (trazos, puntos, números
 * grandes) 3:1. No se agrega un color sin correr esa medición.
 *
 * `hex` es el mismo fondo, para `theme-color`, que se lee fuera de la hoja de
 * estilos y no entiende oklch en todos los navegadores.
 */

export type SalaId =
  | "taller"
  | "ask-leonardo-da-vinci"
  | "datos-pauta-oficial"
  | "sevive"
  | "inversiones-en-argentina"
  | "facehunt-2"
  | "mementolife"
  | "rugidos-fiestas"
  | "navkok-security-group"
  | "freemagicmirror"
  | "galeria";

export interface Ambiente {
  fondo: string;
  /** Superficie un paso más allá del fondo: marcos, paneles, gráficos. */
  fondo2: string;
  /** El resplandor del acento, arriba a la derecha: lo que hace del tinte un lugar. */
  luz: string;
  tinta: string;
  tinta2: string;
  tinta3: string;
  pelo: string;
  acento: string;
  hex: string;
}

/** Un ambiente a partir de su fondo, su acento y el matiz de sus grises. */
const ambiente = (fondo: string, fondo2: string, acento: string, luz: string, matiz: number, croma: number, hex: string): Ambiente => ({
  fondo,
  fondo2,
  luz,
  tinta: `oklch(96% ${(croma / 2).toFixed(3)} ${matiz})`,
  tinta2: `oklch(80% ${croma.toFixed(3)} ${matiz})`,
  tinta3: `oklch(68% ${(croma * 1.4).toFixed(3)} ${matiz})`,
  pelo: `oklch(96% ${croma.toFixed(3)} ${matiz} / 0.11)`,
  acento,
  hex,
});

export const SALAS: Record<SalaId, Ambiente> = {
  /** El hero y el índice: negro neutro. */
  taller: ambiente("oklch(14.5% 0 0)", "oklch(19.5% 0 0)", "oklch(94.5% 0 0)", "oklch(100% 0 0 / 0.07)", 0, 0, "#0a0a0a"),
  /** Negro cálido y dorado: el taller de Leonardo, junto al fuego. */
  "ask-leonardo-da-vinci": ambiente("oklch(13.5% 0.012 55)", "oklch(18.5% 0.013 55)", "oklch(80% 0.1 75)", "oklch(55% 0.11 60 / 0.2)", 70, 0.012, "#0c0705"),
  /** Azul noche y cian, el HUD del sitio y de su video. */
  "datos-pauta-oficial": ambiente("oklch(15.5% 0.03 245)", "oklch(20.5% 0.033 245)", "oklch(82% 0.13 205)", "oklch(58% 0.11 210 / 0.18)", 240, 0.012, "#020d18"),
  /** Bordó casi negro y el rosa viejo de la aplicación. */
  sevive: ambiente("oklch(15% 0.022 10)", "oklch(20% 0.024 10)", "oklch(77% 0.085 10)", "oklch(58% 0.1 10 / 0.18)", 10, 0.012, "#130709"),
  /** Azul marino, como su video, y el celeste de la bandera. */
  "inversiones-en-argentina": ambiente("oklch(15.5% 0.035 258)", "oklch(20.5% 0.038 258)", "oklch(79% 0.1 238)", "oklch(58% 0.1 240 / 0.18)", 250, 0.012, "#040c1b"),
  /** Índigo y violeta, los de la aplicación. */
  "facehunt-2": ambiente("oklch(14.5% 0.04 285)", "oklch(19.5% 0.044 285)", "oklch(73% 0.15 285)", "oklch(52% 0.15 285 / 0.2)", 285, 0.014, "#09071a"),
  /** El tema oscuro de la extensión: negro cálido y crema. */
  mementolife: ambiente("oklch(14.5% 0.006 80)", "oklch(19.5% 0.007 80)", "oklch(84% 0.06 85)", "oklch(60% 0.05 80 / 0.14)", 80, 0.01, "#0b0a08"),
  /** Violeta profundo y el naranja del logo. */
  "rugidos-fiestas": ambiente("oklch(15.5% 0.055 310)", "oklch(20.5% 0.06 310)", "oklch(77% 0.15 55)", "oklch(50% 0.18 320 / 0.22)", 315, 0.014, "#13041d"),
  /** Negro y dorado, los del escudo. */
  "navkok-security-group": ambiente("oklch(13% 0.006 85)", "oklch(18% 0.007 85)", "oklch(84% 0.14 88)", "oklch(58% 0.1 85 / 0.16)", 88, 0.01, "#080705"),
  /** Ciruela casi negro y el rosa de la aplicación. */
  freemagicmirror: ambiente("oklch(15% 0.035 350)", "oklch(20% 0.038 350)", "oklch(74% 0.16 355)", "oklch(55% 0.16 355 / 0.2)", 350, 0.014, "#16050d"),
  /** La salida (sobre mí, experiencia, contacto): otra vez neutro. */
  galeria: ambiente("oklch(14.5% 0 0)", "oklch(19.5% 0 0)", "oklch(94.5% 0 0)", "oklch(100% 0 0 / 0.05)", 0, 0, "#0a0a0a"),
};

/** Las variables CSS de un ambiente, para el `style` de su sección. */
export function variablesDe(id: SalaId): Record<string, string> {
  const a = SALAS[id];
  return {
    "--fondo": a.fondo,
    "--fondo-2": a.fondo2,
    "--luz": a.luz,
    "--tinta": a.tinta,
    "--tinta-2": a.tinta2,
    "--tinta-3": a.tinta3,
    "--pelo": a.pelo,
    "--acento": a.acento,
  };
}
