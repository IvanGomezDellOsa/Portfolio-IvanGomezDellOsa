import type { CSSProperties, ReactNode } from "react";
import { SALAS, variablesDe, type SalaId } from "@/contenido/salas";
import { SALA } from "@/contenido/sitio";
import type { Idioma, PrimeraVersion, Proyecto } from "@/contenido/tipos";
import { caso } from "@/lib/rutas";
import { Enlaces, Imagen, Medicion, Navegador, Stack } from "./Piezas";
import { Texto } from "./Texto";
import css from "./Sala.module.css";

/** Las variables del proyecto más el fondo del anterior, para el paso entre los dos. */
export const estiloSala = (id: SalaId, previa: SalaId) => ({ ...variablesDe(id), "--previo": SALAS[previa].fondo }) as CSSProperties;

/** Lo que el botón de video de un proyecto necesita, si tiene video. */
export const videoDe = (p: Proyecto) => (p.video ? { slug: p.slug, nombre: p.nombre, video: p.video } : undefined);

/** La línea de arriba de un proyecto: su marca, de dónde viene, cuándo y qué es. */
export function EtiquetaSala({ p, lang, i = 0 }: { p: Proyecto; lang: Idioma; i?: number }) {
  return (
    <p className={`etiqueta ${css.etiquetaSala} aparece`} style={{ "--i": i } as CSSProperties}>
      <img className={css.marca} src={p.marca} alt="" width={28} height={28} />
      <span>
        {p.origen[lang]} · {p.periodo[lang]} · {p.area[lang]}
      </span>
    </p>
  );
}

/**
 * UN PROYECTO. La misma estructura para los nueve, porque quien recorre el
 * sitio aprende dónde está cada cosa en el primero: nombre → descripción
 * aprobada y dato medido → el material (el video, grande) → el detalle, el
 * stack y los enlaces. Lo que cambia es el tinte (`salas.ts`) y el material.
 *
 * Cada bloque se revela por su cuenta cuando entra en pantalla (no hay
 * revelados anidados: el estado de un bloque nunca pisa el de otro).
 */
export function Sala({ p, lang, previa, visual }: { p: Proyecto; lang: Idioma; previa: SalaId; visual: ReactNode }) {
  return (
    <section id={p.slug} className={css.sala} data-sala-id={p.slug} style={estiloSala(p.slug, previa)} aria-labelledby={`t-${p.slug}`}>
      <div className={css.umbral} aria-hidden="true" />
      <div className={css.interior}>
        <header className={css.cabecera} data-revelar="">
          <EtiquetaSala p={p} lang={lang} />
          <h2 id={`t-${p.slug}`} className={`${css.titulo} aparece`} style={{ "--i": 1 } as CSSProperties}>
            {p.nombre}
          </h2>
          {p.subtitulo && (
            <p className={`${css.subtitulo} aparece`} style={{ "--i": 2 } as CSSProperties}>
              {p.subtitulo[lang]}
            </p>
          )}
        </header>

        <div className={css.apertura} data-revelar="">
          <p className={`${css.resumen} texto aparece`}>
            <Texto t={p.resumen[lang]} />
          </p>
          {p.dato && (
            <div className={css.dato}>
              <Medicion dato={p.dato} lang={lang} i={2} />
            </div>
          )}
        </div>

        <div className={css.visual}>{visual}</div>

        <div className={css.detalle} data-revelar="">
          <div className={`${css.cuerpo} texto aparece`}>
            {p.cuerpo[lang].map((t, n) => (
              <p key={n}>
                <Texto t={t} />
              </p>
            ))}
          </div>
          <div className={css.lateral}>
            <Stack items={p.stack} lang={lang} i={1} />
            <Enlaces enlaces={p.enlaces} lang={lang} caso={caso(lang, p.slug)} video={videoDe(p)} i={2} />
          </div>
        </div>

        {p.primeraVersion && <BloquePrimeraVersion pv={p.primeraVersion} lang={lang} />}
      </div>
    </section>
  );
}

/**
 * LA PRIMERA VERSION, dentro de su sucesor y con su año. Muestra la evolución
 * (FaceHunt 2025 → FaceHunt 2; el sitio 2023 → el de 2026), y va más chica: es
 * contexto, no otro proyecto.
 */
export function BloquePrimeraVersion({ pv, lang }: { pv: PrimeraVersion; lang: Idioma }) {
  return (
    <aside className={css.primera} data-revelar="" aria-label={`${SALA.primeraVersion[lang]}: ${pv.nombre}`}>
      <hr className="pelo" />
      <div className={css.primeraGrilla}>
        {pv.imagen && (
          <div className={`${css.primeraImagen} aparece`}>
            <Navegador url={pv.nombre}>
              <Imagen
                src={pv.imagen.src[lang]}
                alt={pv.imagen.alt[lang]}
                ancho={pv.imagen.ancho}
                alto={pv.imagen.alto}
                anchos={pv.imagen.anchos}
                tam="(max-width: 900px) 100vw, 34vw"
              />
            </Navegador>
          </div>
        )}
        <div className={`${css.primeraTexto} aparece`} style={{ "--i": 1 } as CSSProperties}>
          <p className="etiqueta">
            {SALA.primeraVersion[lang]} · {pv.periodo[lang]}
          </p>
          <h3 className={css.primeraNombre}>{pv.nombre}</h3>
          <p className="texto">
            <Texto t={pv.texto[lang]} />
          </p>
          <ul className={css.primeraStack}>
            {pv.stack.map((s) => (
              <li key={s} className="maquina">
                {s}
              </li>
            ))}
          </ul>
          <Enlaces enlaces={pv.enlaces} lang={lang} sinPastilla />
        </div>
      </div>
    </aside>
  );
}
