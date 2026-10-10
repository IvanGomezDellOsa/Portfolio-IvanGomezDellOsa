"use client";

import type { SalaId } from "@/contenido/salas";
import { HERO, SALA, VIDEO } from "@/contenido/sitio";
import type { Idioma, TipoEnlace, VideoProyecto } from "@/contenido/tipos";
import { alClicVideo } from "@/lib/teatro";
import { enYoutube, vistaPrevia } from "@/lib/videos";
import { VideoEnVista } from "./Medios";
import { Flecha, Triangulo } from "./Iconos";
import css from "./Pantalla.module.css";

/**
 * LA PANTALLA DE UN PROYECTO: lo principal de su sección. Corre un fragmento
 * mudo y en loop (`tools/videos.mjs`) y, en el centro, la acción: «▶ Video de
 * presentación» abre el video completo en el teatro (sin JavaScript, el
 * enlace lleva a YouTube). Los dos sitios web no tienen video de presentación:
 * su pantalla muestra el recorrido de la página, que es lo que hay para ver, y
 * el botón que lleva al sitio va en una esquina, sin taparlo.
 */
export function Pantalla({
  slug,
  nombre,
  video,
  sitio,
  lang,
  className,
}: {
  slug: SalaId;
  nombre: string;
  video?: VideoProyecto;
  /** Para un proyecto sin video: a dónde lleva su pantalla. */
  sitio?: { href: string; tipo: TipoEnlace };
  lang: Idioma;
  className?: string;
}) {
  const m = vistaPrevia(slug);
  const etiqueta = `${video ? VIDEO.vistaPrevia[lang] : VIDEO.recorridoDe[lang]} ${nombre}`;
  const destino = video ? enYoutube(video.id) : sitio?.href;
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
        {destino && (
          <a className={css.accion} data-tipo={video ? "video" : "sitio"} href={destino} target="_blank" rel="noopener noreferrer" onClick={video ? (e) => alClicVideo(e, slug) : undefined}>
            {/* La pastilla clara del sitio, la misma de las telas, en grande. */}
            <span className={`pastilla ${css.boton}`}>
              {video ? (
                <>
                  <Triangulo lado={13} />
                  {VIDEO.presentacion[lang]}
                  <span className="sr">: {nombre}</span>
                </>
              ) : (
                <>
                  {sitio?.tipo === "vista-previa" ? SALA.verVistaPrevia[lang] : HERO.verSitio[lang]}
                  <span className="sr">: {nombre}</span>
                  <Flecha lado={13} />
                </>
              )}
            </span>
          </a>
        )}
      </div>
    </figure>
  );
}

/**
 * EL BOTON DE UN VIDEO en la lista de proyectos: sólo el triángulo. Es un
 * enlace real a YouTube que, con JavaScript, abre el teatro.
 */
export function BotonVideo({
  slug,
  nombre,
  video,
  lang,
  clase,
}: {
  slug: SalaId;
  nombre: string;
  video: VideoProyecto;
  lang: Idioma;
  clase?: string;
}) {
  return (
    <a className={clase} href={enYoutube(video.id)} target="_blank" rel="noopener noreferrer" title={VIDEO.presentacion[lang]} onClick={(e) => alClicVideo(e, slug)}>
      <Triangulo lado={12} />
      <span className="sr">
        {VIDEO.presentacion[lang]}: {nombre}
      </span>
    </a>
  );
}
