"use client";

import { useEffect } from "react";

/**
 * EL REVELADO, UNA SOLA VEZ PARA TODA LA PAGINA. Un único IntersectionObserver
 * mira cada `[data-revelar]`:
 *
 *   · al montar, lo que está debajo de la pantalla pasa a `no` (oculto). Lo que
 *     ya se ve se deja como está: nunca se esconde algo que el visitante está
 *     mirando;
 *   · cuando entra en pantalla pasa a `si` y se arma en el orden de sus `--i`;
 *   · al terminar pasa a `ya` y no vuelve a animarse.
 *
 * Con movimiento reducido no hace nada: todo queda visible desde el principio.
 */
export function Revelador() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elementos = Array.from(document.querySelectorAll<HTMLElement>("[data-revelar]"));
    const alto = window.innerHeight;
    for (const el of elementos) {
      if (el.dataset.revelar === "ya") continue;
      if (el.getBoundingClientRect().top > alto * 0.92) el.dataset.revelar = "no";
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const el = e.target as HTMLElement;
          if (!e.isIntersecting || el.dataset.revelar !== "no") continue;
          el.dataset.revelar = "si";
          observador.unobserve(el);
          // El armado más largo (una traza de 1,3 s con retraso) termina antes de 3 s.
          window.setTimeout(() => (el.dataset.revelar = "ya"), 3200);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    for (const el of elementos) if (el.dataset.revelar === "no") observador.observe(el);
    return () => observador.disconnect();
  }, []);
  return null;
}
