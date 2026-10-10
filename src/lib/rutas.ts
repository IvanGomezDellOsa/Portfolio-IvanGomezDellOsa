/**
 * UNA URL POR IDIOMA, como en Ask Leonardo: el español en la raíz y el inglés
 * bajo `/en`. Cada página declara su canónica y su alternativa (hreflang), así
 * los buscadores no las hacen competir entre sí.
 */
import type { Idioma } from "@/contenido/tipos";
import { SITIO } from "@/contenido/sitio";

export const inicio = (lang: Idioma) => (lang === "es" ? "/" : "/en/");

/** Cada proyecto es una sección de la portada: su dirección es el ancla. */
export const caso = (lang: Idioma, slug: string) => `${inicio(lang)}#${slug}`;

export const otroIdioma = (lang: Idioma): Idioma => (lang === "es" ? "en" : "es");

/** Las alternativas de una página, para `alternates.languages`. */
export const alternativas = (es: string, en: string) => ({
  "es-AR": `${SITIO}${es}`,
  "en-US": `${SITIO}${en}`,
  "x-default": `${SITIO}${es}`,
});
