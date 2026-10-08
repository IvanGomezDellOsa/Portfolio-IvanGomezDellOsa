"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import reel from "@/contenido/reel.json";
import { HERO, SALA, VIDEO } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { alClicVideo } from "@/lib/teatro";
import { enYoutube, vistaPrevia, type Funcion } from "@/lib/videos";
import { Triangulo } from "./Iconos";
import { sinMovimiento } from "./Medios";
import css from "./Reel.module.css";

/** El segundo del reel en que empieza cada proyecto, y en el que termina. */
const INICIOS = [0, ...reel.cortes];
const FINES = [...reel.cortes, reel.vuelta];
const indiceEn = (t: number) => (t >= reel.vuelta ? 0 : reel.cortes.filter((c) => t >= c).length);

/**
 * EL REEL DEL HERO: cuatro segundos mudos de cada video, uno detrás del otro
 * (`tools/videos.mjs`, con los cortes en `reel.json`). Debajo, qué proyecto se
 * está viendo, su play y una barra por video para saltar a cualquiera. El
 * resplandor de atrás toma el acento del proyecto que se ve.
 *
 * Con movimiento reducido o ahorro de datos no corre: queda el póster de cada
 * proyecto y las barras lo cambian a mano.
 */
export function Reel({ lang, funciones }: { lang: Idioma; funciones: Funcion[] }) {
  const lista = reel.proyectos.map((slug) => funciones.find((f) => f.slug === slug)).filter((f): f is Funcion => !!f);
  const video = useRef<HTMLVideoElement>(null);
  const barras = useRef<HTMLOListElement>(null);
  const pausadoAMano = useRef(false);
  const [i, setI] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [quieto, setQuieto] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (sinMovimiento()) {
      setQuieto(true);
      return;
    }
    let cuadro = 0;
    // La barra del proyecto actual se llena con el tiempo del reel.
    const seguir = () => {
      const t = v.currentTime;
      const k = indiceEn(t);
      setI(k);
      const avance = t >= reel.vuelta ? 0 : (t - INICIOS[k]!) / (FINES[k]! - INICIOS[k]!);
      barras.current?.style.setProperty("--avance", String(Math.min(1, Math.max(0, avance))));
      cuadro = requestAnimationFrame(seguir);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !pausadoAMano.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    const alCorrer = () => {
      setCorriendo(true);
      cancelAnimationFrame(cuadro);
      cuadro = requestAnimationFrame(seguir);
    };
    const alParar = () => {
      setCorriendo(false);
      cancelAnimationFrame(cuadro);
    };
    v.addEventListener("play", alCorrer);
    v.addEventListener("pause", alParar);
    return () => {
      io.disconnect();
      cancelAnimationFrame(cuadro);
      v.removeEventListener("play", alCorrer);
      v.removeEventListener("pause", alParar);
    };
  }, []);

  const saltar = (k: number) => {
    setI(k);
    const v = video.current;
    if (!v || quieto) return;
    v.currentTime = INICIOS[k]! + (k === 0 ? 0 : 0.35);
    barras.current?.style.setProperty("--avance", "0");
    if (v.paused && !pausadoAMano.current) v.play().catch(() => {});
  };

  const alternar = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      pausadoAMano.current = false;
      v.play().catch(() => {});
    } else {
      pausadoAMano.current = true;
      v.pause();
    }
  };

  const f = lista[i] ?? lista[0];
  if (!f) return null;
  return (
    <figure className={css.reel} style={{ "--brillo": f.acento } as CSSProperties} data-quieto={quieto || undefined}>
      <figcaption className="sr">{HERO.reel[lang]}</figcaption>
      <div className={css.pantalla}>
        {/* El póster de cada proyecto, debajo: lo que se ve sin movimiento. */}
        <img className={css.poster} src={vistaPrevia(f.slug).poster} alt="" width={1280} height={720} decoding="async" />
        <video
          ref={video}
          className={css.video}
          muted
          loop
          playsInline
          preload="none"
          poster="/medios/videos/reel-1280.webp"
          width={1280}
          height={720}
          aria-hidden="true"
          tabIndex={-1}
          hidden={quieto}
        >
          <source src="/medios/videos/reel-480.mp4" type="video/mp4" media="(max-width: 700px)" />
          <source src="/medios/videos/reel.mp4" type="video/mp4" />
        </video>
        <a className={css.reproducir} href={enYoutube(f.id)} target="_blank" rel="noopener noreferrer" onClick={(e) => alClicVideo(e, f.slug)}>
          <span className={css.play} aria-hidden="true">
            <Triangulo lado={14} />
          </span>
          <span className={css.leyenda}>
            <span className={css.nombre}>{f.nombre}</span>
            <span className={css.ver}>
              {VIDEO.ver[lang]}
            </span>
          </span>
        </a>
        {!quieto && (
          <button type="button" className={css.pausa} onClick={alternar} aria-label={`${corriendo ? SALA.pausar[lang] : SALA.reanudar[lang]}: ${HERO.reel[lang]}`}>
            {corriendo ? (
              <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                <rect x="2" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
                <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
              </svg>
            ) : (
              <Triangulo lado={11} />
            )}
          </button>
        )}
      </div>
      <ol ref={barras} className={css.barras} aria-label={HERO.reel[lang]}>
        {lista.map((x, k) => (
          <li key={x.slug} data-estado={k < i ? "visto" : k === i ? "actual" : undefined}>
            <button type="button" onClick={() => saltar(k)} aria-current={k === i ? "true" : undefined} style={{ "--tinte": x.acento } as CSSProperties}>
              <span className={css.pista} aria-hidden="true" />
              <span className={css.rotulo}>{x.nombre}</span>
            </button>
          </li>
        ))}
      </ol>
    </figure>
  );
}
