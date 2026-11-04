"use client";

import { useRef } from "react";
import css from "./Retrato.module.css";

/**
 * EL RETRATO DEL HERO: la foto del CV (la de «Sobre mí»), quieta, en color.
 * Un clic (o un toque) alterna el filtro entre color y blanco y negro.
 *
 * Antes, en escritorio, era una cara que seguía al cursor y, con un clic, se
 * iba y volvía. Ese retrato quedó guardado en la etiqueta de git
 * `retrato-que-mira` (con `tools/retrato.mjs` y `public/medios/persona/retrato/`).
 *
 * Es decorado: va `aria-hidden` (la foto ya era decorativa).
 */
export function Retrato({ className = "" }: { className?: string }) {
  const caja = useRef<HTMLDivElement>(null);

  const alClic = () => {
    const el = caja.current;
    if (!el) return;
    if ("gris" in el.dataset) delete el.dataset.gris;
    else el.dataset.gris = "";
  };

  return (
    // Sin menú contextual ni arrastre: guardar o ampliar la foto no queda a un clic.
    <div ref={caja} className={`${className} ${css.retrato}`} aria-hidden="true" onClick={alClic} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}>
      <img className={`${css.capa} ${css.frente}`} src="/medios/persona/foto-480.webp" alt="" width={300} height={300} fetchPriority="high" decoding="async" draggable={false} />
    </div>
  );
}
