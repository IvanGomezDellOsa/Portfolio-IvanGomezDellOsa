"use client";

import { useEffect, useRef, useState } from "react";
import { SALA, VISUALES } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./Kiosco.module.css";

const PANTALLAS = ["inicio", "pose", "cuenta"] as const;

/**
 * EL KIOSCO DE FREEMAGICMIRROR. Las tres pantallas reales de la aplicación
 * (sus videos de `assets/videos`), en el orden en que las ve quien se acerca al
 * fotomatón: inicio, pose, cuenta regresiva. La numeración está porque es una
 * secuencia de verdad.
 *
 * Un solo `<video>` que cambia de fuente al terminar cada pantalla; corre sólo
 * mientras se ve, y con movimiento reducido se elige la pantalla a mano.
 */
export function Kiosco({ lang }: { lang: Idioma }) {
  const t = VISUALES.kiosco;
  const video = useRef<HTMLVideoElement>(null);
  const [actual, setActual] = useState(0);
  const [animado, setAnimado] = useState(true);
  const visible = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAnimado(false);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = !!e?.isIntersecting;
        if (visible.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || !animado) return;
    v.load();
    if (visible.current) v.play().catch(() => {});
  }, [actual, animado]);

  const pantalla = PANTALLAS[actual]!;
  return (
    <figure className={css.kiosco}>
      <div className={css.disposicion}>
      <div className={css.equipo}>
        <div className={css.pantalla}>
          <video
            ref={video}
            key={animado ? "animado" : "quieto"}
            muted
            playsInline
            preload="none"
            poster={`/medios/freemagicmirror/${pantalla}.webp`}
            width={540}
            height={960}
            onEnded={() => setActual((a) => (a + 1) % PANTALLAS.length)}
            aria-label={`${t.titulo[lang]}: ${t.pasos[lang][actual]}`}
          >
            {animado && <source src={`/medios/freemagicmirror/${pantalla}.mp4`} type="video/mp4" />}
          </video>
        </div>
        <span className={css.pie} aria-hidden="true" />
      </div>
      <figcaption className={css.pasos}>
        <span className="etiqueta">{t.titulo[lang]}</span>
        <ol>
          {t.pasos[lang].map((paso, i) => (
            <li key={paso}>
              <button type="button" className={css.paso} aria-current={i === actual ? "step" : undefined} onClick={() => setActual(i)}>
                <span className="maquina">{i + 1}</span>
                {paso}
              </button>
            </li>
          ))}
        </ol>
        {!animado && <span className="sr">{SALA.reanudar[lang]}</span>}
      </figcaption>
      </div>
    </figure>
  );
}
