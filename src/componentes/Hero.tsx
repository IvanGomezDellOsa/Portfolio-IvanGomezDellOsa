import { GITHUB, HERO, LINKEDIN, NOMBRE } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import type { Funcion, ItemVitrina } from "@/lib/videos";
import { IconoGithub, IconoLinkedin } from "./Iconos";
import { MailHero } from "./MailHero";
import { MenuCV } from "./MenuCV";
import { Retrato } from "./Retrato";
import { Telas } from "./Telas";
import css from "./Hero.module.css";

const REDES = [
  { nombre: "GitHub", href: GITHUB, Icono: IconoGithub },
  { nombre: "LinkedIn", href: LINKEDIN, Icono: IconoLinkedin },
];

/**
 * EL HERO: el retrato (que mira el cursor), el nombre y el puesto, y nada más
 * que diga lo mismo con otras palabras. Debajo, lo que se puede hacer (ver los
 * proyectos, bajar el CV en cualquiera de los dos idiomas, las redes). Ocupa la
 * primera pantalla entera; las telas (los nueve proyectos colgados de un hilo)
 * tienen la suya, justo después.
 *
 * La entrada es una sola y corta (el retrato, el nombre, el puesto, las
 * acciones, en ese orden), en CSS puro.
 */
export function Hero({ lang, funciones, vitrina }: { lang: Idioma; funciones: Funcion[]; vitrina: ItemVitrina[] }) {
  return (
    <>
      <section id="inicio" className={css.hero} data-sala-id="taller" aria-labelledby="t-inicio">
        <div className={css.fondo} aria-hidden="true" />
        <div className={css.contenido}>
          <Retrato className={css.foto} />
          <h1 id="t-inicio" className={css.nombre}>
            {NOMBRE}
          </h1>
          <p className={css.rol}>{HERO.rol[lang]}</p>
          <div className={css.acciones}>
            <a className="pastilla" href="#vitrina">
              {HERO.verProyectos[lang]}
            </a>
            <ul className={css.redes}>
              {REDES.map(({ nombre, href, Icono }) => (
                <li key={nombre}>
                  <a className={css.red} href={href} target="_blank" rel="noopener noreferrer" aria-label={nombre} data-pista={nombre}>
                    <Icono />
                  </a>
                </li>
              ))}
              <li>
                <MailHero lang={lang} />
              </li>
              <li>
                <MenuCV lang={lang} variante="icono" />
              </li>
            </ul>
          </div>
        </div>
        {/* La invitación a bajar: una flecha que late, abajo de todo. */}
        <a className={css.bajar} href="#vitrina" aria-label={HERO.bajar[lang]}>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9.5 12 15.5 18 9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>
      <section id="vitrina" className={css.pantallaTelas} data-sala-id="taller" aria-label={HERO.reel[lang]}>
        <Telas lang={lang} items={vitrina} funciones={funciones} />
        <a className={`${css.bajar} ${css.bajarRotulado}`} href="#proyectos">
          <span className={css.rotuloBajar}>{HERO.lista[lang]}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9.5 12 15.5 18 9.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>
    </>
  );
}
