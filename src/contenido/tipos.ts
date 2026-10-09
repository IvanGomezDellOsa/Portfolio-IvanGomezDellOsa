import type { SalaId } from "./salas";

export type Idioma = "es" | "en";

/** Un texto en los dos idiomas. Todo lo que ve el visitante pasa por acá. */
export type Bilingue<T = string> = Record<Idioma, T>;

/**
 * MARCADO MINIMO DENTRO DE LOS TEXTOS: **negrita**, *cursiva* y [texto](url).
 * Lo interpreta `componentes/Texto.tsx` sin `dangerouslySetInnerHTML`: los
 * textos son constantes de este repositorio, pero así no hay forma de que un
 * `<` se cuele como HTML.
 */
export type Marcado = string;

export type TipoEnlace = "sitio" | "repositorio" | "demo" | "vista-previa" | "tienda" | "descarga";

export interface Enlace {
  tipo: TipoEnlace;
  href: string;
  /** Si la versión en inglés del destino vive en otra URL (p. ej. `/en`). */
  hrefEn?: string;
  /** Lo que se lee. Si falta, sale del tipo (`Sitio web`, `Repositorio`...). */
  texto?: Bilingue;
  /** Una aclaración corta al lado, como «(ES / EN)». */
  nota?: Bilingue;
}

/**
 * EL DATO DE UNA SALA: un número medido, con qué mide y de dónde sale. Va en la
 * voz de máquina (monoespaciada) porque es lo verificable del proyecto; lo que
 * se cuenta con palabras va en serif.
 */
export interface Dato {
  valor: Bilingue;
  etiqueta: Bilingue<Marcado>;
  nota?: Bilingue<Marcado>;
}

/** El bloque de material visual que muestra cada sala. */
export type VisualSala =
  | "leonardo"
  | "datos-pauta"
  | "sevive"
  | "inversiones"
  | "facehunt"
  | "mementolife"
  | "rugidos"
  | "navkok"
  | "freemagicmirror";

export type Bloque =
  | { tipo: "parrafos"; texto: Bilingue<Marcado[]> }
  | { tipo: "lista"; items: Bilingue<Marcado[]> }
  | { tipo: "diagrama"; lineas: Bilingue<string[]>; pie?: Bilingue<Marcado> }
  | { tipo: "tabla"; columnas: Bilingue<string[]>; filas: Bilingue<Marcado[][]>; pie?: Bilingue<Marcado> }
  | { tipo: "imagenes"; imagenes: ImagenCaso[]; pie?: Bilingue<Marcado> }
  | { tipo: "visual"; id: "vectores" | "barras" | "cobertura" | "capas" | "sistema" | "grilla" | "kiosco" }
  | { tipo: "cita"; texto: Bilingue<Marcado> };

/** Una escena del video: el segundo en que empieza y cómo se llama. */
export interface Escena {
  t: number;
  titulo: Bilingue;
}

/**
 * EL VIDEO DE UN PROYECTO, publicado en YouTube:
 * narrado en inglés, con los subtítulos en español quemados. El sitio no lo
 * aloja; lo reproduce YouTube cuando alguien le da play. La vista previa muda
 * y el póster salen de `tools/videos.mjs` (`/medios/videos/<slug>`).
 */
export interface VideoProyecto {
  /** El id de YouTube (`youtu.be/<id>`). */
  id: string;
  /** En segundos, como la muestra YouTube. */
  duracion: number;
  /** Los tiempos salen del `timeline.json` de cada video en `portfolio-videos`. */
  escenas?: Escena[];
}

/**
 * Una imagen de `public/medios`. Si `src` termina en `.webp` es un archivo
 * único; si no, es la base de un par `-960.webp` / `-1600.webp` (o los anchos
 * de `anchos`) y el navegador elige con `srcset`.
 */
export interface ImagenCaso {
  src: Bilingue;
  alt: Bilingue;
  ancho: number;
  alto: number;
  anchos?: number[];
  /** Captura de teléfono: se muestra dentro de un marco de teléfono. */
  telefono?: boolean;
}

export interface SeccionCaso {
  titulo: Bilingue;
  bloques: Bloque[];
}

export interface PrimeraVersion {
  nombre: string;
  periodo: Bilingue;
  texto: Bilingue<Marcado>;
  stack: string[];
  enlaces: Enlace[];
  imagen?: ImagenCaso;
}

export interface Proyecto {
  slug: SalaId;
  nombre: string;
  /** Ruta de la marca (WebP cuadrado de 160 px). */
  marca: string;
  /** «Producto propio», «Freelance», «Rugidos Fiestas Tandil». */
  origen: Bilingue;
  periodo: Bilingue;
  area: Bilingue;
  /** Una línea debajo del nombre, sólo si el nombre solo no alcanza. */
  subtitulo?: Bilingue;
  /** La descripción aprobada: la del caso completo, y el comienzo de la ampliada. */
  resumen: Bilingue<Marcado>;
  /**
   * LA DESCRIPCION REDUCIDA: lo que la sala muestra sin abrir nada (una o dos
   * líneas). Si falta, la reducida es `resumen`, que ya es corto.
   */
  breve?: Bilingue<Marcado>;
  /**
   * Uno o dos párrafos más. En la sala, `resumen` + `cuerpo` es la
   * descripción ampliada que reemplaza a la reducida con «Leer más». El
   * detalle va en el caso.
   */
  cuerpo: Bilingue<Marcado[]>;
  dato?: Dato;
  stack: string[];
  enlaces: Enlace[];
  visual: VisualSala;
  /** Los sitios (Rugidos, Navkok) no tienen: se ven con un clic, sin nada que explicar. */
  video?: VideoProyecto;
  primeraVersion?: PrimeraVersion;
  caso: SeccionCaso[];
  /** Una línea para `<meta name="description">` del caso (≤ 155 caracteres). */
  descripcionMeta: Bilingue;
}
