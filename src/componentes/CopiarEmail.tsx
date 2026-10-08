"use client";

import { useState } from "react";
import { CONTACTO } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./Galeria.module.css";

/** Copia la dirección y lo dice: «Copiado» durante dos segundos. */
export function CopiarEmail({ email, lang }: { email: string; lang: Idioma }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* Sin permiso de portapapeles: queda el enlace mailto al lado. */
    }
  };
  return (
    <button type="button" className={css.copiar} onClick={copiar} aria-live="polite">
      {copiado ? CONTACTO.copiado[lang] : CONTACTO.copiar[lang]}
    </button>
  );
}
