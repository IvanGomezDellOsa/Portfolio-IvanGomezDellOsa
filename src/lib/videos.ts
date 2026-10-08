/**
 * LAS PIEZAS CHICAS DE LOS VIDEOS, sin datos: las usan tanto el servidor como
 * los componentes cliente (la lista de videos, que arrastra todo el contenido
 * de los proyectos, vive aparte en `funciones.ts`).
 */
import type { SalaId } from "@/contenido/salas";

/** Lo que el teatro necesita de cada video, ya en el idioma de la página. */
export interface Funcion {
  slug: SalaId;
  nombre: string;
  id: string;
  duracion: number;
  acento: string;
  escenas: { t: number; titulo: string }[];
}

/**
 * LO QUE MUESTRA CADA TELA DEL HERO: un proyecto con video (el botón abre el
 * teatro) o uno de los dos sitios web (el botón abre el sitio). Las telas de
 * los nueve muestran un fragmento mudo en loop (`tools/videos.mjs`).
 */
export interface ItemVitrina {
  slug: SalaId;
  nombre: string;
  acento: string;
  video?: { id: string };
  sitio?: string;
}

/** 358 → «5:58». */
export const reloj = (segundos: number) => `${Math.floor(segundos / 60)}:${String(Math.floor(segundos % 60)).padStart(2, "0")}`;

/** 358 → «PT5M58S», para `<time dateTime>`. */
export const duracionIso = (segundos: number) => `PT${Math.floor(segundos / 60)}M${Math.floor(segundos % 60)}S`;

export const enYoutube = (id: string, t = 0) => `https://www.youtube.com/watch?v=${id}${t ? `&t=${Math.floor(t)}s` : ""}`;

/** Los archivos de la vista previa de un proyecto (`tools/videos.mjs`). */
export const vistaPrevia = (slug: string) => ({
  grande: `/medios/videos/${slug}.mp4`,
  chico: `/medios/videos/${slug}-480.mp4`,
  poster: `/medios/videos/${slug}-1280.webp`,
});
