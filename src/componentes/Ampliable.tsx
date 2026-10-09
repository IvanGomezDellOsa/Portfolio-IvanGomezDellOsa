"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import css from "./Ampliable.module.css";

/**
 * LA DESCRIPCION, REDUCIDA O AMPLIADA. La sala muestra la reducida; «Leer más»
 * la cambia por la ampliada en el mismo lugar (no se suman: cada una se lee
 * sola), y «Leer menos» vuelve. Las dos están siempre en el HTML: sin
 * JavaScript se lee la reducida y el caso completo tiene todo.
 *
 * La que no se ve queda `inert`: ni el foco ni un lector de pantalla entran en
 * ella. El alto se anima con una fila de grilla de 0fr a 1fr por versión.
 */
export function Ampliable({
  reducida,
  ampliada,
  mas,
  menos,
  nombre,
  className,
}: {
  reducida: ReactNode;
  ampliada: ReactNode;
  mas: string;
  menos: string;
  /** Para el nombre accesible del botón: hay uno por proyecto en la página. */
  nombre: string;
  className?: string;
}) {
  const [abierta, setAbierta] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const id = useId();

  const alternar = () => {
    const cerrando = abierta;
    setAbierta(!abierta);
    // Al cerrar una ampliada larga, el botón sube: que no quede fuera de la pantalla.
    if (cerrando) window.setTimeout(() => boton.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 80);
  };

  return (
    <div className={`${css.ampliable} ${className ?? ""}`} data-abierta={abierta}>
      <div className={css.pliegue} data-visible={!abierta} inert={abierta}>
        <div className={css.contenido}>{reducida}</div>
      </div>
      <div id={id} className={css.pliegue} data-visible={abierta} inert={!abierta}>
        <div className={css.contenido}>{ampliada}</div>
      </div>
      <button ref={boton} type="button" className={css.alternar} aria-expanded={abierta} aria-controls={id} onClick={alternar}>
        {abierta ? menos : mas}
        <span className="sr">: {nombre}</span>
        <svg className={css.chevron} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
