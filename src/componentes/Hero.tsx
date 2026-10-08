import { GITHUB, HERO, LINKEDIN, NOMBRE } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import type { Funcion, ItemVitrina } from "@/lib/videos";
import { IconoGithub, IconoLinkedin } from "./Iconos";
import { MenuCV } from "./MenuCV";
import { Telas } from "./Telas";
import css from "./Hero.module.css";

const REDES = [
  { nombre: "GitHub", href: GITHUB, Icono: IconoGithub },
  { nombre: "LinkedIn", href: LINKEDIN, Icono: IconoLinkedin },
];

/**
 * EL HERO: el nombre y el puesto, y nada más que diga lo mismo con otras
 * palabras. Debajo, lo que se puede hacer (ver los proyectos, bajar el CV en
 * cualquiera de los dos idiomas, las redes) y las telas: los nueve proyectos
 * colgados de un hilo, cada uno con un fragmento de su video o de su página.
 *
 * La entrada es una sola y corta (el nombre, el puesto, las acciones, las
 * telas, en ese orden), en CSS puro.
 */
export function Hero({ lang, funciones, vitrina }: { lang: Idioma; funciones: Funcion[]; vitrina: ItemVitrina[] }) {
  return (
    <section id="inicio" className={css.hero} data-sala-id="taller" aria-labelledby="t-inicio">
      <div className={css.fondo} aria-hidden="true" />
      <div className={css.contenido}>
        <h1 id="t-inicio" className={css.nombre}>
          {NOMBRE}
        </h1>
        <p className={css.rol}>{HERO.rol[lang]}</p>
        <div className={css.acciones}>
          <a className="pastilla" href="#proyectos">
            {HERO.verProyectos[lang]}
          </a>
          <MenuCV lang={lang} variante="hero" />
          <ul className={css.redes}>
            {REDES.map(({ nombre, href, Icono }) => (
              <li key={nombre}>
                <a className={css.red} href={href} target="_blank" rel="noopener noreferrer" aria-label={nombre}>
                  <Icono />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={css.telas}>
        <Telas lang={lang} items={vitrina} funciones={funciones} />
      </div>
    </section>
  );
}
