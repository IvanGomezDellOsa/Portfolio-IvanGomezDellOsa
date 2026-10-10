import type { CSSProperties } from "react";
import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS, variablesDe, type SalaId } from "@/contenido/salas";
import { CONTACTO, EMAIL, EXPERIENCIA, GITHUB, LINKEDIN, PERSONA } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { caso } from "@/lib/rutas";
import { CopiarEmail } from "./CopiarEmail";
import { IconoGithub, IconoLinkedin } from "./Iconos";
import { MenuCV } from "./MenuCV";
import { Texto } from "./Texto";
import css from "./Galeria.module.css";
import hero from "./Hero.module.css";

const nombreDe = (slug: SalaId) => PROYECTOS.find((p) => p.slug === slug)?.nombre ?? slug;

const REDES = [
  { nombre: "GitHub", href: GITHUB, Icono: IconoGithub },
  { nombre: "LinkedIn", href: LINKEDIN, Icono: IconoLinkedin },
];

/**
 * LA PERSONA, después de la lista de proyectos: sobre mí, experiencia y
 * contacto. En el mismo negro neutro del hero, y con sus mismas piezas: los
 * títulos de sección de la lista y, en el contacto, el nombre de la sección con
 * el degradé del hero, el email que se copia y los íconos de las redes.
 */
export function Galeria({ lang }: { lang: Idioma }) {
  return (
    <div className={css.galeria} data-sala-id="galeria" style={{ ...variablesDe("galeria"), "--previo": SALAS[PROYECTOS[PROYECTOS.length - 1]!.slug].fondo } as CSSProperties}>
      <div className={css.umbral} aria-hidden="true" />
      <section id="sobre-mi" className={css.interior} aria-labelledby="t-sobre-mi">
        <div className={css.persona} data-revelar="">
          <figure className={`${css.foto} aparece`}>
            <img
              src="/medios/persona/foto-900.webp"
              srcSet="/medios/persona/foto-480.webp 480w, /medios/persona/foto-900.webp 900w"
              sizes="260px"
              alt={PERSONA.fotoAlt[lang]}
              width={900}
              height={994}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className={css.sobre}>
            <h2 id="t-sobre-mi" className={`${css.titulo} aparece`} style={{ "--i": 1 } as CSSProperties}>
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
        <div data-revelar="">
          <h2 id="t-experiencia" className={`${css.titulo} aparece`}>
            {EXPERIENCIA.titulo[lang]}
          </h2>
          <ol className={css.experiencia}>
            {EXPERIENCIA.items.map((x, i) => (
              <li key={x.empresa} className={`${css.puesto} aparece`} style={{ "--i": i + 1 } as CSSProperties}>
                <div className={css.donde}>
                  <h3 className={css.empresa}>{x.empresa}</h3>
                  <p className={css.descripcionEmpresa}>{x.descripcion[lang]}</p>
                </div>
                <div className={css.puestoCuerpo}>
                  {/* Cada cargo con su período al lado: no hay que adivinar cuál es de cuál. */}
                  <ul className={css.cargos}>
                    {x.puestos.map((pu) => (
                      <li key={pu.cargo.es}>
                        <span className={css.cargo}>{pu.cargo[lang]}</span>
                        <span className={`${css.periodo} maquina`}>{pu.periodo[lang]}</span>
                      </li>
                    ))}
                  </ul>
                  <ul className={`${css.logros} texto`}>
                    {x.logros[lang].map((t, n) => (
                      <li key={n}>
                        <Texto t={t} />
                      </li>
                    ))}
                  </ul>
                  <p className={css.proyectosPuesto}>
                    {x.salas.map((s) => (
                      <a key={s} href={caso(lang, s)} className={css.enlaceProyecto} style={{ "--tinte": SALAS[s].acento } as CSSProperties}>
                        <span className={css.punto} aria-hidden="true" />
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

      <section id="contacto" className={css.contacto} aria-labelledby="t-contacto">
        <div className={css.fondoContacto} aria-hidden="true" />
        <div className={css.contactoContenido} data-revelar="">
          <h2 id="t-contacto" className={`${css.tituloContacto} aparece`}>
            <span className="degrade">{CONTACTO.titulo[lang]}</span>
          </h2>
          <div className="aparece" style={{ "--i": 1 } as CSSProperties}>
            <CopiarEmail email={EMAIL} lang={lang} />
          </div>
          <div className={`${hero.acciones} aparece`} style={{ "--i": 2 } as CSSProperties}>
            <ul className={hero.redes}>
              {REDES.map(({ nombre, href, Icono }) => (
                <li key={nombre}>
                  <a className={hero.red} href={href} target="_blank" rel="noopener noreferrer" aria-label={nombre} data-pista={nombre}>
                    <Icono />
                  </a>
                </li>
              ))}
              <li>
                <MenuCV lang={lang} variante="icono" />
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
