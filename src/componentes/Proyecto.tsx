import type { CSSProperties } from "react";
import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS, variablesDe } from "@/contenido/salas";
import { SALA } from "@/contenido/sitio";
import type { Bloque, Idioma, PrimeraVersion, Proyecto as DatosProyecto } from "@/contenido/tipos";
import { caso } from "@/lib/rutas";
import { CasoCompleto } from "./CasoCompleto";
import { EspacioVectorial } from "./EspacioVectorial";
import { Barras, Capas, Cobertura, Sistema } from "./Graficos";
import { GrillaSemanas } from "./GrillaSemanas";
import { Kiosco } from "./Kiosco";
import { Pantalla } from "./Pantalla";
import { EN_VIVO, Enlaces, Imagen, Medicion, Stack, Telefono } from "./Piezas";
import { Texto } from "./Texto";
import css from "./Proyecto.module.css";

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
  }
}

/** La línea de arriba de un proyecto: su marca (la de su tela), de dónde viene, cuándo y qué es. */
function Etiqueta({ p, lang }: { p: DatosProyecto; lang: Idioma }) {
  return (
    <p className={`etiqueta ${css.etiqueta}`}>
      <img className={css.marca} src={p.marca} alt="" width={32} height={32} />
      <span>
        {p.origen[lang]} · {p.periodo[lang]} · {p.area[lang]}
      </span>
    </p>
  );
}

/**
 * LA PRIMERA VERSION, dentro de su sucesor y con su año. Muestra la evolución
 * (FaceHunt 2025 → FaceHunt 2; el sitio 2023 → el de 2026), y va más chica: es
 * contexto, no otro proyecto.
 */
function BloquePrimeraVersion({ pv, lang }: { pv: PrimeraVersion; lang: Idioma }) {
  return (
    <section className={css.seccion} aria-label={`${SALA.primeraVersion[lang]}: ${pv.nombre}`}>
      <h2 className={css.tituloSeccion}>{SALA.primeraVersion[lang]}</h2>
      <div className={css.primera}>
        {pv.imagen && (
          <div className={css.imagen}>
            <Imagen
              src={pv.imagen.src[lang]}
              alt={pv.imagen.alt[lang]}
              ancho={pv.imagen.ancho}
              alto={pv.imagen.alto}
              anchos={pv.imagen.anchos}
              tam="(max-width: 900px) 100vw, 34vw"
            />
          </div>
        )}
        <div className={css.primeraTexto}>
          <h3 className={css.primeraNombre}>
            {pv.nombre} <span className={`${css.primeraPeriodo} maquina`}>{pv.periodo[lang]}</span>
          </h3>
          <p className="texto">
            <Texto t={pv.texto[lang]} />
          </p>
          <Stack items={pv.stack} lang={lang} sinRotulo />
          <Enlaces enlaces={pv.enlaces} lang={lang} />
        </div>
      </div>
    </section>
  );
}

/**
 * LA PAGINA DE UN PROYECTO: el único lugar donde se lo presenta. La misma
 * estructura para los nueve, porque quien entra a uno ya sabe leer los demás:
 *
 *   1. Qué es: su marca, el nombre y la descripción reducida, con sus enlaces.
 *   2. EL VIDEO, a todo el ancho: es la mejor presentación de cada proyecto, y
 *      por eso es lo que más lugar ocupa. Los dos sitios web muestran el
 *      recorrido de su página.
 *   3. La descripción ampliada, el dato medido y el stack.
 *   4. El caso completo (arquitectura, decisiones, resultados), a pedido.
 *
 * Lo que cambia entre proyectos es el tinte (`salas.ts`) y el contenido.
 */
export function Proyecto({ p, lang }: { p: DatosProyecto; lang: Idioma }) {
  const i = PROYECTOS.findIndex((x) => x.slug === p.slug);
  const anterior = PROYECTOS[(i - 1 + PROYECTOS.length) % PROYECTOS.length]!;
  const siguiente = PROYECTOS[(i + 1) % PROYECTOS.length]!;
  const vivo = p.enlaces.find((e) => EN_VIVO.has(e.tipo));

  return (
    <article className={css.proyecto} data-sala-id={p.slug} style={variablesDe(p.slug)}>
      <header className={css.cabecera}>
        <div className={css.presentacion}>
          <Etiqueta p={p} lang={lang} />
          <h1 className={css.titulo}>
            <span className="degrade">{p.nombre}</span>
          </h1>
          <p className={`${css.resumen} texto`}>
            <Texto t={p.resumen[lang]} />
          </p>
        </div>
        <Enlaces enlaces={p.enlaces} lang={lang} className={css.enlaces} />
      </header>

      <div className={css.pantalla}>
        <Pantalla
          slug={p.slug}
          nombre={p.nombre}
          video={p.video}
          sitio={vivo ? { href: lang === "en" && vivo.hrefEn ? vivo.hrefEn : vivo.href, tipo: vivo.tipo } : undefined}
          lang={lang}
        />
      </div>

      <section className={css.ficha} data-revelar="" aria-label={SALA.descripcion[lang]}>
        <div className={`${css.descripcion} texto aparece`}>
          {p.cuerpo[lang].map((t, n) => (
            <p key={n}>
              <Texto t={t} />
            </p>
          ))}
        </div>
        <div className={css.lateral}>
          {p.dato && <Medicion dato={p.dato} lang={lang} i={1} />}
          <Stack items={p.stack} lang={lang} i={2} />
        </div>
      </section>

      <CasoCompleto abrir={SALA.verCaso[lang]} cerrar={SALA.ocultarCaso[lang]} nombre={p.nombre}>
        <div className={css.caso}>
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
          {p.primeraVersion && <BloquePrimeraVersion pv={p.primeraVersion} lang={lang} />}
        </div>
      </CasoCompleto>

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
