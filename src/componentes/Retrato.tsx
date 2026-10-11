"use client";

import { useEffect, useRef } from "react";
import css from "./Retrato.module.css";

const RUTA = "/medios/persona/retrato";

/*
 * La grilla de `anillo.webp` (ver `tools/retrato.mjs`): 6×6 celdas, 33 cuadros
 * en el orden de la toma. Ocho poses de cuatro cuadros cada una (la pose y sus
 * tres intermedios hacia la siguiente), empezando por abajo y girando hacia la
 * derecha; después de abajo-izquierda (28) vienen los tres del camino al
 * frente y el frente (32).
 */
const COLUMNAS = 6;
const FILAS = 6;
const POR_POSE = 4;
const VUELTA = 8 * POR_POSE;
const ULTIMA = 7 * POR_POSE;
const FRENTE = 32;

/** Un paso del giro, y el tope de un giro entero: media vuelta no tarda más que eso. */
const PASO_MS = 55;
const TOPE_MS = 420;
/** Cuánto tarda en volver, desde el clic. */
const VUELVE_MS = 10_000;
/** Cuánto se queda de frente al volver, antes de seguir otra vez al cursor. */
const QUIETO_MS = 2_000;
/** Cuánto (en poses) hay que pasarse del borde para cambiar de pose: que no tiemble en la frontera. */
const HISTERESIS = 0.15;

const lugar = (p: number) => ((p % VUELTA) + VUELTA) % VUELTA;

function rango(desde: number, hasta: number) {
  const paso = Math.sign(hasta - desde);
  return Array.from({ length: Math.abs(hasta - desde) + 1 }, (_, i) => desde + paso * i);
}

/**
 * Los cuadros para ir de uno a otro. Por el anillo, del lado corto y cuadro
 * por cuadro (entre abajo-izquierda y abajo no hay intermedios: salta). Al
 * frente se llega por su camino desde abajo-izquierda, o de un salto.
 */
function camino(desde: number, hasta: number): number[] {
  if (desde === hasta) return [];
  if (hasta === FRENTE) return desde >= ULTIMA ? rango(desde + 1, FRENTE) : [FRENTE];
  if (desde > ULTIMA) return hasta === ULTIMA ? rango(desde - 1, ULTIMA) : [hasta];
  let d = lugar(hasta - desde);
  if (d > VUELTA / 2) d -= VUELTA;
  return rango(desde, desde + d)
    .slice(1)
    .map(lugar)
    .filter((p) => p <= ULTIMA);
}

const posicion = (n: number) => `${((n % COLUMNAS) / (COLUMNAS - 1)) * 100}% ${(Math.floor(n / COLUMNAS) / (FILAS - 1)) * 100}%`;

/**
 * EL RETRATO DEL HERO, que mira el cursor. De frente al llegar y cuando el
 * cursor está sobre la cara; si no, hacia donde esté (arriba a la derecha de
 * la pantalla: arriba a la derecha), y gira la cabeza cuadro por cuadro. Con
 * un clic en la cara niega con la cabeza y se va: queda el círculo con la
 * pared vacía, como un cuadro cuyo dueño salió, y a los diez segundos vuelve
 * caminando y mira de nuevo.
 *
 * En una pantalla táctil no hay cursor que seguir: ahí va la foto del CV,
 * quieta (sin el anillo de poses ni los videos), y el toque no la hace irse:
 * alterna el filtro entre color y blanco y negro.
 *
 * Todo sale de la misma sesión, llevado a un solo encuadre
 * (`tools/retrato.mjs`). Primero se pinta el frente solo; el anillo de poses y
 * los videos se piden cuando terminó de cargar la página. Con ahorro de datos
 * no se piden y queda de frente; con movimiento reducido mira igual, pero sin
 * girar: salta de pose en pose.
 *
 * Es decorado: va `aria-hidden` (la foto ya era decorativa).
 */
export function Retrato({ className = "" }: { className?: string }) {
  const caja = useRef<HTMLDivElement>(null);
  const base = useRef<HTMLDivElement>(null);
  const velo = useRef<HTMLDivElement>(null);
  const salida = useRef<HTMLVideoElement>(null);
  const vuelta = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = caja.current;
    const b = base.current;
    const v = velo.current;
    const sal = salida.current;
    const vue = vuelta.current;
    if (!el || !b || !v || !sal || !vue) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ahorro = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const tactil = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    let vivo = true;
    let listo = false;
    let yendose = false;
    let actual = FRENTE;
    let destino = FRENTE;
    let cola: number[] = [];
    let ritmo = PASO_MS;
    let reloj = 0;
    let regreso = 0;
    let cuadro = 0;
    let fundido: Animation | undefined;
    let px: number | null = null;
    let py = 0;

    // Un cuadro. Si no es vecino del anterior (o es el frente, que sale de
    // otra toma), el anterior se desvanece encima: un salto sin corte seco.
    const mostrar = (n: number) => {
      if (n === actual) return;
      if (!quieto && (Math.abs(n - actual) !== 1 || n === FRENTE)) {
        fundido?.cancel();
        v.style.backgroundPosition = posicion(actual);
        fundido = v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: "ease-out", fill: "forwards" });
      }
      b.style.backgroundPosition = posicion(n);
      actual = n;
    };

    const avanzar = () => {
      reloj = 0;
      const n = cola.shift();
      if (n === undefined) return;
      mostrar(n);
      if (cola.length) reloj = window.setTimeout(avanzar, ritmo);
    };

    const apuntar = (objetivo: number) => {
      if (objetivo === destino) return;
      destino = objetivo;
      cola = quieto ? [objetivo] : camino(actual, objetivo);
      ritmo = Math.min(PASO_MS, TOPE_MS / Math.max(cola.length, 1));
      if (!reloj) avanzar();
    };

    // Hacia dónde mirar. El ángulo se mide en proporción a la pantalla (cada
    // esquina es una diagonal), no en píxeles: la cara está arriba y al medio.
    const mirar = () => {
      cuadro = 0;
      if (px === null || yendose) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = px - cx;
      const dy = py - cy;
      if (Math.hypot(dx, dy) <= r.width / 2) return apuntar(FRENTE);
      const nx = dx / Math.max(dx > 0 ? window.innerWidth - cx : cx, 1);
      const ny = dy / Math.max(dy > 0 ? window.innerHeight - cy : cy, 1);
      // En poses: 0 abajo, 2 derecha, 4 arriba, 6 izquierda.
      const u = Math.atan2(-ny, nx) / (Math.PI / 4) + 2;
      let pose = (((Math.round(u) % 8) + 8) % 8);
      if (destino !== FRENTE) {
        const previa = destino / POR_POSE;
        const lejos = Math.abs((((u - previa) % 8) + 12) % 8 - 4);
        if (lejos < 0.5 + HISTERESIS) pose = previa;
      }
      apuntar(pose * POR_POSE);
    };

    const alMover = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!cuadro) cuadro = requestAnimationFrame(mirar);
    };
    const alDesplazar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(mirar);
    };

    // De vuelta, se queda de frente un momento antes de volver a seguir el
    // cursor: que la llegada no se corte en seco por la primera pose.
    const quedarse = (pausa = 0) => {
      regreso = window.setTimeout(() => {
        yendose = false;
        el.style.cursor = "";
        alDesplazar(); // y mira donde esté el cursor
      }, pausa);
    };

    // La vuelta arranca en el último cuadro de la salida y termina mirando a
    // cámara: ahí se funde con el frente, que ya está debajo.
    const volver = () => {
      vue.addEventListener(
        "playing",
        () => {
          vue.style.opacity = "1";
          sal.style.opacity = "0";
        },
        { once: true },
      );
      vue.addEventListener(
        "ended",
        () => {
          vue.style.opacity = "0";
          if (!quieto) vue.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: "ease-out" });
          quedarse(QUIETO_MS);
        },
        { once: true },
      );
      vue.currentTime = 0;
      vue.play().catch(() => {
        sal.style.opacity = "0";
        quedarse();
      });
    };

    // El clic en la cara: vuelve al frente (el primer cuadro de la salida) y
    // pone el video encima recién cuando corre. Si no puede correr, se queda.
    const irse = () => {
      if (yendose) return;
      yendose = true;
      // El acuse del clic: el círculo cede apenas y suelta un aro de luz. Quien
      // tocó sin querer entiende que lo que sigue lo empezó su clic.
      if (!quieto) {
        el.animate([{ transform: "scale(1)" }, { transform: "scale(0.955)", offset: 0.3 }, { transform: "scale(1)" }], { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
        el.animate(
          [
            { boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.55), 0 0 0 0 rgba(255, 255, 255, 0.3)" },
            { boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.12), 0 0 0 16px rgba(255, 255, 255, 0)" },
          ],
          { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
      window.clearTimeout(reloj);
      cola = [];
      destino = FRENTE;
      if (listo) mostrar(FRENTE);
      el.style.cursor = "default";
      sal.addEventListener("playing", () => (sal.style.opacity = "1"), { once: true });
      sal.currentTime = 0;
      sal.play().then(
        () => {
          vue.preload = "auto";
          vue.load();
          regreso = window.setTimeout(volver, VUELVE_MS);
        },
        () => {
          yendose = false;
          el.style.cursor = "";
        },
      );
    };

    // En una pantalla táctil la foto está en color y el toque alterna el
    // filtro: blanco y negro, color, y así. Con el mouse, el clic lo hace irse.
    const alClic = () => {
      if (!tactil) return irse();
      if ("gris" in el.dataset) delete el.dataset.gris;
      else el.dataset.gris = "";
    };
    el.addEventListener("click", alClic);

    const empezar = async () => {
      // Con el dedo no hay juego de mirar: ni el anillo de poses ni los videos.
      if (ahorro || tactil) return;
      const anillo = new Image();
      anillo.src = `${RUTA}/anillo.webp`;
      try {
        await anillo.decode();
      } catch {
        return;
      }
      if (!vivo || yendose) return;
      b.style.backgroundImage = v.style.backgroundImage = `url(${anillo.src})`;
      b.style.backgroundPosition = posicion(FRENTE);
      listo = true;
      window.addEventListener("pointermove", alMover, { passive: true });
      window.addEventListener("pointerdown", alMover, { passive: true });
      window.addEventListener("scroll", alDesplazar, { passive: true });
      sal.preload = "auto";
      sal.load();
    };
    if (document.readyState === "complete") empezar();
    else window.addEventListener("load", empezar, { once: true });

    return () => {
      vivo = false;
      window.clearTimeout(reloj);
      window.clearTimeout(regreso);
      cancelAnimationFrame(cuadro);
      fundido?.cancel();
      el.removeEventListener("click", alClic);
      window.removeEventListener("load", empezar);
      window.removeEventListener("pointermove", alMover);
      window.removeEventListener("pointerdown", alMover);
      window.removeEventListener("scroll", alDesplazar);
    };
  }, []);

  return (
    // Sin menú contextual ni arrastre: guardar o ampliar la foto y los videos no queda a un clic.
    <div ref={caja} className={`${className} ${css.retrato}`} aria-hidden="true" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}>
      {/* En una pantalla táctil, la foto del CV (la de «Sobre mí»), quieta: ahí no hay cursor que seguir. */}
      <picture>
        <source media="(hover: none) and (pointer: coarse)" srcSet="/medios/persona/foto-480.webp" />
        <img className={`${css.capa} ${css.frente}`} src={`${RUTA}/frente.webp`} alt="" width={300} height={300} fetchPriority="high" decoding="async" draggable={false} />
      </picture>
      <div ref={base} className={`${css.capa} ${css.anillo}`} />
      <div ref={velo} className={`${css.capa} ${css.anillo} ${css.velo}`} />
      <video ref={salida} className={`${css.capa} ${css.video}`} src={`${RUTA}/salida.mp4`} muted playsInline preload="none" tabIndex={-1} disablePictureInPicture controlsList="nodownload noremoteplayback" />
      <video ref={vuelta} className={`${css.capa} ${css.video}`} src={`${RUTA}/vuelta.mp4`} muted playsInline preload="none" tabIndex={-1} disablePictureInPicture controlsList="nodownload noremoteplayback" />
    </div>
  );
}
