"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EMAIL, GITHUB, LINKEDIN, NAV, NOMBRE } from "@/contenido/sitio";
import type { EstadoLibro, Libro, Zona } from "@/lib/libro";
import { sinMovimiento } from "./Medios";
import { TRAZOS } from "./Iconos";
import { MenuCV } from "./MenuCV";
import css from "./VisorCV.module.css";

const TEXTOS = {
  es: {
    salir: "Salir",
    anterior: "Página anterior",
    siguiente: "Página siguiente",
    alejar: "Alejar",
    acercar: "Acercar",
    enlaces: "Contacto",
    copiar: "Copiar el email",
  },
  en: {
    salir: "Exit",
    anterior: "Previous page",
    siguiente: "Next page",
    alejar: "Zoom out",
    acercar: "Zoom in",
    enlaces: "Contact",
    copiar: "Copy the email",
  },
} as const;

/** Las páginas, en el orden del libro: el CV en español y después en inglés. */
const PAGINAS = ["/cv/paginas/es-1.webp", "/cv/paginas/es-2.webp", "/cv/paginas/en-1.webp", "/cv/paginas/en-2.webp"];

/** El ícono de copiar (en 24 × 24, para trazar): dos hojas superpuestas. */
const COPIAR = "M9 9h11v11H9zM5 15V4h11";

/** Los de la tapa: el mail se copia (sin href); LinkedIn y GitHub se abren. */
const ENLACES = [
  { rotulo: "Email", valor: EMAIL, href: undefined, icono: TRAZOS.mail },
  { rotulo: "LinkedIn", valor: LINKEDIN.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), href: LINKEDIN, icono: TRAZOS.linkedin },
  { rotulo: "GitHub", valor: GITHUB.replace(/^https:\/\//, ""), href: GITHUB, icono: TRAZOS.github },
];

const ANCHO = 1955;
const ALTO = 2530;
const MARGEN = 180;

/** Un lienzo del tamaño de las carillas, con las tipografías del sitio ya cargadas. */
async function lienzo() {
  const raiz = getComputedStyle(document.documentElement);
  const sans = raiz.getPropertyValue("--f-sans").trim() || "sans-serif";
  const mono = raiz.getPropertyValue("--f-maquina").trim() || "monospace";
  await Promise.all([document.fonts.load(`600 200px ${sans}`), document.fonts.load(`400 60px ${sans}`), document.fonts.load(`400 40px ${mono}`)]).catch(() => {});
  const c = document.createElement("canvas");
  c.width = ANCHO;
  c.height = ALTO;
  const ctx = c.getContext("2d")!;
  const espaciado = (em: number, px: number) => {
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${em * px}px`;
  };
  return { c, ctx, sans, mono, espaciado };
}

/** El fondo de las tapas: negro neutro, una luz tenue y la retícula de un pelo que se apaga hacia afuera. */
function fondo(ctx: CanvasRenderingContext2D, centroY: number) {
  const W = ANCHO;
  const H = ALTO;
  ctx.fillStyle = "#0f0f10";
  ctx.fillRect(0, 0, W, H);
  const luz = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.62);
  luz.addColorStop(0, "rgb(255 255 255 / 0.085)");
  luz.addColorStop(1, "rgb(255 255 255 / 0)");
  ctx.fillStyle = luz;
  ctx.fillRect(0, 0, W, H);
  const reticula = document.createElement("canvas");
  reticula.width = W;
  reticula.height = H;
  const r = reticula.getContext("2d")!;
  r.strokeStyle = "rgb(255 255 255 / 0.06)";
  r.lineWidth = 2;
  const paso = 120;
  for (let x = (W / 2) % paso; x < W; x += paso) r.strokeRect(x, -2, 0, H + 4);
  for (let y = 0; y < H; y += paso) r.strokeRect(-2, y, W + 4, 0);
  r.globalCompositeOperation = "destination-in";
  const mascara = r.createRadialGradient(W / 2, centroY, 0, W / 2, centroY, W * 0.85);
  mascara.addColorStop(0, "#000");
  mascara.addColorStop(0.45, "#000");
  mascara.addColorStop(1, "transparent");
  r.fillStyle = mascara;
  r.fillRect(0, 0, W, H);
  ctx.drawImage(reticula, 0, 0);
}

/**
 * La tapa, en el tono del sitio: arriba el rótulo y los dos idiomas; el nombre
 * entero en un renglón (la letra se ajusta al ancho), el puesto, y abajo los
 * tres contactos, cada uno con el ícono de su red: el mail se copia (ícono de
 * copiar), LinkedIn y GitHub se abren (una flecha). Se tocan sobre el libro.
 */
async function dibujarTapa(acciones: { copiar: () => void }) {
  const { c, ctx, sans, mono, espaciado } = await lienzo();
  const W = ANCHO;
  const H = ALTO;
  const M = MARGEN;
  fondo(ctx, H * 0.3);

  // Arriba: el rótulo y los idiomas, en la monoespaciada.
  ctx.textBaseline = "alphabetic";
  ctx.font = `400 40px ${mono}`;
  espaciado(0.2, 40);
  ctx.fillStyle = "rgb(255 255 255 / 0.5)";
  ctx.fillText("CURRICULUM VITAE", M, 250);
  ctx.textAlign = "right";
  ctx.fillText("ESPAÑOL · ENGLISH", W - M, 250);
  ctx.textAlign = "left";

  // El nombre, entero en un renglón: la letra se achica hasta que entra en el ancho.
  const ancho = W - 2 * M;
  let cuerpo = 230;
  const medir = () => {
    ctx.font = `600 ${cuerpo}px ${sans}`;
    espaciado(-0.05, cuerpo);
    return ctx.measureText(NOMBRE).width;
  };
  while (medir() > ancho && cuerpo > 80) cuerpo -= 2;
  const base = 1580;
  const degrade = ctx.createLinearGradient(0, base - cuerpo * 0.8, 0, base + cuerpo * 0.2);
  degrade.addColorStop(0, "#fafafa");
  degrade.addColorStop(1, "#b4b4b4");
  ctx.fillStyle = degrade;
  ctx.fillText(NOMBRE, M - cuerpo * 0.04, base);
  ctx.font = `400 76px ${sans}`;
  espaciado(-0.02, 76);
  ctx.fillStyle = "rgb(255 255 255 / 0.58)";
  ctx.fillText("Full Stack Developer", M, base + 130);

  // Abajo: los contactos, cada uno con el ícono de su red; a la derecha, copiar o abrir. Una sola línea fina arriba.
  const zonas: Zona[] = [];
  const primero = H - 520;
  const renglon = 128;
  const icono = 54;
  ctx.fillStyle = "rgb(255 255 255 / 0.1)";
  ctx.fillRect(M, primero - 120, ancho, 2);
  ENLACES.forEach((e, i) => {
    const y = primero + i * renglon;
    ctx.save();
    ctx.translate(M, y - icono * 0.82);
    ctx.scale(icono / 24, icono / 24);
    ctx.fillStyle = "rgb(255 255 255 / 0.7)";
    ctx.fill(new Path2D(e.icono));
    ctx.restore();
    ctx.font = `400 56px ${sans}`;
    espaciado(-0.01, 56);
    ctx.fillStyle = "rgb(255 255 255 / 0.88)";
    ctx.fillText(e.valor, M + icono + 44, y);
    if (e.href) {
      ctx.font = `400 50px ${sans}`;
      ctx.textAlign = "right";
      ctx.fillStyle = "rgb(255 255 255 / 0.32)";
      ctx.fillText("↗", W - M, y);
      ctx.textAlign = "left";
    } else {
      const lado = 46;
      ctx.save();
      ctx.translate(W - M - lado, y - lado * 0.86);
      ctx.scale(lado / 24, lado / 24);
      ctx.strokeStyle = "rgb(255 255 255 / 0.4)";
      ctx.lineWidth = 1.8;
      ctx.lineJoin = "round";
      ctx.stroke(new Path2D(COPIAR));
      ctx.restore();
    }
    const href = e.href;
    zonas.push({
      cara: "tapa",
      x: M / W,
      y: (y - renglon * 0.68) / H,
      ancho: ancho / W,
      alto: renglon / H,
      accion: href ? () => window.open(href, "_blank", "noopener") : acciones.copiar,
    });
  });
  return { lienzo: c, zonas };
}

/** La contratapa: el mismo fondo y, al medio, «Salir» en una pastilla; abajo, el nombre chico. */
async function dibujarContratapa(rotulo: string, salir: () => void) {
  const { c, ctx, sans, mono, espaciado } = await lienzo();
  const W = ANCHO;
  const H = ALTO;
  fondo(ctx, H * 0.5);

  ctx.textBaseline = "middle";
  ctx.font = `500 80px ${sans}`;
  espaciado(-0.01, 80);
  const texto = ctx.measureText(rotulo).width;
  const cruz = 46;
  const separacion = 34;
  const alto = 176;
  const ancho = texto + cruz + separacion + 2 * 92;
  const x = (W - ancho) / 2;
  const y = H / 2 - alto / 2;
  ctx.beginPath();
  ctx.roundRect(x, y, ancho, alto, alto / 2);
  ctx.fillStyle = "rgb(255 255 255 / 0.06)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgb(255 255 255 / 0.22)";
  ctx.stroke();
  const cx = x + 92;
  ctx.beginPath();
  ctx.moveTo(cx, H / 2 - cruz / 2);
  ctx.lineTo(cx + cruz, H / 2 + cruz / 2);
  ctx.moveTo(cx + cruz, H / 2 - cruz / 2);
  ctx.lineTo(cx, H / 2 + cruz / 2);
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgb(255 255 255 / 0.85)";
  ctx.stroke();
  ctx.fillStyle = "rgb(255 255 255 / 0.92)";
  ctx.fillText(rotulo, cx + cruz + separacion, H / 2 + 4);

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.font = `400 40px ${mono}`;
  espaciado(0.2, 40);
  ctx.fillStyle = "rgb(255 255 255 / 0.4)";
  ctx.fillText(NOMBRE.toUpperCase(), W / 2, H - 250);

  // Se toca un poco más que la pastilla: es el único botón de la carilla.
  const holgura = 60;
  const zonas: Zona[] = [
    { cara: "contratapa", x: (x - holgura) / W, y: (y - holgura) / H, ancho: (ancho + 2 * holgura) / W, alto: (alto + 2 * holgura) / H, accion: salir },
  ];
  return { lienzo: c, zonas };
}

/**
 * LA VISTA PREVIA DEL CV: una revista de papel en 3D (`lib/libro.ts`) con la
 * tapa y las cuatro carillas (el CV en español y después en inglés): abierta a
 * dos carillas en pantallas anchas, de a una en las angostas. Se pasan las
 * hojas con un clic, arrastrando o con las flechas; tiene zoom (con zoom, el
 * documento se mueve en vertical), abrir o descargar los dos PDF y «Salir»
 * (también Esc, y la contratapa). En la tapa, el mail se copia. Los controles hablan el idioma que
 * se eligió en el botón «CV». Sin WebGL, las mismas páginas como imágenes.
 */
export function VisorCV({ idioma, alCerrar }: { idioma: "es" | "en"; alCerrar: () => void }) {
  const t = TEXTOS[idioma];
  const escenario = useRef<HTMLDivElement>(null);
  const libro = useRef<Libro | null>(null);
  const [estado, setEstado] = useState<EstadoLibro>({ paso: 0, pasos: PAGINAS.length + 1, doble: false });
  const [zoom, setZoom] = useState(1);
  const [plano, setPlano] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const aviso = useRef(0);
  const copiar = () => {
    navigator.clipboard?.writeText(EMAIL).then(
      () => {
        setCopiado(true);
        window.clearTimeout(aviso.current);
        aviso.current = window.setTimeout(() => setCopiado(false), 1800);
      },
      () => {},
    );
  };
  // Las acciones del lienzo, siempre las de ahora.
  const salirActual = useRef(alCerrar);
  salirActual.current = alCerrar;
  const { paso, pasos } = estado;

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    let vivo = true;
    let webgl = false;
    try {
      webgl = !!document.createElement("canvas").getContext("webgl2");
    } catch {
      /* Sin WebGL: las imágenes planas. */
    }
    if (!webgl) setPlano(true);
    else
      Promise.all([import("@/lib/libro"), dibujarTapa({ copiar }), dibujarContratapa(t.salir, () => salirActual.current())])
        .then(([{ crearLibro }, tapa, contratapa]) => {
          if (!vivo || !escenario.current) return;
          libro.current = crearLibro(escenario.current, {
            tapa: tapa.lienzo,
            contratapa: contratapa.lienzo,
            paginas: PAGINAS,
            zonas: [...tapa.zonas, ...contratapa.zonas],
            quieto: sinMovimiento(),
            alCambiar: setEstado,
          });
        })
        .catch(() => setPlano(true));
    return () => {
      vivo = false;
      window.clearTimeout(aviso.current);
      libro.current?.destruir();
      libro.current = null;
      document.documentElement.style.overflow = "";
      previo?.focus();
    };
  }, [idioma]);

  // Sin WebGL, las imágenes planas avanzan de a una.
  const siguiente = () => (libro.current ? libro.current.siguiente() : setEstado((e) => ({ ...e, paso: Math.min(e.pasos - 1, e.paso + 1) })));
  const anterior = () => (libro.current ? libro.current.anterior() : setEstado((e) => ({ ...e, paso: Math.max(0, e.paso - 1) })));
  // El zoom va de a 10 %, entre 100 % y 300 %. Parte siempre del último valor, aunque se aprieten varias teclas seguidas.
  const zoomActual = useRef(1);
  const acercar = (paso: number) => {
    const n = Math.min(3, Math.max(1, Math.round((zoomActual.current + paso) * 10) / 10));
    zoomActual.current = n;
    setZoom(n);
    libro.current?.zoom(n);
  };

  // El teclado: flechas para las hojas, + y − para el zoom, Esc para salir.
  const actual = useRef({ siguiente, anterior });
  actual.current = { siguiente, anterior };
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") alCerrar();
      else if (e.key === "ArrowRight") actual.current.siguiente();
      else if (e.key === "ArrowLeft") actual.current.anterior();
      else if (e.key === "+" || e.key === "=") acercar(0.1);
      else if (e.key === "-") acercar(-0.1);
    };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  });

  return createPortal(
    <div className={css.visor} role="dialog" aria-modal="true" aria-label={`CV · ${NOMBRE}`} lang={idioma}>
      <div className={css.fondo} aria-hidden="true">
        <span>CV</span>
      </div>
      <div ref={escenario} className={css.escenario}>
        {plano && (
          <img
            className={css.plana}
            src={PAGINAS[Math.max(0, paso - 1)]}
            alt={`CV · ${NOMBRE}`}
            onClick={siguiente}
          />
        )}
      </div>
      <div className={css.grano} aria-hidden="true" />
      <div className={css.vineta} aria-hidden="true" />

      <button type="button" className={css.salir} onClick={alCerrar} autoFocus>
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="m3.5 3.5 9 9m0-9-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {t.salir}
      </button>


      {/* Los enlaces de la tapa, también para el teclado y los lectores de pantalla. */}
      <ul className={css.oculto} aria-label={t.enlaces}>
        {ENLACES.map((e) => (
          <li key={e.rotulo}>
            {e.href ? (
              <a href={e.href} target="_blank" rel="noopener noreferrer">
                {e.rotulo}: {e.valor}
              </a>
            ) : (
              <button type="button" onClick={copiar}>
                {t.copiar}: {e.valor}
              </button>
            )}
          </li>
        ))}
      </ul>

      <p className={css.aviso} role="status" data-visible={copiado || undefined}>
        {copiado ? NAV.cvCopiado[idioma] : ""}
      </p>

      <div className={css.barra}>
        <div className={css.grupo}>
          <button type="button" className={css.boton} onClick={anterior} disabled={paso === 0} aria-label={t.anterior}>
            ‹
          </button>
          <button type="button" className={css.boton} onClick={siguiente} disabled={paso === pasos - 1} aria-label={t.siguiente}>
            ›
          </button>
        </div>
        <span className={css.separador} aria-hidden="true" />
        <div className={css.grupo}>
          <button type="button" className={css.boton} onClick={() => acercar(-0.1)} disabled={zoom <= 1} aria-label={t.alejar}>
            −
          </button>
          <span className={css.valor} aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button type="button" className={css.boton} onClick={() => acercar(0.1)} disabled={zoom >= 3} aria-label={t.acercar}>
            +
          </button>
        </div>
        <span className={css.separador} aria-hidden="true" />
        {/* El PDF de siempre, en otra pestaña, y la descarga: el mismo botón «CV» del sitio, con sus gotas Español y English. */}
        <MenuCV lang={idioma} variante="pestana" />
        <MenuCV lang={idioma} variante="descarga" />
      </div>
    </div>,
    document.body,
  );
}
