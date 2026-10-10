"use client";

import { useId, useState, type ReactNode } from "react";
import css from "./CasoCompleto.module.css";

/**
 * EL CASO COMPLETO, A PEDIDO. La página de un proyecto muestra lo que alcanza
 * para entenderlo (qué es, su video, la descripción, el dato, el stack); la
 * arquitectura, las decisiones y los resultados se abren con este botón, en el
 * lugar. Así la página es corta por omisión y el detalle queda a un clic.
 *
 * El contenido está siempre en el HTML: cerrado, queda fuera del foco y del
 * lector de pantalla (`inert`), y sin JavaScript se ve entero.
 */
export function CasoCompleto({ abrir, cerrar, nombre, children }: { abrir: string; cerrar: string; nombre: string; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  return (
    <div className={css.caso} data-caso="">
      <div className={css.linea}>
        <button type="button" className={`pastilla hueca ${css.boton}`} aria-expanded={abierto} aria-controls={id} onClick={() => setAbierto((v) => !v)}>
          {abierto ? cerrar : abrir}
          <span className="sr">: {nombre}</span>
          <svg className={css.chevron} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div id={id} className={css.contenido} data-abierto={abierto} inert={!abierto}>
        {children}
      </div>
      <noscript>
        <style>{`[data-caso] [data-abierto]{display:block!important}[data-caso] button{display:none!important}`}</style>
      </noscript>
    </div>
  );
}
