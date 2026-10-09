"use client";

import type { SalaId } from "@/contenido/salas";
import { VIDEO } from "@/contenido/sitio";
import type { Idioma, VideoProyecto } from "@/contenido/tipos";
import { alClicVideo } from "@/lib/teatro";
import { enYoutube, vistaPrevia } from "@/lib/videos";
import { VideoEnVista } from "./Medios";
import { Triangulo } from "./Iconos";
import css from "./Pantalla.module.css";

/**
 * LA PANTALLA DE UN PROYECTO: su video, mudo y en loop, con el play encima.
 * Lo que corre es un fragmento sin sonido ni subtítulos (`tools/videos.mjs`);
 * el play abre el video completo en el teatro. Sin JavaScript, el enlace lleva
 * a YouTube.
 */
export function Pantalla({
  slug,
  nombre,
  video,
  lang,
  className,
}: {
  slug: SalaId;
  nombre: string;
  video: VideoProyecto;
  lang: Idioma;
  className?: string;
}) {
  const m = vistaPrevia(slug);
  const etiqueta = `${VIDEO.vistaPrevia[lang]} ${nombre}`;
  return (
    <figure className={`${css.pantalla} ${className ?? ""}`}>
      <div className={css.marco}>
        <VideoEnVista
          fuentes={[{ src: m.chico, media: "(max-width: 700px)" }, { src: m.grande }]}
          poster={m.poster}
          ancho={1280}
          alto={720}
          etiqueta={etiqueta}
          lang={lang}
          decorativo
          className={css.loop}
          claseBoton={css.pausa}
        />
        <a
          className={css.reproducir}
          href={enYoutube(video.id)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => alClicVideo(e, slug)}
        >
          {/* La misma pastilla «▶ Ver video» de las telas del hero. */}
          <span className={`pastilla ${css.boton}`}>
            <Triangulo lado={12} />
            {VIDEO.ver[lang]}
            <span className="sr">: {nombre}</span>
          </span>
        </a>
      </div>
    </figure>
  );
}

/**
 * EL BOTON DE UN VIDEO, para las listas de enlaces y el índice: el triángulo,
 * «Ver video». Es un enlace real a YouTube que, con
 * JavaScript, abre el teatro.
 */
export function BotonVideo({
  slug,
  nombre,
  video,
  lang,
  variante = "hueca",
  conTexto = true,
  clase,
}: {
  slug: SalaId;
  nombre: string;
  video: VideoProyecto;
  lang: Idioma;
  variante?: "pastilla" | "hueca" | "chip";
  conTexto?: boolean;
  /** Una clase propia en lugar de la de la variante (el ícono de la lista de proyectos). */
  clase?: string;
}) {
  const estilo = clase ?? (variante === "chip" ? css.chip : variante === "pastilla" ? "pastilla" : "pastilla hueca");
  return (
    <a className={estilo} href={enYoutube(video.id)} target="_blank" rel="noopener noreferrer" onClick={(e) => alClicVideo(e, slug)}>
      <Triangulo lado={variante === "chip" ? 10 : 12} />
      {conTexto ? VIDEO.ver[lang] : <span className="sr">{VIDEO.ver[lang]}</span>}
      <span className="sr">: {nombre}</span>
    </a>
  );
}
