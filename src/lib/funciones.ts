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

/** En las telas, FreeMagicMirror y FaceHunt 2 cambian de lugar (pedido de Iván). */
const CAMBIADOS = ["freemagicmirror", "facehunt-2"];

/** Las telas del hero: los nueve proyectos, en el orden de las salas salvo `CAMBIADOS`. */
export function vitrinaDe(lang: Idioma): ItemVitrina[] {
  const orden: string[] = PROYECTOS.map((p) => p.slug);
  const [a, b] = CAMBIADOS.map((s) => orden.indexOf(s));
  const proyectos = [...PROYECTOS];
  if (a! >= 0 && b! >= 0) [proyectos[a!], proyectos[b!]] = [proyectos[b!]!, proyectos[a!]!];
  return proyectos.map((p) => {
    const vivo = p.enlaces.find((e) => e.tipo === "sitio" || e.tipo === "vista-previa");
    return {
      slug: p.slug,
      nombre: p.nombre,
      marca: p.marca.replace("marca.webp", "espera.webp"),
      acento: SALAS[p.slug].acento,
      ...(p.video ? { video: { id: p.video.id } } : vivo ? { sitio: lang === "en" && vivo.hrefEn ? vivo.hrefEn : vivo.href } : {}),
    };
  });
}
