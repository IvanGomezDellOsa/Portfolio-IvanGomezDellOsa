"use client";

import { useEffect, useRef, useState } from "react";
import { CONTACTO, EMAIL } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { IconoCopiar, IconoListo, IconoMail } from "./Iconos";
import css from "./Hero.module.css";

/**
 * EL MAIL DEL HERO: un ícono más entre las redes que abre una ventanita con la
 * dirección y un botón (sólo el símbolo) para copiarla. Se cierra con Escape o
 * tocando afuera.
 */
export function MailHero({ lang }: { lang: Idioma }) {
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (!caja.current?.contains(e.target as Node)) setAbierto(false);
    };
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1600);
    } catch {
      /* Sin permiso de portapapeles: la dirección queda seleccionable. */
    }
  };

  return (
    <div ref={caja} className={css.mail}>
      <button type="button" className={css.red} aria-label="Email" aria-expanded={abierto} onClick={() => setAbierto((v) => !v)}>
        <IconoMail />
      </button>
      {abierto && (
        <div className={css.ventana} role="dialog" aria-label="Email">
          <a className={css.direccion} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <button type="button" className={css.copiar} onClick={copiar} aria-label={copiado ? CONTACTO.copiado[lang] : CONTACTO.copiar[lang]}>
            {copiado ? <IconoListo /> : <IconoCopiar />}
          </button>
        </div>
      )}
    </div>
  );
}
