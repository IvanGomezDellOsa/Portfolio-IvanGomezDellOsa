"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { VISUALES } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./GrillaSemanas.module.css";

const ANIOS = 80;
const SEMANAS = 52;
const BANDA = 10;
/** Proporciones de la celda de MementoLife (`render-core/design-tokens.json`). */
const DIAMETRO = 0.44;
const HUECO_BANDA = 0.8;
const ANILLO = 1.58;
const TRAZO_ANILLO = 0.72;

/**
 * LA GRILLA DE MEMENTOLIFE, DIBUJADA EN VIVO con la técnica de la extensión:
 * cada semana es un círculo, pero los 4.160 círculos se acumulan en TRES
 * trazados SVG (pasado, futuro y anillo) en lugar de un elemento por celda.
 * Columnas = años, filas = semanas, una banda de aire cada diez años.
 *
 * La fecha de hoy sólo existe en el navegador, así que la grilla se dibuja
 * después de montar; mientras tanto el espacio queda reservado (sin salto de
 * diseño). El año de nacimiento es un ejemplo: no se guarda ni se envía.
 */
export function GrillaSemanas({ lang }: { lang: Idioma }) {
  const t = VISUALES.grilla;
  const id = useId();
  const [nacimiento, setNacimiento] = useState(1993);
  const [hoy, setHoy] = useState<Date | null>(null);
  const [visto, setVisto] = useState(false);
  const marco = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHoy(new Date());
    const el = marco.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Geometría en unidades de celda: el SVG escala solo con su viewBox.
  const paso = 10;
  const ancho = (ANIOS + Math.floor((ANIOS - 1) / BANDA) * HUECO_BANDA) * paso;
  const alto = SEMANAS * paso;

  const { pasado, futuro, anillo, actual } = useMemo(() => {
    if (!hoy) return { pasado: "", futuro: "", anillo: "", actual: 0 };
    const nac = new Date(nacimiento, 6, 1);
    const semanas = Math.floor((hoy.getTime() - nac.getTime()) / (7 * 24 * 3600 * 1000));
    const indice = Math.max(0, Math.min(ANIOS * SEMANAS, semanas));
    const r = (paso * DIAMETRO) / 2;
    let p = "";
    let f = "";
    let a = "";
    for (let i = 0; i < ANIOS * SEMANAS; i++) {
      const anio = Math.floor(i / SEMANAS);
      const semana = i % SEMANAS;
      const cx = anio * paso + Math.floor(anio / BANDA) * paso * HUECO_BANDA + paso / 2;
      const cy = semana * paso + paso / 2;
      // Un círculo como dos arcos: `M` al borde izquierdo y dos medias vueltas.
      const circulo = `M${(cx - r).toFixed(2)} ${cy.toFixed(2)}a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(2 * r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-2 * r).toFixed(2)} 0`;
      if (i < indice) p += circulo;
      else f += circulo;
      if (i === indice) {
        const ra = r * ANILLO;
        a = `M${(cx - ra).toFixed(2)} ${cy.toFixed(2)}a${ra.toFixed(2)} ${ra.toFixed(2)} 0 1 0 ${(2 * ra).toFixed(2)} 0a${ra.toFixed(2)} ${ra.toFixed(2)} 0 1 0 ${(-2 * ra).toFixed(2)} 0`;
      }
    }
    return { pasado: p, futuro: f, anillo: a, actual: indice };
  }, [hoy, nacimiento]);

  const total = ANIOS * SEMANAS;
  const porcentaje = Math.round((actual / total) * 100);
  const numero = (n: number) => n.toLocaleString(lang === "es" ? "es-AR" : "en-US");
  const anioActual = hoy?.getFullYear() ?? 2026;

  return (
    <figure className={css.grilla}>
      <figcaption className={css.cabecera}>
        <span className={css.titulo}>{t.titulo[lang]}</span>
      </figcaption>
      <div className={css.cuerpo}>
        <div className={css.cifras} aria-live="polite">
          <span className={css.porcentaje}>{hoy ? `${porcentaje} %` : "—"}</span>
          <span className={`${css.semana} maquina`}>
            {t.semana[lang]} {hoy ? numero(actual + 1 > total ? total : actual + 1) : "—"} {t.de[lang]} {numero(total)}
          </span>
        </div>
        <div ref={marco} className={css.lienzo} data-visto={visto}>
          <svg viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label={`${t.titulo[lang]}: ${porcentaje} %`}>
            <defs>
              <clipPath id={`${id}-barrido`}>
                <rect className={css.barrido} x="0" y="0" width={ancho} height={alto} />
              </clipPath>
            </defs>
            {futuro && <path d={futuro} className={css.futuro} />}
            {pasado && <path d={pasado} className={css.pasado} clipPath={`url(#${id}-barrido)`} />}
            {anillo && <path d={anillo} className={css.anillo} strokeWidth={((paso * DIAMETRO) / 2) * TRAZO_ANILLO} />}
          </svg>
        </div>
      </div>
      <label className={css.control} htmlFor={`${id}-anio`}>
        <span className="etiqueta">{t.nacimiento[lang]}</span>
        <input
          id={`${id}-anio`}
          type="range"
          min={anioActual - ANIOS}
          max={anioActual}
          step={1}
          value={nacimiento}
          onChange={(e) => setNacimiento(Number(e.target.value))}
        />
        <output className="maquina" htmlFor={`${id}-anio`}>
          {nacimiento}
        </output>
      </label>
    </figure>
  );
}
