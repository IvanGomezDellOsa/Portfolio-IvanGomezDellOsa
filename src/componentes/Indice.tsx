import type { CSSProperties } from "react";
import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS } from "@/contenido/salas";
import { INDICE, SALA } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { Flecha } from "./Iconos";
import { BotonVideo } from "./Pantalla";
import css from "./Indice.module.css";

/**
 * EL INDICE: los nueve proyectos en una tabla, antes de recorrerlos. Cada fila
 * lleva a su sección; a la derecha, el video o, en los dos
 * sitios web, el sitio mismo, que se ve con un clic.
 */
export function Indice({ lang }: { lang: Idioma }) {
  return (
    <section id="proyectos" className={css.indice} aria-labelledby="t-indice">
      <div className={css.interior}>
        <header className={css.cabecera}>
          <h2 id="t-indice" className={css.titulo}>
            {INDICE.titulo[lang]}
          </h2>
        </header>
        <ol className={css.lista}>
          {PROYECTOS.map((p) => {
            const vivo = p.enlaces.find((e) => e.tipo === "sitio" || e.tipo === "vista-previa");
            return (
              <li key={p.slug} className={css.fila} style={{ "--tinte": SALAS[p.slug].acento } as CSSProperties}>
                <a className={css.enlace} href={`#${p.slug}`}>
                  <span className={css.punto} aria-hidden="true" />
                  <span className={css.nombre}>{p.nombre}</span>
                  <span className={css.area}>{p.area[lang]}</span>
                  <span className={`${css.meta} maquina`}>
                    {p.origen[lang]} · {p.periodo[lang]}
                  </span>
                </a>
                <div className={css.accion}>
                  {p.video ? (
                    <BotonVideo slug={p.slug} nombre={p.nombre} video={p.video} lang={lang} variante="chip" />
                  ) : vivo ? (
                    <a className={css.sitio} href={lang === "en" && vivo.hrefEn ? vivo.hrefEn : vivo.href} target="_blank" rel="noopener noreferrer">
                      {(vivo.tipo === "vista-previa" ? SALA.vistaPrevia : INDICE.sitio)[lang]}
                      <span className="sr">: {p.nombre}</span>
                      <Flecha />
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
