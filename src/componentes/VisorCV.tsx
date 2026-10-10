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
    abrir: "Abrir",
    anterior: "Página anterior",
    siguiente: "Página siguiente",
    alejar: "Alejar",
    acercar: "Acercar",
    enlaces: "Contacto",
    copiar: "Copiar el email",
  },
  en: {
    salir: "Exit",
    abrir: "Open",
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
async function dibujarTapa(acciones: { copiar: () => void; abrir: () => void; rotuloAbrir: string }) {
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

  // A la derecha, al medio y arriba del nombre: «Abrir», la pastilla hueca del sitio, para quien no sabe que la tapa se da vuelta.
  espaciado(-0.005, 46);
  const abrir = pastilla(ctx, { x: W - M, y: 1000, texto: acciones.rotuloAbrir, trazo: CHEVRON, cuerpo: 46, alto: 140, trazoAntes: false, derecha: true, fuente: sans });

  // Abajo: los contactos, cada uno con el ícono de su red; a la derecha, copiar o abrir. Una sola línea fina arriba.
  const zonas: Zona[] = [
    { cara: "tapa", x: (abrir.x - 30) / W, y: (abrir.y - 30) / H, ancho: (abrir.ancho + 60) / W, alto: (abrir.alto + 60) / H, accion: acciones.abrir },
  ];
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

/**
 * La pastilla hueca del sitio (`.pastilla.hueca`: 44 px de alto, letra de
 * 14,5 px, el borde y el fondo apenas marcados), a la escala de la carilla.
 * Con su texto y un trazo (en 24 × 24) antes o después, alineada a la
 * izquierda o a la derecha desde `x`; devuelve su caja.
 */
function pastilla(
  ctx: CanvasRenderingContext2D,
  o: { x: number; y: number; texto: string; trazo: string; cuerpo: number; alto: number; trazoAntes: boolean; derecha: boolean; fuente: string },
) {
  ctx.font = `500 ${o.cuerpo}px ${o.fuente}`;
  ctx.textBaseline = "middle";
  const lado = o.cuerpo * 0.78;
  const sep = o.cuerpo * 0.4;
  const relleno = o.alto * 0.45;
  const ancho = ctx.measureText(o.texto).width + lado + sep + 2 * relleno;
  const x = o.derecha ? o.x - ancho : o.x;
  const y = o.y - o.alto / 2;
  ctx.beginPath();
  ctx.roundRect(x, y, ancho, o.alto, o.alto / 2);
  ctx.fillStyle = "rgb(255 255 255 / 0.04)";
  ctx.fill();
  ctx.lineWidth = 3.2;
  ctx.strokeStyle = "rgb(255 255 255 / 0.2)";
  ctx.stroke();
  const xTrazo = o.trazoAntes ? x + relleno : x + ancho - relleno - lado;
  const xTexto = o.trazoAntes ? xTrazo + lado + sep : x + relleno;
  ctx.fillStyle = "rgb(255 255 255 / 0.94)";
  ctx.textAlign = "left";
  ctx.fillText(o.texto, xTexto, o.y + o.cuerpo * 0.04);
  ctx.save();
  ctx.translate(xTrazo, o.y - lado / 2);
  ctx.scale(lado / 24, lado / 24);
  ctx.strokeStyle = "rgb(255 255 255 / 0.94)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(new Path2D(o.trazo));
  ctx.restore();
  ctx.textBaseline = "alphabetic";
  return { x, y, ancho, alto: o.alto };
}

/** El chevron y la cruz del sitio, en 24 × 24. */
const CHEVRON = "M9 5.25 15.75 12 9 18.75";
const CRUZ = "M6.5 6.5l11 11m0-11-11 11";

/** La contratapa: el fondo de la tapa y, sola en el medio, la pastilla «Salir». */
async function dibujarContratapa(rotulo: string, salir: () => void) {
  const { c, ctx, sans, espaciado } = await lienzo();
  const W = ANCHO;
  const H = ALTO;
  fondo(ctx, H * 0.5);
  espaciado(-0.005, 50);
  ctx.font = `500 50px ${sans}`;
  // Centrada: se mide primero y se dibuja desde su borde izquierdo.
  const ancho = ctx.measureText(rotulo).width + 50 * 0.78 + 50 * 0.4 + 2 * 150 * 0.45;
  const caja = pastilla(ctx, { x: (W - ancho) / 2, y: H / 2, texto: rotulo, trazo: CRUZ, cuerpo: 50, alto: 150, trazoAntes: true, derecha: false, fuente: sans });
  const holgura = 40;
  const zonas: Zona[] = [
    {
      cara: "contratapa",
      x: (caja.x - holgura) / W,
      y: (caja.y - holgura) / H,
      ancho: (caja.ancho + 2 * holgura) / W,
      alto: (caja.alto + 2 * holgura) / H,
      accion: salir,
    },
  ];
  return { lienzo: c, zonas };
}

/**
 * LA VISTA PREVIA DEL CV: una revista de papel en 3D (`lib/libro.ts`) con la
 * tapa y las cuatro carillas (el CV en español y después en inglés): abierta a
 * dos carillas en pantallas anchas, de a una en las angostas. Se pasan las
 * hojas con un clic, arrastrando o con las flechas; tiene zoom (con zoom, el
 * documento se mueve en vertical), abrir o descargar los dos PDF y «Salir»
 * (también Esc, y la contratapa). En la tapa, «Abrir» y el mail se copia. Los
 * controles hablan el idioma de la página. Sin WebGL, las mismas páginas como imágenes.
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
      Promise.all([
        import("@/lib/libro"),
        dibujarTapa({ copiar, abrir: () => libro.current?.siguiente(), rotuloAbrir: t.abrir }),
        dibujarContratapa(t.salir, () => salirActual.current()),
      ])
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
        <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
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
