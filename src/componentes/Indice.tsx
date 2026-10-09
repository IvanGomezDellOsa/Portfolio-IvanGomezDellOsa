import type { CSSProperties, ReactNode } from "react";
import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS } from "@/contenido/salas";
import { INDICE, SALA } from "@/contenido/sitio";
import type { Enlace, Idioma } from "@/contenido/tipos";
import { IconoDescarga, IconoExtension, IconoGithub, IconoWeb } from "./Iconos";
import { BotonVideo } from "./Pantalla";
import css from "./Indice.module.css";

/** La columna «Enlace»: el sitio, la vista previa, la extensión o la descarga. */
const ENLACE_VIVO: Enlace["tipo"][] = ["sitio", "vista-previa", "tienda", "descarga"];

const iconoDe = (tipo: Enlace["tipo"]) =>
  tipo === "tienda" ? <IconoExtension /> : tipo === "descarga" ? <IconoDescarga /> : <IconoWeb />;

const rotuloDe = (tipo: Enlace["tipo"]) =>
  tipo === "tienda" ? SALA.tienda : tipo === "descarga" ? SALA.descarga : tipo === "vista-previa" ? SALA.vistaPrevia : INDICE.sitio;

/** Una celda de ícono; vacía, una raya tenue. */
function Celda({ children }: { children?: ReactNode }) {
  return <div className={css.celda}>{children ?? <span className={css.vacio} aria-hidden="true" />}</div>;
}

/**
 * EL INDICE: los nueve proyectos en una tabla, antes de recorrerlos. Cada fila
 * lleva a su sección; a la derecha, tres columnas con título (video,
 * repositorio y enlace: el sitio, la vista previa, la extensión o la descarga),
 * cada una con un ícono sutil. Donde un proyecto no tiene algo, una raya.
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
        <div className={`${css.fila} ${css.titulos}`} aria-hidden="true">
          <span className={css.tituloProyecto}>{INDICE.proyecto[lang]}</span>
          <span>{INDICE.video[lang]}</span>
          <span>{INDICE.repositorio[lang]}</span>
          <span>{INDICE.enlace[lang]}</span>
        </div>
        <ol className={css.lista}>
          {PROYECTOS.map((p) => {
            const repo = p.enlaces.find((e) => e.tipo === "repositorio");
            const vivo = p.enlaces.find((e) => ENLACE_VIVO.includes(e.tipo));
            return (
              <li key={p.slug} className={css.fila} style={{ "--tinte": SALAS[p.slug].acento } as CSSProperties}>
                <a className={css.enlace} href={`#${p.slug}`}>
                  <span className={css.punto} aria-hidden="true" />
                  <span className={css.nombre}>{p.nombre}</span>
                </a>
                <Celda>{p.video ? <BotonVideo slug={p.slug} nombre={p.nombre} video={p.video} lang={lang} conTexto={false} clase={css.icono} /> : undefined}</Celda>
                <Celda>
                  {repo ? (
                    <a className={css.icono} href={repo.href} target="_blank" rel="noopener noreferrer" title={SALA.repositorio[lang]}>
                      <IconoGithub lado={16} />
                      <span className="sr">
                        {SALA.repositorio[lang]}: {p.nombre}
                      </span>
                    </a>
                  ) : undefined}
                </Celda>
                <Celda>
                  {vivo ? (
                    <a className={css.icono} href={lang === "en" && vivo.hrefEn ? vivo.hrefEn : vivo.href} target="_blank" rel="noopener noreferrer" title={rotuloDe(vivo.tipo)[lang]}>
                      {iconoDe(vivo.tipo)}
                      <span className="sr">
                        {rotuloDe(vivo.tipo)[lang]}: {p.nombre}
                      </span>
                    </a>
                  ) : undefined}
                </Celda>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
