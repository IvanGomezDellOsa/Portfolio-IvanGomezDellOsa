import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS } from "@/contenido/salas";
import type { Idioma } from "@/contenido/tipos";
import type { Funcion, ItemVitrina } from "./videos";

/**
 * LOS VIDEOS DE TODOS LOS PROYECTOS, en el orden de las salas y en el idioma
 * de la página. Se arma en el servidor y viaja como prop al teatro.
 */
export function funcionesDe(lang: Idioma): Funcion[] {
  return PROYECTOS.flatMap((p) =>
    p.video
      ? [
          {
            slug: p.slug,
            nombre: p.nombre,
            id: p.video.id,
            duracion: p.video.duracion,
            acento: SALAS[p.slug].acento,
            escenas: (p.video.escenas ?? []).map((e) => ({ t: e.t, titulo: e.titulo[lang] })),
          },
        ]
      : [],
  );
}

/** Las telas del hero: los nueve proyectos, en el orden de las salas. */
export function vitrinaDe(lang: Idioma): ItemVitrina[] {
  return PROYECTOS.map((p) => {
    const vivo = p.enlaces.find((e) => e.tipo === "sitio" || e.tipo === "vista-previa");
    return {
      slug: p.slug,
      nombre: p.nombre,
      acento: SALAS[p.slug].acento,
      ...(p.video ? { video: { id: p.video.id } } : vivo ? { sitio: lang === "en" && vivo.hrefEn ? vivo.hrefEn : vivo.href } : {}),
    };
  });
}
