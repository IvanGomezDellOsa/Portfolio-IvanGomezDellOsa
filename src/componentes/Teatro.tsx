"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
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
  getDuration(): number;
  setVolume(volumen: number): void;
  mute(): void;
  unMute(): void;
  setPlaybackRate(velocidad: number): void;
  /** No documentado, pero estable: saca el módulo de subtítulos del reproductor. */
  unloadModule?(modulo: string): void;
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
const CARGANDO_VIDEO = 3;

const escenaEn = (f: Funcion, t: number) => f.escenas.reduce((k, e, i) => (e.t <= t + 0.4 ? i : k), 0);

const VELOCIDADES = [0.75, 1, 1.25, 1.5, 2];
/** Cuánto queda a la vista el mando sin que se mueva el puntero. */
const MANDO_ESPERA = 2600;

const trazo = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function IconoSonido({ mudo }: { mudo: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z" fill="currentColor" />
      {mudo ? <path d="m16 9.5 5 5m0-5-5 5" {...trazo} /> : <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" {...trazo} />}
    </svg>
  );
}

/** El engranaje de Feather (MIT). */
function IconoAjustes() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" {...trazo} />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
        {...trazo}
      />
    </svg>
  );
}

function IconoCompleta({ salir }: { salir: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      {salir ? (
        <path d="M9 4.5V9H4.5M15 4.5V9h4.5M9 19.5V15H4.5M15 19.5V15h4.5" {...trazo} />
      ) : (
        <path d="M4.5 9V4.5H9M19.5 9V4.5H15M4.5 15v4.5H9M19.5 15v4.5H15" {...trazo} />
      )}
    </svg>
  );
}

/**
 * EL TEATRO: el reproductor de los videos, uno por página. Al darle play a
 * cualquier video del sitio, la página se apaga (el telón de fondo baja a
 * negro) y el video arranca A PANTALLA COMPLETA. Al salir de ella (Esc) queda
 * el teatro: el video grande, con sus escenas al lado para saltar a cada una y
 * el video anterior y el siguiente al pie. Es un `<dialog>` nativo: atrapa el
 * foco, se cierra con Esc y devuelve el foco a lo que lo abrió.
 *
 * EL MANDO ES PROPIO, abajo, donde lo tiene YouTube: reproducir, volumen y
 * tiempo a la izquierda; velocidad y pantalla completa a la derecha, bajo la
 * barra de avance (con un corte por escena). El reproductor incrustado de
 * YouTube pone volumen, subtítulos y ajustes arriba a la derecha, donde nadie
 * los busca, así que se lo pide sin controles (`controls: 0`) y se lo maneja
 * por su API. No hay botón de subtítulos: van quemados en la imagen. El mando
 * va DEBAJO de la imagen, no encima: aun sin controles, YouTube dibuja su logo
 * y «Más videos» en el borde de abajo del video, y encima se pisarían.
 *
 * El video se reproduce desde youtube-nocookie. Si el reproductor no carga,
 * queda el enlace a YouTube.
 */
export function Teatro({ lang, funciones }: { lang: Idioma; funciones: Funcion[] }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  const pantalla = useRef<HTMLDivElement>(null);
  const reproductor = useRef<ReproductorYT | null>(null);
  /** Hasta cuándo el reloj no pisa la barra de avance: mientras se la arrastra. */
  const sinPisar = useRef(0);
  const dormir = useRef(0);
  const [pedido, setPedido] = useState<{ i: number; t: number; n: number } | null>(null);
  const [estado, setEstado] = useState<"cargando" | "listo" | "fin" | "error">("cargando");
  const [escena, setEscena] = useState(0);
  const [cerrando, setCerrando] = useState(false);
  /** Si el video no está corriendo: pausado, terminado o todavía sin arrancar. */
  const [enPausa, setEnPausa] = useState(true);
  /** Si ya arrancó alguna vez. Hasta entonces, el clic es de YouTube (ver el velo). */
  const [arranco, setArranco] = useState(false);
  const [tiempo, setTiempo] = useState(0);
  const [total, setTotal] = useState(0);
  const [volumen, setVolumen] = useState(100);
  const [mudo, setMudo] = useState(false);
  const [velocidad, setVelocidad] = useState(1);
  const [menu, setMenu] = useState(false);
  const [completa, setCompleta] = useState(false);
  const [despierto, setDespierto] = useState(true);

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
        setTiempo(t);
        setTotal(funciones[i]!.duracion);
      });
      const d = dialogo.current;
      if (d && !d.open) d.showModal();
      const el = pantalla.current;
      if (!el) return;
      // El foco, en la pantalla: la barra espaciadora pausa el video en vez de
      // apretar «Cerrar», que es lo primero que enfoca el diálogo.
      el.focus({ preventScroll: true });
      // A pantalla completa desde el arranque. Tiene que pedirse acá, dentro
      // del clic. Donde no se puede (iPhone), el video queda en el teatro.
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen({ navigationUI: "hide" })
          .then(() => (screen.orientation as unknown as { lock?: (o: string) => Promise<void> }).lock?.("landscape"))
          .catch(() => {});
      }
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
          reproductor.current.setPlaybackRate(1);
          setVelocidad(1);
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
            // Sin los controles de YouTube: el mando es el de acá abajo.
            controls: 0,
            disablekb: 1,
            fs: 0,
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
              try {
                e.target.unloadModule?.("captions");
              } catch {
                /* Sin el módulo, no hay nada que sacar. */
              }
              e.target.playVideo();
            },
            onStateChange: (e) => {
              if (e.data === FIN) setEstado("fin");
              else if (e.data === REPRODUCIENDO) {
                setEstado("listo");
                setArranco(true);
              }
              setEnPausa(e.data !== REPRODUCIENDO && e.data !== CARGANDO_VIDEO);
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

  // El reloj: el tiempo, la duración y la escena actual siguen al video.
  useEffect(() => {
    if (!f) return;
    const id = window.setInterval(() => {
      const r = reproductor.current;
      if (!r || typeof r.getCurrentTime !== "function") return;
      const t = r.getCurrentTime();
      const d = r.getDuration();
      if (d > 0) setTotal(d);
      if (performance.now() < sinPisar.current) return;
      setTiempo(t);
      if (f.escenas.length) setEscena(escenaEn(f, t));
    }, 250);
    return () => window.clearInterval(id);
  }, [f]);

  useEffect(() => {
    const alCambiar = () => setCompleta(document.fullscreenElement === pantalla.current && !!pantalla.current);
    document.addEventListener("fullscreenchange", alCambiar);
    return () => document.removeEventListener("fullscreenchange", alCambiar);
  }, []);

  /** El mando aparece con cualquier gesto y se retira solo mientras el video corre. */
  const despertar = useCallback(() => {
    setDespierto(true);
    window.clearTimeout(dormir.current);
    dormir.current = window.setTimeout(() => setDespierto(false), MANDO_ESPERA);
  }, []);

  useEffect(() => () => window.clearTimeout(dormir.current), []);

  const cerrar = useCallback(() => {
    const d = dialogo.current;
    if (!d?.open) return;
    setCerrando(true);
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => d.close(), quieto ? 0 : 220);
  }, []);

  /** Al cerrarse (por el botón, Esc o el fondo): el video se detiene y se libera. */
  const alCerrar = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setMenu(false);
    setVelocidad(1);
    reproductor.current?.destroy();
    reproductor.current = null;
    caja.current?.replaceChildren();
    setPedido(null);
    setCerrando(false);
    setEstado("cargando");
    setEnPausa(true);
    setArranco(false);
  };

  const alternar = () => {
    const r = reproductor.current;
    if (!r || typeof r.playVideo !== "function") return;
    if (enPausa) r.playVideo();
    else r.pauseVideo();
    despertar();
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

  /** La barra de avance: el reloj la suelta un momento, para que no salte hacia atrás. */
  const buscar = (t: number) => {
    const r = reproductor.current;
    sinPisar.current = performance.now() + 700;
    setTiempo(t);
    if (f?.escenas.length) setEscena(escenaEn(f, t));
    if (r && typeof r.seekTo === "function") r.seekTo(t, true);
    despertar();
  };

  const ajustarVolumen = (v: number) => {
    const r = reproductor.current;
    setVolumen(v);
    setMudo(v === 0);
    if (!r || typeof r.setVolume !== "function") return;
    r.setVolume(v);
    if (v > 0) r.unMute();
    else r.mute();
  };

  const alternarMudo = () => {
    const r = reproductor.current;
    if (!r || typeof r.mute !== "function") return;
    if (mudo) {
      r.unMute();
      if (volumen === 0) ajustarVolumen(60);
    } else r.mute();
    setMudo(!mudo);
    despertar();
  };

  const elegirVelocidad = (v: number) => {
    reproductor.current?.setPlaybackRate?.(v);
    setVelocidad(v);
    setMenu(false);
  };

  const alternarCompleta = () => {
    const el = pantalla.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else el.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
  };

  /** El teclado de YouTube: espacio o K, las flechas, M y F. */
  const alTecla = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const el = e.target as HTMLElement;
    const enCampo = !!el.closest("input, a");
    const enBoton = !!el.closest("button");
    switch (e.key) {
      case " ":
      case "k":
        if (enCampo || enBoton) return;
        alternar();
        break;
      case "ArrowLeft":
      case "ArrowRight":
        if (enCampo) return;
        buscar(Math.max(0, Math.min(total, tiempo + (e.key === "ArrowLeft" ? -5 : 5))));
        break;
      case "m":
        alternarMudo();
        break;
      case "f":
        alternarCompleta();
        break;
      default:
        return;
    }
    e.preventDefault();
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
        // Con el video a pantalla completa, Esc sólo sale de ella.
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
        else cerrar();
      }}
      onClose={alCerrar}
      onClick={alClic}
      onKeyDown={alTecla}
      style={f ? (variablesDe(f.slug) as CSSProperties) : undefined}
    >
      {f && (
        <div className={css.panel}>
          <header className={css.barra}>
            <div className={css.titulos}>
              <h2 id="teatro-titulo" className={css.titulo}>
                {f.nombre}
              </h2>
            </div>
            <button type="button" className={css.cerrar} onClick={cerrar}>
              {VIDEO.cerrar[lang]}
              <kbd className="maquina" aria-hidden="true">
                Esc
              </kbd>
            </button>
          </header>

          <div className={css.cuerpo} data-escenas={f.escenas.length > 0}>
            <div
              ref={pantalla}
              className={css.pantalla}
              data-estado={estado}
              data-mando={enPausa || despierto || menu || estado !== "listo" ? "visible" : "oculto"}
              tabIndex={-1}
              onPointerMove={despertar}
              onPointerDown={despertar}
            >
              <div className={css.imagen}>
              <img className={css.poster} src={vistaPrevia(f.slug).poster} alt="" />
              <div ref={caja} className={css.lugar} />
              {/*
                El velo recibe los clics: el iframe no toma el foco, y Esc y el teclado siguen siendo del teatro.
                Recién aparece cuando el video arrancó: si el navegador no lo dejó empezar solo, el primer clic
                tiene que caer en el botón de YouTube, que es el único que puede iniciarlo.
              */}
              {arranco && <div className={css.velo} onClick={alternar} onDoubleClick={alternarCompleta} />}
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
                    <Triangulo /> {siguiente.nombre}
                  </button>
                </div>
              )}
              </div>
              {estado !== "error" && (
                <div className={css.mando} style={{ "--p": `${total > 0 ? Math.min(100, (tiempo / total) * 100) : 0}%` } as CSSProperties}>
                  <div className={css.linea}>
                    <input
                      className={css.avance}
                      type="range"
                      min={0}
                      max={Math.max(1, total)}
                      step={0.1}
                      value={Math.min(tiempo, Math.max(1, total))}
                      onChange={(e) => buscar(Number(e.target.value))}
                      aria-label={VIDEO.avance[lang]}
                      aria-valuetext={`${reloj(tiempo)} / ${reloj(total)}`}
                    />
                    {total > 0 &&
                      f.escenas.slice(1).map((e) => <span key={e.t} className={css.corte} style={{ left: `${(e.t / total) * 100}%` }} aria-hidden="true" />)}
                  </div>
                  <div className={css.fila}>
                    <button
                      type="button"
                      className={css.boton}
                      onClick={alternar}
                      disabled={estado === "cargando"}
                      aria-label={enPausa ? VIDEO.reproducir[lang] : VIDEO.pausar[lang]}
                      title={enPausa ? VIDEO.reproducir[lang] : VIDEO.pausar[lang]}
                    >
                      {enPausa ? (
                        <Triangulo lado={15} />
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 12 12" aria-hidden="true">
                          <rect x="2" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
                          <rect x="7.4" y="1.5" width="2.6" height="9" rx="0.6" fill="currentColor" />
                        </svg>
                      )}
                    </button>
                    <div className={css.sonido}>
                      <button
                        type="button"
                        className={css.boton}
                        onClick={alternarMudo}
                        aria-label={mudo ? VIDEO.sonar[lang] : VIDEO.silenciar[lang]}
                        title={mudo ? VIDEO.sonar[lang] : VIDEO.silenciar[lang]}
                      >
                        <IconoSonido mudo={mudo} />
                      </button>
                      <input
                        className={css.nivel}
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={mudo ? 0 : volumen}
                        onChange={(e) => ajustarVolumen(Number(e.target.value))}
                        aria-label={VIDEO.volumen[lang]}
                        style={{ "--p": `${mudo ? 0 : volumen}%` } as CSSProperties}
                      />
                    </div>
                    <span className={`${css.tiempo} maquina`}>
                      {reloj(tiempo)} / {reloj(total)}
                    </span>
                    {f.escenas[escena] && <span className={css.capitulo}>{f.escenas[escena].titulo}</span>}
                    <span className={css.espacio} />
                    <div className={css.ajustes}>
                      <button
                        type="button"
                        className={css.boton}
                        onClick={() => setMenu((v) => !v)}
                        aria-expanded={menu}
                        aria-haspopup="menu"
                        aria-label={VIDEO.velocidad[lang]}
                        title={VIDEO.velocidad[lang]}
                      >
                        <IconoAjustes />
                      </button>
                      {menu && (
                        <div className={css.menu} role="menu" aria-label={VIDEO.velocidad[lang]}>
                          <p className="etiqueta">{VIDEO.velocidad[lang]}</p>
                          {VELOCIDADES.map((v) => (
                            <button key={v} type="button" role="menuitemradio" aria-checked={v === velocidad} onClick={() => elegirVelocidad(v)}>
                              {v === 1 ? VIDEO.normal[lang] : `${String(v).replace(".", lang === "es" ? "," : ".")}×`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className={css.boton}
                      onClick={alternarCompleta}
                      aria-label={completa ? VIDEO.salirCompleta[lang] : VIDEO.completa[lang]}
                      title={completa ? VIDEO.salirCompleta[lang] : VIDEO.completa[lang]}
                    >
                      <IconoCompleta salir={completa} />
                    </button>
                  </div>
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
