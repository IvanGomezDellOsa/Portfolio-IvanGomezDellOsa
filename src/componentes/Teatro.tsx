"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { variablesDe } from "@/contenido/salas";
import { VIDEO } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import { ABRIR_TEATRO, type PedidoTeatro } from "@/lib/teatro";
import { enYoutube, reloj, vistaPrevia, type Funcion } from "@/lib/videos";
import { Triangulo } from "./Iconos";
import css from "./Teatro.module.css";

/** Lo mínimo de la API de iframes de YouTube que se usa acá. */
interface ReproductorYT {
  loadVideoById(o: { videoId: string; startSeconds?: number }): void;
  seekTo(segundos: number, permitirBuscar: boolean): void;
  playVideo(): void;
  pauseVideo(): void;
  getCurrentTime(): number;
  destroy(): void;
}

interface ApiYT {
  Player: new (
    el: HTMLElement,
    o: {
      host?: string;
      videoId: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: { target: ReproductorYT }) => void;
        onStateChange?: (e: { data: number }) => void;
        onError?: () => void;
      };
    },
  ) => ReproductorYT;
}

declare global {
  interface Window {
    YT?: ApiYT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * La API se pide recién con el primer play: quien no mira ningún video no
 * descarga nada de YouTube ni recibe sus cookies.
 */
let cargaApi: Promise<ApiYT> | null = null;
function cargarApi(): Promise<ApiYT> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  cargaApi ??= new Promise<ApiYT>((ok, mal) => {
    const previo = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previo?.();
      if (window.YT) ok(window.YT);
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    s.onerror = () => {
      cargaApi = null;
      mal(new Error("No cargó la API de YouTube"));
    };
    document.head.appendChild(s);
  });
  return cargaApi;
}

const FIN = 0;
const REPRODUCIENDO = 1;
const PAUSADO = 2;

const escenaEn = (f: Funcion, t: number) => f.escenas.reduce((k, e, i) => (e.t <= t + 0.4 ? i : k), 0);

/**
 * EL TEATRO: el reproductor de los videos, uno por página. Al darle play a
 * cualquier video del sitio, la página se apaga (el telón de fondo baja a
 * negro) y el video se ve grande, con sus escenas al lado para saltar a cada
 * una y el video anterior y el siguiente al pie. Es un `<dialog>` nativo:
 * atrapa el foco, se cierra con Esc y devuelve el foco a lo que lo abrió.
 *
 * El video se reproduce desde youtube-nocookie. Si el reproductor no carga,
 * queda el enlace a YouTube.
 */
export function Teatro({ lang, funciones }: { lang: Idioma; funciones: Funcion[] }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const reproductor = useRef<ReproductorYT | null>(null);
  const [pedido, setPedido] = useState<{ i: number; t: number; n: number } | null>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "fin" | "error">("cargando");
  const [escena, setEscena] = useState(0);
  const [cerrando, setCerrando] = useState(false);
  const [enPausa, setEnPausa] = useState(false);

  const f = pedido ? funciones[pedido.i] : undefined;
  const anterior = pedido ? funciones[(pedido.i - 1 + funciones.length) % funciones.length] : undefined;
  const siguiente = pedido ? funciones[(pedido.i + 1) % funciones.length] : undefined;

  // Abrir: el pedido llega como evento desde cualquier botón de video.
  useEffect(() => {
    window.__teatro = true;
    const abrir = (e: Event) => {
      const { slug, t } = (e as CustomEvent<PedidoTeatro>).detail;
      const i = funciones.findIndex((x) => x.slug === slug);
      if (i < 0) return;
      // Sincrónico: el contenido tiene que existir antes de `showModal`, para
      // que el diálogo le dé el foco al primer control.
      flushSync(() => {
        setPedido((p) => ({ i, t, n: (p?.n ?? 0) + 1 }));
        setEscena(escenaEn(funciones[i]!, t));
        setCerrando(false);
      });
      const d = dialogo.current;
      if (d && !d.open) d.showModal();
    };
    window.addEventListener(ABRIR_TEATRO, abrir);
    return () => {
      window.removeEventListener(ABRIR_TEATRO, abrir);
      window.__teatro = false;
    };
  }, [funciones]);

  // El reproductor: se crea con el primer pedido y después sólo cambia de video.
  useEffect(() => {
    if (!pedido) return;
    const video = funciones[pedido.i];
    if (!video) return;
    let vigente = true;
    const espera = window.setTimeout(() => vigente && setEstado((s) => (s === "cargando" ? "error" : s)), 15000);
    cargarApi()
      .then((api) => {
        if (!vigente) return;
        if (reproductor.current) {
          reproductor.current.loadVideoById({ videoId: video.id, startSeconds: pedido.t });
          setEstado("listo");
          return;
        }
        const lugar = caja.current;
        if (!lugar) return;
        // YouTube reemplaza el elemento por su iframe: siempre uno nuevo.
        const el = document.createElement("div");
        lugar.replaceChildren(el);
        setEstado("cargando");
        reproductor.current = new api.Player(el, {
          host: "https://www.youtube-nocookie.com",
          videoId: video.id,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            start: Math.floor(pedido.t),
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
            iv_load_policy: 3,
            // Los subtítulos en español ya están en la imagen: las pistas de
            // YouTube quedan apagadas para no verlos dos veces.
            cc_load_policy: 0,
            hl: lang,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              setEstado("listo");
              e.target.playVideo();
            },
            onStateChange: (e) => {
              if (e.data === FIN) setEstado("fin");
              else if (e.data === REPRODUCIENDO) setEstado("listo");
              setEnPausa(e.data === PAUSADO || e.data === FIN);
            },
            onError: () => setEstado("error"),
          },
        });
      })
      .catch(() => vigente && setEstado("error"));
    return () => {
      vigente = false;
      window.clearTimeout(espera);
    };
  }, [pedido, funciones, lang]);

  // La escena actual sigue al video.
  useEffect(() => {
    if (!f?.escenas.length) return;
    const id = window.setInterval(() => {
      const r = reproductor.current;
      if (!r || typeof r.getCurrentTime !== "function") return;
      setEscena(escenaEn(f, r.getCurrentTime()));
    }, 500);
    return () => window.clearInterval(id);
  }, [f]);

  const cerrar = useCallback(() => {
    const d = dialogo.current;
    if (!d?.open) return;
    setCerrando(true);
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => d.close(), quieto ? 0 : 220);
  }, []);

  /** Al cerrarse (por el botón, Esc o el fondo): el video se detiene y se libera. */
  const alCerrar = () => {
    reproductor.current?.destroy();
    reproductor.current = null;
    caja.current?.replaceChildren();
    setPedido(null);
    setCerrando(false);
    setEstado("cargando");
    setEnPausa(false);
  };

  const alternar = () => {
    const r = reproductor.current;
    if (!r) return;
    if (enPausa) r.playVideo();
    else r.pauseVideo();
  };

  const irA = (t: number, i: number) => {
    const r = reproductor.current;
    setEscena(i);
    if (r && typeof r.seekTo === "function") {
      r.seekTo(t, true);
      r.playVideo();
      setEstado("listo");
    } else if (pedido) setPedido({ ...pedido, t, n: pedido.n + 1 });
  };

  const cambiar = (destino: Funcion | undefined) => {
    if (!destino || !pedido) return;
    setPedido({ i: funciones.indexOf(destino), t: 0, n: pedido.n + 1 });
    setEscena(0);
  };

  // Un clic en el telón (fuera del panel) también cierra.
  const alClic = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) cerrar();
  };

  return (
    <dialog
      ref={dialogo}
      className={css.teatro}
      data-cerrando={cerrando || undefined}
      aria-labelledby="teatro-titulo"
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      onClose={alCerrar}
      onClick={alClic}
      style={f ? (variablesDe(f.slug) as CSSProperties) : undefined}
    >
      {f && (
        <div className={css.panel}>
          <header className={css.barra}>
            <div className={css.titulos}>
              <h2 id="teatro-titulo" className={css.titulo}>
                {f.nombre}
                <span className={`${css.duracion} maquina`}>{reloj(f.duracion)}</span>
              </h2>
            </div>
            <div className={css.controles}>
              {/* Pausa y reproducir, arriba a la derecha: junto al «copiar enlace» de YouTube. */}
              <button
                type="button"
                className={css.alternar}
                onClick={alternar}
                disabled={estado === "cargando" || estado === "error"}
                aria-label={enPausa ? VIDEO.reproducir[lang] : VIDEO.pausar[lang]}
              >
                {enPausa ? (
                  <Triangulo lado={12} />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <rect x="2" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
                    <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
                  </svg>
                )}
              </button>
            <button type="button" className={css.cerrar} onClick={cerrar}>
              {VIDEO.cerrar[lang]}
              <kbd className="maquina" aria-hidden="true">
                Esc
              </kbd>
            </button>
            </div>
          </header>

          <div className={css.cuerpo} data-escenas={f.escenas.length > 0}>
            <div className={css.pantalla} data-estado={estado}>
              <img className={css.poster} src={vistaPrevia(f.slug).poster} alt="" />
              <div ref={caja} className={css.lugar} />
              {estado === "error" && (
                <div className={css.aviso}>
                  <p>{VIDEO.sinReproductor[lang]}</p>
                  <a className="pastilla" href={enYoutube(f.id)} target="_blank" rel="noopener noreferrer">
                    {VIDEO.enYoutube[lang]} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
              {estado === "fin" && siguiente && siguiente !== f && (
                <div className={css.aviso}>
                  <p className="etiqueta">{VIDEO.siguiente[lang]}</p>
                  <button type="button" className="pastilla" onClick={() => cambiar(siguiente)}>
                    <Triangulo /> {siguiente.nombre} <span className="maquina">{reloj(siguiente.duracion)}</span>
                  </button>
                </div>
              )}
            </div>

            {f.escenas.length > 0 && (
              <nav className={css.escenas} aria-label={`${VIDEO.escenas[lang]}: ${f.nombre}`}>
                <p className="etiqueta">{VIDEO.escenas[lang]}</p>
                <ol>
                  {f.escenas.map((e, i) => (
                    <li key={e.t}>
                      <button type="button" aria-current={i === escena ? "true" : undefined} onClick={() => irA(e.t, i)}>
                        <span className="maquina">{reloj(e.t)}</span>
                        <span>{e.titulo}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>

          <footer className={css.pie}>
            {anterior && anterior !== f ? (
              <button type="button" className={css.paso} onClick={() => cambiar(anterior)}>
                <span className="etiqueta">
                  <span aria-hidden="true">← </span>
                  {VIDEO.anterior[lang]}
                </span>
                <span className={css.nombrePaso}>{anterior.nombre}</span>
              </button>
            ) : (
              <span />
            )}
            <a className="enlace-linea" href={enYoutube(f.id)} target="_blank" rel="noopener noreferrer">
              {VIDEO.enYoutube[lang]} <span aria-hidden="true">↗</span>
            </a>
            {siguiente && siguiente !== f ? (
              <button type="button" className={`${css.paso} ${css.pasoSiguiente}`} onClick={() => cambiar(siguiente)}>
                <span className="etiqueta">
                  {VIDEO.siguiente[lang]}
                  <span aria-hidden="true"> →</span>
                </span>
                <span className={css.nombrePaso}>{siguiente.nombre}</span>
              </button>
            ) : (
              <span />
            )}
          </footer>
        </div>
      )}
    </dialog>
  );
}
