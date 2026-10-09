import type { CSSProperties } from "react";
import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS, type SalaId } from "@/contenido/salas";
import { CONTACTO, EMAIL, EXPERIENCIA, GITHUB, LINKEDIN, PERSONA, STACK } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { CopiarEmail } from "./CopiarEmail";
import { MenuCV } from "./MenuCV";
import { estiloSala } from "./Sala";
import { Texto } from "./Texto";
import css from "./Galeria.module.css";

type SalaProyecto = Exclude<SalaId, "taller" | "galeria">;
const nombreDe = (slug: SalaId) => PROYECTOS.find((p) => p.slug === slug)?.nombre ?? slug;

/** El punto del proyecto, en su acento: el mismo del índice. */
function Punto({ slug }: { slug: SalaProyecto }) {
  return <span className={css.punto} style={{ "--tinte": SALAS[slug].acento } as CSSProperties} aria-hidden="true" />;
}

/**
 * LA PERSONA. Es la salida del recorrido, otra vez en negro neutro: después
 * de ver el trabajo, quién lo hizo. Sobre mí, experiencia, el stack con su
 * evidencia y el contacto.
 */
export function Galeria({ lang }: { lang: Idioma }) {
  const salas = PROYECTOS.map((p) => p.slug as SalaProyecto);
  return (
    <div className={css.galeria} data-sala-id="galeria" style={estiloSala("galeria", "freemagicmirror")}>
      <div className={css.umbral} aria-hidden="true" />

      <section id="sobre-mi" className={css.interior} aria-labelledby="t-sobre-mi">
        <div className={css.persona} data-revelar="">
          <figure className={`${css.foto} aparece`}>
            <img
              src="/medios/persona/foto-900.webp"
              srcSet="/medios/persona/foto-480.webp 480w, /medios/persona/foto-900.webp 900w"
              sizes="(max-width: 900px) 70vw, 30vw"
              alt={PERSONA.fotoAlt[lang]}
              width={900}
              height={994}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className={css.sobre}>
            <h2 id="t-sobre-mi" className={`${css.tituloGaleria} aparece`} style={{ "--i": 1 } as CSSProperties}>
              {PERSONA.titulo[lang]}
            </h2>
            <div className={`${css.parrafos} texto aparece`} style={{ "--i": 2 } as CSSProperties}>
              {PERSONA.parrafos[lang].map((t, n) => (
                <p key={n}>
                  <Texto t={t} />
                </p>
              ))}
            </div>
            <dl className={`${css.detalles} aparece`} style={{ "--i": 3 } as CSSProperties}>
              {PERSONA.detalles.map((d) => (
                <div key={d.clave.es}>
                  <dt className="etiqueta">{d.clave[lang]}</dt>
                  <dd>{d.valor[lang]}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className={css.interior} aria-labelledby="t-experiencia">
        <div className={css.bloque} data-revelar="">
          <h2 id="t-experiencia" className={`${css.tituloGaleria} aparece`}>
            {EXPERIENCIA.titulo[lang]}
          </h2>
          <ol className={css.experiencia}>
            {EXPERIENCIA.items.map((x, i) => (
              <li key={x.empresa} className={`${css.puesto} aparece`} style={{ "--i": i + 1 } as CSSProperties}>
                <div className={css.periodos}>
                  {x.puestos.map((pu) => (
                    <p key={pu.cargo.es} className="maquina">
                      {pu.periodo[lang]}
                    </p>
                  ))}
                </div>
                <div className={css.puestoCuerpo}>
                  <h3 className={css.empresa}>{x.empresa}</h3>
                  <p className={css.descripcionEmpresa}>{x.descripcion[lang]}</p>
                  <ul className={css.cargos}>
                    {x.puestos.map((pu) => (
                      <li key={pu.cargo.es}>{pu.cargo[lang]}</li>
                    ))}
                  </ul>
                  <ul className={`${css.logros} texto`}>
                    {x.logros[lang].map((t, n) => (
                      <li key={n}>
                        <Texto t={t} />
                      </li>
                    ))}
                  </ul>
                  <p className={css.salasPuesto}>
                    {x.salas.map((s) => (
                      <a key={s} href={`#${s}`} className={css.enlaceSala}>
                        <Punto slug={s as SalaProyecto} />
                        {nombreDe(s)}
                      </a>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={css.interior} aria-labelledby="t-stack">
        <div className={css.bloque} data-revelar="">
          <h2 id="t-stack" className={`${css.tituloGaleria} aparece`}>
            {STACK.titulo[lang]}
          </h2>
          <p className={`${css.introStack} aparece`} style={{ "--i": 1 } as CSSProperties}>
            {STACK.intro[lang]}
          </p>

          <ol className={`${css.leyenda} aparece`} style={{ "--i": 2 } as CSSProperties} aria-hidden="true">
            {salas.map((s, n) => (
              <li key={s}>
                <span className={`${css.numeroLeyenda} maquina`}>{n + 1}</span>
                <Punto slug={s} />
                {nombreDe(s)}
              </li>
            ))}
          </ol>

          <div className={css.grupos}>
            {STACK.grupos.map((g, gi) => (
              <div key={g.titulo.es} className={`${css.grupo} aparece`} style={{ "--i": gi + 3 } as CSSProperties}>
                <table className={css.matriz}>
                  <caption className="etiqueta">{g.titulo[lang]}</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="sr">
                        {lang === "es" ? "Tecnología" : "Technology"}
                      </th>
                      {salas.map((s, n) => (
                        <th key={s} scope="col" title={nombreDe(s)}>
                          <span className="maquina" aria-hidden="true">
                            {n + 1}
                          </span>
                          <span className="sr">{nombreDe(s)}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {g.tecnologias.map((tec) => (
                      <tr key={tec.nombre.es}>
                        <th scope="row">
                          {tec.nombre[lang]}

                        </th>
                        {salas.map((s) => {
                          const usada = tec.salas.includes(s);
                          return (
                            <td key={s}>
                              <span className={usada ? css.usada : css.vacia} style={usada ? ({ "--tinte": SALAS[s].acento } as CSSProperties) : undefined} />
                              {usada && <span className="sr">{nombreDe(s)}</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* En teléfono, la misma evidencia en palabras: la matriz no entra. */}
                <dl className={css.listaStack}>
                  <dt className="etiqueta">{g.titulo[lang]}</dt>
                  {g.tecnologias.map((tec) => (
                    <dd key={tec.nombre.es}>
                      <strong>{tec.nombre[lang]}</strong>{" "}
                      <span>{tec.salas.map(nombreDe).join(" · ")}</span>
                    </dd>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className={`${css.interior} ${css.contacto}`} aria-labelledby="t-contacto">
        <div data-revelar="">
          <h2 id="t-contacto" className={`${css.tituloContacto} aparece`}>
            {CONTACTO.titulo[lang]}
          </h2>
          <div className={`${css.email} aparece`} style={{ "--i": 2 } as CSSProperties}>
            <a href={`mailto:${EMAIL}`} className={`${css.direccion} maquina`}>
              {EMAIL}
            </a>
            <CopiarEmail email={EMAIL} lang={lang} />
          </div>
          <div className={`${css.canales} aparece`} style={{ "--i": 3 } as CSSProperties}>
            <a className="pastilla" href={`mailto:${EMAIL}`}>
              {CONTACTO.escribir[lang]}
            </a>
            <a className="enlace-linea" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
            <a className="enlace-linea" href={GITHUB} target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <MenuCV lang={lang} variante="pastilla" />
          </div>
        </div>
      </section>
    </div>
  );
}
