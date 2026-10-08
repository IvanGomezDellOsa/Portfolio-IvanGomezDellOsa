"use client";

import { useEffect, useRef, useState } from "react";
import { SECCIONES_LEONARDO, VISUALES } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./EspacioVectorial.module.css";

interface Vectores {
  n: number;
  /** Posiciones × 1000, de a tres. */
  pos: number[];
  /** Direcciones × 1000: hacia el pasaje más parecido. */
  dir: number[];
  sec: number[];
}

/**
 * EL ESPACIO VECTORIAL DE ASK LEONARDO, EN VIVO. Los datos son
 * `public/datos/vectores.json`: la misma proyección que dibuja la sección
 * «Cómo funciona» del sitio (1.402 pasajes, de 384 dimensiones a 3), achicada
 * por `tools/medios.mjs`. No es una animación ilustrativa.
 *
 * Canvas 2D y no Three.js: son 1.402 segmentos, y un canvas los dibuja a 60 fps
 * sin sumar una librería de 600 KB a un portfolio. Cada vector es un trazo
 * corto hacia el pasaje que más se le parece; la profundidad se lee por alfa.
 *
 * Sólo trabaja mientras se ve: los datos se piden al acercarse, el cuadro se
 * dibuja sólo en pantalla, y con movimiento reducido queda quieto.
 */
export function EspacioVectorial({ lang }: { lang: Idioma }) {
  const lienzo = useRef<HTMLCanvasElement>(null);
  const [seccion, setSeccion] = useState<number | null>(null);
  const [conteo, setConteo] = useState<number[]>([]);

  useEffect(() => {
    const canvas = lienzo.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let datos: Vectores | null = null;
    let visible = false;
    let cuadro = 0;
    let giro = 0.6;
    let inclinacion = -0.32;
    let arrastre: { x: number; y: number } | null = null;
    let ultimo = performance.now();
    let encendida = 11; // Anatomía, zoología y fisiología: la primera que se enciende.
    let reloj = 0;
    let ancho = 0;
    let alto = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const estilo = getComputedStyle(canvas);
    const tinta = estilo.getPropertyValue("--tinta").trim() || "#f3ecde";
    const acento = estilo.getPropertyValue("--acento").trim() || "#e4b46a";

    const medir = () => {
      const r = canvas.getBoundingClientRect();
      ancho = r.width;
      alto = r.height;
      canvas.width = Math.round(ancho * dpr);
      canvas.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // Cinco escalones de profundidad: un trazo por escalón en vez de cambiar el
    // estilo 1.402 veces por cuadro.
    const ESCALONES = 5;
    const dibujar = () => {
      if (!datos) return;
      ctx.clearRect(0, 0, ancho, alto);
      const cy = Math.cos(giro), sy = Math.sin(giro);
      const cx = Math.cos(inclinacion), sx = Math.sin(inclinacion);
      const radio = Math.min(ancho, alto) * 0.43;
      const ox = ancho / 2, oy = alto / 2;
      const f = 3.2;
      const largo = 0.05;
      const trazos: Path2D[] = Array.from({ length: ESCALONES }, () => new Path2D());
      const luz = new Path2D();
      const { pos, dir, sec, n } = datos;
      for (let i = 0; i < n; i++) {
        const k = i * 3;
        const x = pos[k]! / 1000, y = pos[k + 1]! / 1000, z = pos[k + 2]! / 1000;
        const x2 = x + (dir[k]! / 1000) * largo, y2 = y + (dir[k + 1]! / 1000) * largo, z2 = z + (dir[k + 2]! / 1000) * largo;
        // Giro sobre Y, después inclinación sobre X.
        const ax = x * cy + z * sy, az = -x * sy + z * cy;
        const ay = y * cx - az * sx, azz = y * sx + az * cx;
        const bx = x2 * cy + z2 * sy, bz = -x2 * sy + z2 * cy;
        const by = y2 * cx - bz * sx, bzz = y2 * sx + bz * cx;
        const pa = f / (f + azz), pb = f / (f + bzz);
        const destino = sec[i] === encendida ? luz : trazos[Math.min(ESCALONES - 1, Math.max(0, Math.floor(((azz + 1) / 2) * ESCALONES)))]!;
        destino.moveTo(ox + ax * radio * pa, oy - ay * radio * pa);
        destino.lineTo(ox + bx * radio * pb, oy - by * radio * pb);
      }
      ctx.lineCap = "round";
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = tinta;
      for (let e = 0; e < ESCALONES; e++) {
        // Lo más cercano (z negativo tras el giro) es lo más opaco.
        ctx.globalAlpha = 0.72 - e * 0.12;
        ctx.stroke(trazos[e]!);
      }
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.7;
      ctx.strokeStyle = acento;
      ctx.stroke(luz);
    };

    const paso = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - ultimo) / 1000);
      ultimo = ahora;
      if (!arrastre) giro += dt * 0.12;
      reloj += dt;
      if (reloj > 3.4) {
        reloj = 0;
        encendida = (encendida + 1) % 22;
        setSeccion(encendida);
      }
      dibujar();
      if (visible) cuadro = requestAnimationFrame(paso);
    };

    const arrancar = () => {
      if (!datos || !visible || quieto) return;
      cancelAnimationFrame(cuadro);
      ultimo = performance.now();
      cuadro = requestAnimationFrame(paso);
    };

    const cargar = async () => {
      if (datos) return;
      const r = await fetch("/datos/vectores.json");
      datos = (await r.json()) as Vectores;
      const c = new Array<number>(22).fill(0);
      datos.sec.forEach((s) => c[s]!++);
      setConteo(c);
      setSeccion(encendida);
      medir();
      dibujar();
      arrancar();
    };

    const vista = new IntersectionObserver(
      ([e]) => {
        visible = !!e?.isIntersecting;
        if (visible) {
          cargar();
          arrancar();
        } else cancelAnimationFrame(cuadro);
      },
      { rootMargin: "300px 0px" },
    );
    vista.observe(canvas);

    const tamanio = new ResizeObserver(() => {
      medir();
      dibujar();
    });
    tamanio.observe(canvas);

    const bajar = (e: PointerEvent) => {
      arrastre = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    };
    const mover = (e: PointerEvent) => {
      if (!arrastre) return;
      giro += (e.clientX - arrastre.x) * 0.008;
      inclinacion = Math.max(-1.2, Math.min(1.2, inclinacion + (e.clientY - arrastre.y) * 0.006));
      arrastre = { x: e.clientX, y: e.clientY };
      if (quieto || !visible) dibujar();
    };
    const soltar = () => (arrastre = null);
    canvas.addEventListener("pointerdown", bajar);
    canvas.addEventListener("pointermove", mover);
    canvas.addEventListener("pointerup", soltar);
    canvas.addEventListener("pointercancel", soltar);

    return () => {
      cancelAnimationFrame(cuadro);
      vista.disconnect();
      tamanio.disconnect();
      canvas.removeEventListener("pointerdown", bajar);
      canvas.removeEventListener("pointermove", mover);
      canvas.removeEventListener("pointerup", soltar);
      canvas.removeEventListener("pointercancel", soltar);
    };
  }, []);

  const t = VISUALES.vectores;
  return (
    <figure className={css.espacio}>
      <div className={css.marco}>
        <canvas ref={lienzo} className={css.lienzo} role="img" aria-label={t.alt[lang]} />
        <span className={`${css.arrastrar} etiqueta`} aria-hidden="true">
          {t.arrastrar[lang]}
        </span>
      </div>
      <figcaption className={css.pie}>
        <p className={css.encendida} aria-live="off">
          <span className="etiqueta">{t.seccion[lang]}</span>
          <span className={css.nombreSeccion}>{seccion === null ? "…" : SECCIONES_LEONARDO[lang][seccion]}</span>
          {seccion !== null && conteo[seccion] !== undefined && (
            <span className={`${css.cuenta} maquina`}>
              {conteo[seccion]} {t.pasajes[lang]}
            </span>
          )}
        </p>
        <p className={`${css.ficha} maquina`}>{t.ficha[lang]}</p>
      </figcaption>
    </figure>
  );
}
