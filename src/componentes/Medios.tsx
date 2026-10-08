"use client";

import { useEffect, useRef, useState } from "react";
import { SALA } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./Medios.module.css";

/** Una fuente del video; `media` elige la versión chica en pantallas angostas. */
export interface Fuente {
  src: string;
  media?: string;
}

/** Sin movimiento si se pidió (movimiento reducido o ahorro de datos). */
export function sinMovimiento() {
  const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches || conexion?.saveData === true;
}

/**
 * UN VIDEO QUE SOLO CORRE MIENTRAS SE VE. `preload="none"` y póster: no se
 * descarga nada hasta que entra en pantalla. Se pausa al salir, y tiene su
 * botón de pausa (todo lo que se mueve más de cinco segundos tiene que poder
 * detenerse). Con movimiento reducido o ahorro de datos no arranca solo.
 */
export function VideoEnVista({
  src,
  fuentes,
  poster,
  ancho,
  alto,
  etiqueta,
  lang,
  fondo = false,
  decorativo = false,
  className,
  claseBoton,
}: {
  src?: string;
  fuentes?: Fuente[];
  poster: string;
  ancho: number;
  alto: number;
  etiqueta: string;
  lang: Idioma;
  /** De fondo: sin botón (lo que se ve encima es el contenido), decorativo. */
  fondo?: boolean;
  /** La imagen no informa (otro elemento dice qué es), pero conserva su pausa. */
  decorativo?: boolean;
  className?: string;
  claseBoton?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const pausadoAMano = useRef(false);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || sinMovimiento()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !pausadoAMano.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    const alCorrer = () => setCorriendo(true);
    const alParar = () => setCorriendo(false);
    v.addEventListener("play", alCorrer);
    v.addEventListener("pause", alParar);
    return () => {
      io.disconnect();
      v.removeEventListener("play", alCorrer);
      v.removeEventListener("pause", alParar);
    };
  }, []);

  const alternar = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      pausadoAMano.current = false;
      v.play().catch(() => {});
    } else {
      pausadoAMano.current = true;
      v.pause();
    }
  };

  const lista: Fuente[] = fuentes ?? (src ? [{ src }] : []);
  const oculto = fondo || decorativo;
  return (
    <div className={`${css.video} ${fondo ? css.deFondo : ""} ${className ?? ""}`}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        width={ancho}
        height={alto}
        aria-label={oculto ? undefined : etiqueta}
        aria-hidden={oculto ? true : undefined}
        tabIndex={-1}
      >
        {lista.map((f) => (
          <source key={f.src} src={f.src} type="video/mp4" media={f.media} />
        ))}
      </video>
      {!fondo && (
        <button
          type="button"
          className={`${css.boton} ${claseBoton ?? ""}`}
          onClick={alternar}
          aria-label={`${corriendo ? SALA.pausar[lang] : SALA.reanudar[lang]}: ${etiqueta}`}
        >
          {corriendo ? (
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
              <rect x="2" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
              <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 1.6v8.8L10.4 6z" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
