"use client";

import { useEffect, useState } from "react";
import { HERO } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./Arriba.module.css";

/**
 * VOLVER ARRIBA: una flecha sutil abajo a la derecha. Aparece recién después de
 * la primera pantalla (en el hero no hace falta) y lleva al principio.
 */
export function Arriba({ lang }: { lang: Idioma }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mirar = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    mirar();
    window.addEventListener("scroll", mirar, { passive: true });
    return () => window.removeEventListener("scroll", mirar);
  }, []);

  return (
    <a className={css.arriba} href="#inicio" aria-label={HERO.arriba[lang]} data-visible={visible || undefined} tabIndex={visible ? 0 : -1}>
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 14.5 12 8.5 18 14.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
