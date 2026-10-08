import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS, variablesDe } from "@/contenido/salas";
import { SALA } from "@/contenido/sitio";
import type { Bloque, Idioma, Proyecto } from "@/contenido/tipos";
import { caso, inicio } from "@/lib/rutas";
import type { CSSProperties } from "react";
import { EspacioVectorial } from "./EspacioVectorial";
import { Escenas } from "./Escenas";
import { Barras, Capas, Cobertura, Sistema } from "./Graficos";
import { GrillaSemanas } from "./GrillaSemanas";
import { Kiosco } from "./Kiosco";
import { VideoEnVista } from "./Medios";
import { Pantalla } from "./Pantalla";
import { Enlaces, Imagen, Medicion, Navegador, Stack, Telefono } from "./Piezas";
import { BloquePrimeraVersion, EtiquetaSala, videoDe } from "./Sala";
import { Texto } from "./Texto";
import css from "./Caso.module.css";

const VISUAL_BLOQUE = {
  vectores: EspacioVectorial,
  barras: Barras,
  cobertura: Cobertura,
  capas: Capas,
  sistema: Sistema,
  grilla: GrillaSemanas,
  kiosco: Kiosco,
} as const;

function RenderBloque({ b, lang }: { b: Bloque; lang: Idioma }) {
  switch (b.tipo) {
    case "parrafos":
      return (
        <div className={`${css.parrafos} texto`}>
          {b.texto[lang].map((t, n) => (
            <p key={n}>
              <Texto t={t} />
            </p>
          ))}
        </div>
      );
    case "lista":
      return (
        <ul className={`${css.lista} texto`}>
          {b.items[lang].map((t, n) => (
            <li key={n}>
              <Texto t={t} />
            </li>
          ))}
        </ul>
      );
    case "diagrama":
      return (
        <figure className={css.diagrama}>
          {/* Enfocable: en teléfono se desplaza de costado, y con teclado también tiene que poder. */}
          <pre className="maquina" tabIndex={0} aria-label={lang === "es" ? "Diagrama" : "Diagram"}>
            {b.lineas[lang].join("\n")}
          </pre>
          {b.pie && (
            <figcaption className="texto">
              <Texto t={b.pie[lang]} />
            </figcaption>
          )}
        </figure>
      );
    case "tabla":
      return (
        <figure className={css.tabla}>
          <div className={css.desplazable} tabIndex={0} role="region" aria-label={lang === "es" ? "Tabla" : "Table"}>
            <table>
              <thead>
                <tr>
                  {b.columnas[lang].map((c, n) => (
                    <th key={n} scope="col">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="texto">
                {b.filas[lang].map((fila, n) => (
                  <tr key={n}>
                    {fila.map((celda, m) =>
                      m === 0 ? (
                        <th key={m} scope="row">
                          <Texto t={celda} />
                        </th>
                      ) : (
                        <td key={m}>
                          <Texto t={celda} />
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {b.pie && (
            <figcaption className="texto">
              <Texto t={b.pie[lang]} />
            </figcaption>
          )}
        </figure>
      );
    case "imagenes":
      return (
        <figure className={css.imagenes} data-cantidad={b.imagenes.length}>
          <div className={css.grillaImagenes}>
            {b.imagenes.map((img) =>
              img.telefono ? (
                <Telefono key={img.src[lang]} className={css.telefono}>
                  <img src={img.src[lang]} alt={img.alt[lang]} width={img.ancho} height={img.alto} loading="lazy" decoding="async" />
                </Telefono>
              ) : (
                <div key={img.src[lang]} className={css.imagen}>
                  <Imagen
                    src={img.src[lang]}
                    alt={img.alt[lang]}
                    ancho={img.ancho}
                    alto={img.alto}
                    anchos={img.anchos}
                    tam={b.imagenes.length > 1 ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 900px) 100vw, 900px"}
                  />
                </div>
              ),
            )}
          </div>
          {b.pie && (
            <figcaption className="texto">
              <Texto t={b.pie[lang]} />
            </figcaption>
          )}
        </figure>
      );
    case "visual": {
      const V = VISUAL_BLOQUE[b.id];
      return (
        <div className={css.visualBloque}>
          <V lang={lang} />
        </div>
      );
    }
    case "cita":
      return (
        <blockquote className={css.cita}>
          <p className="texto">
            <Texto t={b.texto[lang]} />
          </p>
        </blockquote>
      );
  }
}

/**
 * EL MATERIAL DE LA CABECERA DEL CASO: el video del proyecto, grande, con sus
 * escenas al lado para entrar directo a cualquiera. Navkok, que es un sitio
 * sin video, muestra el video de fondo de su hero.
 */
function MediaCaso({ p, lang }: { p: Proyecto; lang: Idioma }) {
  if (p.video) {
    return (
      <div className={css.conEscenas} data-escenas={!!p.video.escenas?.length}>
        <Pantalla slug={p.slug} nombre={p.nombre} video={p.video} lang={lang} />
        <Escenas slug={p.slug} nombre={p.nombre} video={p.video} lang={lang} />
      </div>
    );
  }
  if (p.slug === "navkok-security-group") {
    return (
      <Navegador url="navkok-website-private.vercel.app">
        <VideoEnVista
          src="/medios/navkok/hero.mp4"
          poster="/medios/navkok/hero.webp"
          ancho={960}
          alto={540}
          etiqueta={lang === "es" ? "El video de fondo del hero de Navkok, producido con IA." : "The Navkok hero background video, produced with AI."}
          lang={lang}
        />
      </Navegador>
    );
  }
  return null;
}

/**
 * EL CASO COMPLETO DE UN PROYECTO. Para quien baja hasta la arquitectura: el
 * video, la historia, las funcionalidades con su porqué, cómo está hecho, el
 * stack y los resultados. Toda la página tiene el tinte del proyecto.
 */
export function Caso({ p, lang }: { p: Proyecto; lang: Idioma }) {
  const i = PROYECTOS.findIndex((x) => x.slug === p.slug);
  const anterior = PROYECTOS[(i - 1 + PROYECTOS.length) % PROYECTOS.length]!;
  const siguiente = PROYECTOS[(i + 1) % PROYECTOS.length]!;
  const tieneStack = p.caso.some((s) => s.titulo.es === "Stack");
  const media = p.video || p.slug === "navkok-security-group";

  return (
    <article className={css.caso} data-sala-id={p.slug} style={variablesDe(p.slug)}>
      <header className={css.cabecera}>
        <p className={css.migas}>
          <a className="enlace-linea" href={`${inicio(lang)}#${p.slug}`}>
            <span aria-hidden="true">←</span> {SALA.todos[lang]}
          </a>
        </p>
        <EtiquetaSala p={p} lang={lang} />
        <h1 className={css.titulo}>{p.nombre}</h1>
        {p.subtitulo && <p className={css.subtitulo}>{p.subtitulo[lang]}</p>}
        <div className={css.apertura}>
          <p className={`${css.resumen} texto`}>
            <Texto t={p.resumen[lang]} />
          </p>
          {p.dato && <Medicion dato={p.dato} lang={lang} />}
        </div>
        <Enlaces enlaces={p.enlaces} lang={lang} video={videoDe(p)} />
      </header>

      {media && (
        <div className={css.material}>
          <MediaCaso p={p} lang={lang} />
        </div>
      )}

      <div className={css.cuerpo}>
        {p.caso.map((s) => (
          <section key={s.titulo.es} className={css.seccion}>
            <h2 className={css.tituloSeccion}>{s.titulo[lang]}</h2>
            <div className={css.bloques}>
              {s.bloques.map((b, n) => (
                <RenderBloque key={n} b={b} lang={lang} />
              ))}
            </div>
          </section>
        ))}
        {/* El cierre: los enlaces, y el stack sólo si el caso no tiene su propia tabla. */}
        <section className={css.seccion}>
          <h2 className={css.tituloSeccion}>{tieneStack ? SALA.enlaces[lang] : SALA.stackYEnlaces[lang]}</h2>
          <div className={css.bloques}>
            {!tieneStack && <Stack items={p.stack} lang={lang} />}
            <Enlaces enlaces={p.enlaces} lang={lang} video={videoDe(p)} sinPastilla />
          </div>
        </section>
        {p.primeraVersion && <BloquePrimeraVersion pv={p.primeraVersion} lang={lang} />}
      </div>

      <nav className={css.pasos} aria-label={lang === "es" ? "Otros proyectos" : "Other projects"}>
        {[
          { x: anterior, rotulo: SALA.anterior[lang], flecha: "←" },
          { x: siguiente, rotulo: SALA.siguiente[lang], flecha: "→" },
        ].map(({ x, rotulo, flecha }) => (
          <a key={rotulo} href={caso(lang, x.slug)} className={css.paso} style={{ ...variablesDe(x.slug), "--tinte": SALAS[x.slug].acento } as CSSProperties}>
            <span className="etiqueta">
              {flecha === "←" && <span aria-hidden="true">← </span>}
              {rotulo}
              {flecha === "→" && <span aria-hidden="true"> →</span>}
            </span>
            <span className={css.nombrePaso}>{x.nombre}</span>
            <span className={css.areaPaso}>{x.area[lang]}</span>
          </a>
        ))}
      </nav>
    </article>
  );
}
