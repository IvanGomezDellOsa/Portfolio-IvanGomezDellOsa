"use client";

import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { CV_OPCIONES, NAV } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./MenuCV.module.css";

/**
 * EL BOTON «CV», CON SUS DOS IDIOMAS. En cualquiera de las dos versiones del
 * sitio ofrece los dos documentos: el CV en español y el resume en inglés,
 * cada uno nombrado en su idioma. Es un desplegable de enlaces (el patrón de
 * «disclosure»): se abre con clic o teclado, se cierra con Esc, con un clic
 * afuera o al elegir.
 */
export function MenuCV({ lang, variante = "barra" }: { lang: Idioma; variante?: "barra" | "hero" }) {
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const primero = useRef<HTMLAnchorElement>(null);
  const id = useId();

  useEffect(() => {
    if (!abierto) return;
    const afuera = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
      }
    };
    const foco = (e: FocusEvent) => {
      if (e.relatedTarget && !raiz.current?.contains(e.relatedTarget as Node)) setAbierto(false);
    };
    const r = raiz.current;
    document.addEventListener("pointerdown", afuera);
    document.addEventListener("keydown", tecla);
    r?.addEventListener("focusout", foco);
    return () => {
      document.removeEventListener("pointerdown", afuera);
      document.removeEventListener("keydown", tecla);
      r?.removeEventListener("focusout", foco);
    };
  }, [abierto]);

  const alternar = (e: MouseEvent<HTMLButtonElement>) => {
    const abrir = !abierto;
    setAbierto(abrir);
    // Abierto con el teclado (un clic sin puntero): el foco pasa a la primera opción.
    if (abrir && e.detail === 0) requestAnimationFrame(() => primero.current?.focus());
  };

  return (
    <div ref={raiz} className={`${css.menu} ${variante === "hero" ? css.hero : css.barra}`}>
      <button
        ref={boton}
        type="button"
        className={variante === "hero" ? "pastilla hueca" : css.boton}
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={NAV.cvMenu[lang]}
        onClick={alternar}
      >
        {NAV.cv[lang]}
        <svg className={css.chevron} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 3.8 5 6.8l3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <ul id={id} className={css.lista} hidden={!abierto}>
        {CV_OPCIONES.map((o, i) => (
          <li key={o.lang}>
            <a
              ref={i === 0 ? primero : undefined}
              className={css.opcion}
              href={o.href}
              target="_blank"
              rel="noopener"
              hrefLang={o.lang}
              onClick={() => setAbierto(false)}
            >
              <span className={css.idioma} lang={o.lang}>
                {o.idioma}
              </span>
              <span className={`${css.documento} maquina`} lang={o.lang}>
                {o.documento} · PDF
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
