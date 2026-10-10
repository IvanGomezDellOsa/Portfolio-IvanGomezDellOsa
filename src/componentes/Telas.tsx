"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { HERO, SALA, VIDEO } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import type { MotorTelas } from "@/lib/telas/comun";
import { caso } from "@/lib/rutas";
import { alClicVideo } from "@/lib/teatro";
import { enYoutube, vistaPrevia, type Funcion, type ItemVitrina } from "@/lib/videos";
import { Flecha, Triangulo } from "./Iconos";
import { sinMovimiento } from "./Medios";
import { Reel } from "./Reel";
import css from "./Telas.module.css";

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const conWebgl = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

/**
 * LAS PANTALLAS DE TELA: los nueve proyectos colgados de un hilo, cada uno con
 * un fragmento mudo de su video (o, en los dos sitios web, de su página), en
 * Three.js con la tela de Bullet (`src/lib/telas/motor.ts`). El nombre, los
 * botones y los tramos quedan en HTML, debajo: el canvas es decorado y va
 * `aria-hidden`; todo lo que se puede hacer con él se puede hacer con el
 * teclado desde los tramos y las flechas.
 *
 * Sin WebGL, con movimiento reducido o ahorro de datos, se ve el reel.
 */
export function Telas({ lang, items, funciones }: { lang: Idioma; items: ItemVitrina[]; funciones: Funcion[] }) {
  const lista = items;
  const escenario = useRef<HTMLDivElement>(null);
  const motor = useRef<MotorTelas | null>(null);
  const [i, setI] = useState(0);
  const [modo, setModo] = useState<"cargando" | "telas" | "reel">("cargando");

  useEffect(() => {
    if (sinMovimiento() || !conWebgl()) {
      setModo("reel");
      return;
    }
    let vivo = true;
    import("@/lib/telas/motor")
      .then(async ({ crearTelas }) => {
        if (!vivo || !escenario.current) return;
        const m = await crearTelas({
          contenedor: escenario.current,
          telas: lista.map((f) => ({
            slug: f.slug,
            poster: vistaPrevia(f.slug).poster.replace("-1280", "-640"),
            video: vistaPrevia(f.slug).chico,
            marca: f.marca,
            acento: f.acento,
          })),
          alCambiar: setI,
          alListo: () => setModo("telas"),
        });
        if (vivo) motor.current = m;
        else m.destruir();
      })
      .catch(() => setModo("reel"));
    return () => {
      vivo = false;
      motor.current?.destruir();
      motor.current = null;
    };
    // La lista sale de props fijas de la página: se arma una sola vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (modo === "reel")
    return (
      <div className={css.reelQuieto}>
        <Reel lang={lang} funciones={funciones} />
      </div>
    );

  const f = lista[i] ?? lista[0];
  if (!f) return null;

  const ir = (k: number) => {
    setI(k);
    motor.current?.ir(k);
  };
  const alTeclear = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") ir((i + 1) % lista.length);
    else if (e.key === "ArrowLeft") ir((i - 1 + lista.length) % lista.length);
    else return;
    e.preventDefault();
  };

  return (
    <figure className={css.telas} style={{ "--brillo": f.acento } as CSSProperties} data-modo={modo} onKeyDown={alTeclear}>
      <figcaption className="sr">{HERO.reel[lang]}</figcaption>
      <div ref={escenario} className={css.escenario}>
        {/* Mientras llega Three: el primer proyecto, quieto, donde va a estar su tela. */}
        <img className={css.espera} src={vistaPrevia(lista[0]!.slug).poster} alt="" width={1280} height={720} decoding="async" />
      </div>
      <div className={css.pie} style={{ "--tinte": f.acento } as CSSProperties}>
        {/* Qué proyecto es, como una fila de la lista (su punto y su nombre), entre las dos flechas. */}
        <div className={css.elegido}>
          <button type="button" className={`${css.flecha} ${css.anterior}`} onClick={() => ir((i - 1 + lista.length) % lista.length)} aria-label={SALA.anterior[lang]}>
            <Chevron />
          </button>
          <p key={f.slug} className={css.titulo} aria-hidden="true">
            <span className={css.punto} />
            <span className={css.nombre}>{f.nombre}</span>
          </p>
          <button type="button" className={`${css.flecha} ${css.siguiente}`} onClick={() => ir((i + 1) % lista.length)} aria-label={SALA.siguiente[lang]}>
            <Chevron />
          </button>
        </div>
        {/* Lo que se hace con el elegido: las dos pastillas del sitio. */}
        <div className={css.botones}>
          {f.video ? (
            <a className={`pastilla ${css.ver}`} href={enYoutube(f.video.id)} target="_blank" rel="noopener noreferrer" onClick={(e) => alClicVideo(e, f.slug)}>
              <Triangulo lado={11} />
              {VIDEO.presentacion[lang]}
              <span className="sr">: {f.nombre}</span>
            </a>
          ) : f.sitio ? (
            <a className={`pastilla ${css.ver}`} href={f.sitio} target="_blank" rel="noopener noreferrer">
              {HERO.verSitio[lang]}
              <span className="sr">: {f.nombre}</span>
              <Flecha lado={13} />
            </a>
          ) : null}
          <a className="pastilla hueca" href={caso(lang, f.slug)}>
            {HERO.proyecto[lang]}
            <span className="sr">: {f.nombre}</span>
          </a>
        </div>
        {/* Dónde se está entre los nueve: un tramo por proyecto. Los nombres están en la lista, justo debajo. */}
        <ol className={css.barras} aria-label={HERO.reel[lang]}>
          {lista.map((x, k) => (
            <li key={x.slug}>
              <button type="button" onClick={() => ir(k)} aria-current={k === i ? "true" : undefined}>
                <span className={css.pista} aria-hidden="true" />
                <span className="sr">{x.nombre}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
