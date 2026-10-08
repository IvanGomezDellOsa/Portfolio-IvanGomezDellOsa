"use client";

import type { SalaId } from "@/contenido/salas";
import { VIDEO } from "@/contenido/sitio";
import type { Idioma, VideoProyecto } from "@/contenido/tipos";
import { alClicVideo } from "@/lib/teatro";
import { enYoutube, reloj } from "@/lib/videos";
import css from "./Escenas.module.css";

/**
 * EL VIDEO, POR ESCENAS: el índice del video en la página del caso. Cada
 * escena abre el teatro en su segundo exacto (sin JavaScript, YouTube en ese
 * segundo). Sirve también para leer de qué trata el video sin verlo.
 */
export function Escenas({ slug, nombre, video, lang }: { slug: SalaId; nombre: string; video: VideoProyecto; lang: Idioma }) {
  if (!video.escenas?.length) return null;
  return (
    <nav className={css.escenas} aria-label={`${VIDEO.escenas[lang]}: ${nombre}`}>
      <p className="etiqueta">{VIDEO.porEscenas[lang]}</p>
      <ol>
        {video.escenas.map((e) => (
          <li key={e.t}>
            <a href={enYoutube(video.id, e.t)} target="_blank" rel="noopener noreferrer" onClick={(ev) => alClicVideo(ev, slug, e.t)}>
              <span className="maquina">{reloj(e.t)}</span>
              <span className={css.titulo}>{e.titulo[lang]}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
