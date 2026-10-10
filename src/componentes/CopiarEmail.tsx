"use client";

import { useState } from "react";
import { CONTACTO } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { IconoCopiar, IconoListo } from "./Iconos";
import css from "./Galeria.module.css";

/**
 * LA DIRECCION DEL CONTACTO: se lee entera y un clic la copia, como en la tapa
 * del CV. El ícono pasa a un tilde durante dos segundos.
 */
export function CopiarEmail({ email, lang }: { email: string; lang: Idioma }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* Sin permiso de portapapeles: la dirección queda a la vista. */
    }
  };
  return (
    <button type="button" className={css.direccion} onClick={copiar} data-copiado={copiado} title={CONTACTO.copiar[lang]}>
      <span>{email}</span>
      <span className={css.iconoCopiar} aria-hidden="true">
        {copiado ? <IconoListo lado={17} /> : <IconoCopiar lado={17} />}
      </span>
      <span className="sr" aria-live="polite">
        {copiado ? CONTACTO.copiado[lang] : `(${CONTACTO.copiar[lang]})`}
      </span>
    </button>
  );
}
