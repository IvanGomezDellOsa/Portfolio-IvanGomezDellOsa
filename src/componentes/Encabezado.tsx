"use client";

import { useEffect, useId, useRef, useState } from "react";
import { NAV, NOMBRE } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { senalarContacto } from "@/lib/contacto";
import { MenuCV } from "./MenuCV";
import css from "./Encabezado.module.css";

/**
 * LOS ENLACES ENTRE PAGINAS SON `<a>` COMUNES, no `next/link`: el sitio es
 * estático y cada página es un HTML completo. Con `Link`, el prefetch de Next
 * 16 pide segmentos RSC con un nombre que la exportación estática escribe en
 * otra ruta, y cualquier hosting estático los responde con 404.
 *
 * LA BARRA. Transparente sobre el hero; al bajar se vuelve vidrio oscuro con
 * el tinte del proyecto en el que se está (ver `ObservadorSalas`). En la
 * portada los enlaces son anclas; en un caso, vuelven a la portada con el
 * ancla. Todo es texto, sin cajas: los enlaces, «CV» (que abre la vista
 * previa) y, al final, el idioma.
 *
 * EN EL TELEFONO la barra muestra sólo el botón del menú, sin el nombre (ya
 * está, grande, en el hero). Todo lo demás va adentro del menú, que se
 * despliega en la misma barra: Proyectos, Sobre mí, «CV», Contacto y, un poco
 * apartado, el idioma. Se cierra al elegir, con Esc o al tocar afuera.
 */
export function Encabezado({ lang, rutaOtra }: { lang: Idioma; rutaOtra: string }) {
  const [conFondo, setConFondo] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const barra = useRef<HTMLElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const idNav = useId();

  useEffect(() => {
    const medir = () => setConFondo(window.scrollY > 24);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const afuera = (e: PointerEvent) => {
      if (!barra.current?.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    };
    document.addEventListener("pointerdown", afuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", afuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  const ancla = (id: string) => `#${id}`;

  return (
    <header ref={barra} className={css.barra} data-con-fondo={conFondo} data-abierto={abierto || undefined}>
      <a className="saltar" href="#contenido">
        {NAV.saltar[lang]}
      </a>
      <a className={css.firma} href="#inicio" aria-label={`${NOMBRE}, ${NAV.inicio[lang]}`} onClick={() => setAbierto(false)}>
        {NOMBRE}
      </a>
      <div className={css.derecha}>
        {/* Cualquier clic adentro (un enlace o «CV») cierra el menú del teléfono. */}
        <nav id={idNav} className={css.navegacion} aria-label={lang === "es" ? "Principal" : "Main"} onClick={() => setAbierto(false)}>
          <div className={css.enlaces}>
            <a className={css.enlace} href={ancla("vitrina")}>
              {NAV.proyectos[lang]}
            </a>
            <a className={css.enlace} href={ancla("sobre-mi")}>
              {NAV.sobreMi[lang]}
            </a>
            {/* Prueba: «Contacto» vuelve al hero y señala los íconos (`lib/contacto.ts`). Sin JavaScript, baja a la sección. */}
            <a
              className={`${css.enlace} ${css.contacto}`}
              href={ancla("contacto")}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                // Con el menú abierto el enlace está por plegarse: el anillo sale del botón.
                void senalarContacto((abierto && boton.current) || e.currentTarget);
              }}
            >
              {NAV.contacto[lang]}
            </a>
            <div className={css.filaCV}>
              <MenuCV lang={lang} />
            </div>
            <div className={css.idiomas} role="group" aria-label={NAV.idioma[lang]}>
              {(["es", "en"] as const).map((l) =>
                l === lang ? (
                  <span key={l} className={css.idioma} aria-current="true" lang={l}>
                    {l.toUpperCase()}
                  </span>
                ) : (
                  <a key={l} className={css.idioma} href={rutaOtra} hrefLang={l} lang={l}>
                    {l.toUpperCase()}
                  </a>
                ),
              )}
            </div>
          </div>
        </nav>
        <button ref={boton} type="button" className={css.menu} aria-label={NAV.menu[lang]} aria-expanded={abierto} aria-controls={idNav} onClick={() => setAbierto((a) => !a)}>
          <span className={css.rayas} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
