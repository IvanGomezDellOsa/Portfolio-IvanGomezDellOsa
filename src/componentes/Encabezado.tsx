"use client";

import { useEffect, useState } from "react";
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
 */
export function Encabezado({ lang, rutaOtra }: { lang: Idioma; rutaOtra: string }) {
  const [conFondo, setConFondo] = useState(false);

  useEffect(() => {
    const medir = () => setConFondo(window.scrollY > 24);
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  const ancla = (id: string) => `#${id}`;

  return (
    <header className={css.barra} data-con-fondo={conFondo}>
      <a className="saltar" href="#contenido">
        {NAV.saltar[lang]}
      </a>
      <a className={css.firma} href="#inicio" aria-label={`${NOMBRE}, ${NAV.inicio[lang]}`}>
        {NOMBRE}
      </a>
      <nav className={css.navegacion} aria-label={lang === "es" ? "Principal" : "Main"}>
        <a className={css.enlace} href={ancla("vitrina")}>
          {NAV.proyectos[lang]}
        </a>
        <a className={css.enlace} href={ancla("sobre-mi")}>
          {NAV.sobreMi[lang]}
        </a>
        {/* Prueba: «Contacto» vuelve al hero y señala los íconos (`lib/contacto.ts`). Sin JavaScript, baja a la sección. */}
        <a
          className={css.enlace}
          href={ancla("contacto")}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            void senalarContacto(e.currentTarget);
          }}
        >
          {NAV.contacto[lang]}
        </a>
        <MenuCV lang={lang} />
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
      </nav>
    </header>
  );
}
