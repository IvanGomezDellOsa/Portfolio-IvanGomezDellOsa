"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS } from "@/contenido/salas";
import { NAV } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { caso } from "@/lib/rutas";
import { sinMovimiento } from "./Medios";
import css from "./BarraProyectos.module.css";

/**
 * LA BARRA DE PROYECTOS: los nueve, en una línea debajo de la barra superior,
 * sólo mientras se recorre un proyecto. Dice en cuál se está y deja pasar a
 * cualquier otro sin volver a la lista ni desplazarse hasta él. Cada uno lleva
 * el punto de su color, como en la lista.
 *
 * En qué proyecto se está lo marca `ObservadorSalas` en `<html data-sala>`;
 * acá sólo se lo lee. Donde no entran los nueve (teléfonos), la línea se
 * desplaza de costado y el actual se trae al centro.
 */
export function BarraProyectos({ lang }: { lang: Idioma }) {
  const [sala, setSala] = useState("taller");
  const pista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = document.documentElement;
    const leer = () => setSala(raiz.dataset.sala ?? "taller");
    leer();
    const observador = new MutationObserver(leer);
    observador.observe(raiz, { attributes: true, attributeFilter: ["data-sala"] });
    return () => observador.disconnect();
  }, []);

  useEffect(() => {
    const p = pista.current;
    const actual = p?.querySelector<HTMLElement>("[aria-current]");
    if (!p || !actual) return;
    p.scrollTo({ left: actual.offsetLeft - (p.clientWidth - actual.offsetWidth) / 2, behavior: sinMovimiento() ? "auto" : "smooth" });
  }, [sala]);

  const visible = PROYECTOS.some((p) => p.slug === sala);

  return (
    <nav className={css.barra} data-visible={visible || undefined} inert={!visible} aria-label={NAV.proyectos[lang]}>
      <div ref={pista} className={css.pista}>
        <ol className={css.lista}>
          {PROYECTOS.map((p) => (
            <li key={p.slug}>
              <a className={css.enlace} href={caso(lang, p.slug)} aria-current={p.slug === sala ? "true" : undefined} style={{ "--tinte": SALAS[p.slug].acento } as CSSProperties}>
                <span className={css.punto} aria-hidden="true" />
                {p.nombre}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
