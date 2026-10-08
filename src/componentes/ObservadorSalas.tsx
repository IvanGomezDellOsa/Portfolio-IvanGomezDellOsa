"use client";

import { useEffect } from "react";

/**
 * EN QUE SALA SE ESTA. Marca `<html data-sala>` con la sección que ocupa la
 * franja superior de la pantalla (donde vive la barra). Con ese atributo, las
 * reglas que emite `raiz.tsx` le pasan a la barra y al pasillo la luz de la
 * sala: la barra oscura se vuelve clara al entrar en una sala clara, sin que
 * ningún componente guarde estado.
 */
export function ObservadorSalas() {
  useEffect(() => {
    const salas = Array.from(document.querySelectorAll<HTMLElement>("[data-sala-id]"));
    if (!salas.length) return;
    const raiz = document.documentElement;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) raiz.dataset.sala = (e.target as HTMLElement).dataset.salaId;
        }
      },
      // La franja de arriba de la pantalla (8 %, donde vive la barra): la sala
      // que entra en ella es la actual.
      { rootMargin: "0px 0px -92% 0px", threshold: 0 },
    );
    for (const s of salas) observador.observe(s);
    return () => observador.disconnect();
  }, []);
  return null;
}
