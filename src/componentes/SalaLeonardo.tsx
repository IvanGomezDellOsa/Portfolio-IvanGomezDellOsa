import type { CSSProperties } from "react";
import type { SalaId } from "@/contenido/salas";
import { VISUALES } from "@/contenido/sitio";
import type { Idioma, Proyecto } from "@/contenido/tipos";
import { caso } from "@/lib/rutas";
import { EspacioVectorial } from "./EspacioVectorial";
import { Barras } from "./Graficos";
import { VideoEnVista } from "./Medios";
import { Enlaces, Imagen, Stack } from "./Piezas";
import { EtiquetaSala, estiloSala, videoDe } from "./Sala";
import { Texto } from "./Texto";
import css from "./Sala.module.css";
import ls from "./SalaLeonardo.module.css";

const ARQUITECTURA = {
  es: [
    "Pipeline RAG escrito desde cero: la recuperación, el filtro y la verificación de citas son código propio, sin frameworks como LangChain o LlamaIndex. De esta forma, cada paso se puede controlar y medir por separado.",
    "La consulta se vectoriza en el navegador, sin costo por consulta y sin una cuota que se pueda agotar; la generación usa Gemini, con respaldo en Groq. Costo de operación: US$0.",
  ],
  en: [
    "A RAG pipeline written from scratch: retrieval, the filter and quotation checking are the project's own code, with no frameworks such as LangChain or LlamaIndex. This way, every step can be controlled and measured on its own.",
    "The query is vectorised in the browser, with no cost per query and no quota that can run out; generation uses Gemini, with Groq as fallback. Operating cost: US$0.",
  ],
};

const PRINCIPIO = {
  es: "Pedirle a un modelo que no invente es una esperanza; comprobarlo por código es una garantía.",
  en: "Asking a model not to make things up is a hope; checking it in code is a guarantee.",
};

/**
 * ASK LEONARDO: el primero y el más grande, porque es el proyecto con mejor
 * diseño y demostración técnica (va siempre primero).
 *
 * Se entra al taller de Leonardo: el video del hero de su sitio de fondo, con
 * la descripción canónica textual y, junto al sitio, el play de su video.
 * Después, la historia (cruzar dos datos) al lado de su espacio vectorial
 * real; el resultado medido; las tres formas de entrar al producto (pregunta
 * asistida, biblioteca, museo) y el principio que ordena su arquitectura.
 */
export function SalaLeonardo({ p, lang, previa }: { p: Proyecto; lang: Idioma; previa: SalaId }) {
  const v = VISUALES.piezas;
  const piezas = [
    { src: `/medios/leonardo/codice-${lang}`, ...v.pregunta, alt: lang === "es" ? "El códice: el mapa de temas y una respuesta de Leonardo con su cita textual y sus fuentes." : "The codex: the subject map and an answer from Leonardo with its verbatim quotation and sources." },
    { src: `/medios/leonardo/biblioteca-libro-${lang}`, ...v.biblioteca, alt: lang === "es" ? "Un volumen abierto de la biblioteca 3D, con la lupa sobre una lámina." : "An open volume of the 3D library, with the loupe over a plate." },
    { src: `/medios/leonardo/museo-${lang}`, ...v.museo, alt: lang === "es" ? "La sala del museo virtual con La Gioconda y La Última Cena." : "The virtual museum gallery with the Mona Lisa and The Last Supper." },
  ];

  return (
    <section
      id={p.slug}
      className={`${css.sala} ${ls.leonardo}`}
      data-sala-id={p.slug}
      style={estiloSala(p.slug, previa)}
      aria-labelledby={`t-${p.slug}`}
    >
      <div className={css.umbral} aria-hidden="true" />

      <div className={ls.escena}>
        <VideoEnVista
          fondo
          className={ls.apaisado}
          src="/medios/leonardo/taller.mp4"
          poster="/medios/leonardo/taller.webp"
          ancho={1280}
          alto={720}
          etiqueta=""
          lang={lang}
        />
        <VideoEnVista
          fondo
          className={ls.vertical}
          src="/medios/leonardo/taller-vertical.mp4"
          poster="/medios/leonardo/taller-vertical.webp"
          ancho={720}
          alto={1560}
          etiqueta=""
          lang={lang}
        />
        <div className={ls.velo} aria-hidden="true" />
        <header className={ls.cabecera} data-revelar="">
          <EtiquetaSala p={p} lang={lang} />
          <h2 id={`t-${p.slug}`} className={`${ls.titulo} aparece`} style={{ "--i": 1 } as CSSProperties}>
            {p.nombre}
          </h2>
          <p className={`${ls.canonica} texto aparece`} style={{ "--i": 2 } as CSSProperties}>
            <Texto t={p.resumen[lang]} />
          </p>
          <Enlaces enlaces={p.enlaces} lang={lang} video={videoDe(p)} i={3} />
        </header>
      </div>

      <div className={css.interior}>
        <div className={ls.idea} data-revelar="">
          <div className={`${ls.historia} texto aparece`}>
            {p.cuerpo[lang].map((t, n) => (
              <p key={n}>
                <Texto t={t} />
              </p>
            ))}
          </div>
          <div className={`${ls.vectores} aparece`} style={{ "--i": 1 } as CSSProperties}>
            <EspacioVectorial lang={lang} />
            <p className={ls.aclaracion}>{VISUALES.vectores.pie[lang]}</p>
          </div>
        </div>

        <div className={ls.resultado}>
          <Barras lang={lang} />
        </div>

        <div className={ls.piezas} data-revelar="">
          {piezas.map((pieza, i) => (
            <figure key={pieza.src} className={`${ls.pieza} aparece`} style={{ "--i": i } as CSSProperties}>
              <div className={ls.lamina}>
                <Imagen src={pieza.src} alt={pieza.alt} ancho={1600} alto={900} tam="(max-width: 900px) 100vw, 33vw" />
              </div>
              <figcaption>
                <h3 className={ls.tituloPieza}>{pieza.titulo[lang]}</h3>
                <p>{pieza.texto[lang]}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <blockquote className={ls.principio} data-revelar="">
          <p className="aparece">{PRINCIPIO[lang]}</p>
        </blockquote>

        <div className={css.detalle} data-revelar="">
          <div className={`${css.cuerpo} texto aparece`}>
            {ARQUITECTURA[lang].map((t, n) => (
              <p key={n}>{t}</p>
            ))}
          </div>
          <div className={css.lateral}>
            <Stack items={p.stack} lang={lang} i={1} />
            <Enlaces enlaces={p.enlaces.slice(1)} lang={lang} caso={caso(lang, p.slug)} video={videoDe(p)} i={2} sinPastilla />
          </div>
        </div>
      </div>
    </section>
  );
}
