import type { CSSProperties, ReactNode } from "react";
import type { SalaId } from "@/contenido/salas";
import { SALA } from "@/contenido/sitio";
import type { Dato, Enlace, Idioma, ImagenCaso, VideoProyecto } from "@/contenido/tipos";
import { Flecha } from "./Iconos";
import { BotonVideo } from "./Pantalla";
import { Texto } from "./Texto";
import css from "./Piezas.module.css";

/**
 * LAS PIEZAS COMUNES DE LAS SALAS Y LOS CASOS: la cota del dato, el stack, los
 * enlaces, los marcos de navegador y de teléfono, y la imagen con `srcset`.
 */

/**
 * EL DATO, COMO UNA COTA DE PLANO: una línea de un pelo con sus topes y el
 * número sentado sobre ella. Es lo medido del proyecto, y por eso va en la voz
 * de máquina. La línea se traza desde el centro cuando la sala se revela.
 */
export function Medicion({ dato, lang, i = 0 }: { dato: Dato; lang: Idioma; i?: number }) {
  return (
    <figure className={css.medicion} style={{ "--i": i } as CSSProperties}>
      <div className={css.cota} aria-hidden="true">
        <span className={`${css.linea} traza`} />
      </div>
      <p className={`${css.valor} maquina aparece`}>{dato.valor[lang]}</p>
      <figcaption className={`${css.etiquetaDato} texto aparece`}>
        <Texto t={dato.etiqueta[lang]} />
        {dato.nota && (
          <span className={`${css.notaDato} maquina`}>
            <Texto t={dato.nota[lang]} />
          </span>
        )}
      </figcaption>
    </figure>
  );
}

export function Stack({ items, lang, i = 0 }: { items: string[]; lang: Idioma; i?: number }) {
  return (
    <div className={`${css.stack} aparece`} style={{ "--i": i } as CSSProperties}>
      <p className="etiqueta">{SALA.stack[lang]}</p>
      <ul className={`${css.lista} maquina`}>
        {items.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

const TEXTO_TIPO = {
  sitio: SALA.sitio,
  repositorio: SALA.repositorio,
  demo: SALA.demo,
  "vista-previa": SALA.vistaPrevia,
  tienda: SALA.tienda,
  descarga: SALA.descarga,
} as const;

/** Lo que se ve con un clic: si el proyecto tiene uno, es la acción principal. */
const EN_VIVO = new Set(["sitio", "tienda", "vista-previa"]);

/**
 * LOS ENLACES DE UN PROYECTO. La acción principal (la pastilla) es el producto
 * en vivo (el sitio, la tienda, la vista previa) o, si no lo hay, el video. El
 * video va siempre, como segunda pastilla cuando no es la principal. El resto,
 * enlaces de línea, y el caso completo, interno, al final.
 */
export function Enlaces({
  enlaces,
  lang,
  caso,
  video,
  i = 0,
  sinPastilla = false,
}: {
  enlaces: Enlace[];
  lang: Idioma;
  caso?: string;
  /** El video del proyecto, con lo que el botón necesita para abrirlo. */
  video?: { slug: SalaId; nombre: string; video: VideoProyecto };
  i?: number;
  sinPastilla?: boolean;
}) {
  const vivo = !sinPastilla && !!enlaces[0] && EN_VIVO.has(enlaces[0].tipo);
  const videoPrincipal = !sinPastilla && !vivo && !!video;
  return (
    <div className={`${css.enlaces} aparece`} style={{ "--i": i } as CSSProperties}>
      {video && videoPrincipal && <BotonVideo {...video} lang={lang} variante="pastilla" />}
      {enlaces.flatMap((e, n) => {
        const href = lang === "en" && e.hrefEn ? e.hrefEn : e.href;
        const texto = (e.texto ?? TEXTO_TIPO[e.tipo])[lang];
        const principal = n === 0 && vivo;
        const enlace = (
          <a key={href} className={principal ? "pastilla" : "enlace-linea"} href={href} target="_blank" rel="noopener noreferrer">
            {texto}
            {e.nota && <span className={css.nota}>{e.nota[lang]}</span>}
            <Flecha />
          </a>
        );
        return principal && video ? [enlace, <BotonVideo key="video" {...video} lang={lang} variante="hueca" />] : [enlace];
      })}
      {video && sinPastilla && <BotonVideo {...video} lang={lang} variante="chip" />}
      {caso && (
        <a className="enlace-linea" href={caso}>
          {SALA.caso[lang]} <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}

/** Una imagen de `public/medios`, con `srcset` si viene en dos anchos. */
export function Imagen({
  src,
  alt,
  ancho,
  alto,
  anchos = [960, 1600],
  tam = "(max-width: 900px) 100vw, 60vw",
  prioridad = false,
  className,
}: {
  src: string;
  alt: string;
  ancho: number;
  alto: number;
  anchos?: number[];
  tam?: string;
  prioridad?: boolean;
  className?: string;
}) {
  const unica = src.endsWith(".webp");
  const ultimo = anchos[anchos.length - 1]!;
  return (
    <img
      className={className}
      src={unica ? src : `${src}-${ultimo}.webp`}
      srcSet={unica ? undefined : anchos.map((a) => `${src}-${a}.webp ${a}w`).join(", ")}
      sizes={unica ? undefined : tam}
      alt={alt}
      width={ancho}
      height={alto}
      loading={prioridad ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

export const imagenDe = (img: ImagenCaso, lang: Idioma, tam?: string) => (
  <Imagen src={img.src[lang]} alt={img.alt[lang]} ancho={img.ancho} alto={img.alto} anchos={img.anchos} tam={tam} />
);

/**
 * EL MARCO DE NAVEGADOR. Lleva la dirección real del sitio en la barra: es
 * información (dónde está en producción), no decoración.
 */
export function Navegador({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  return (
    <figure className={`${css.navegador} ${className ?? ""}`}>
      <div className={css.barraNav} aria-hidden="true">
        <span className={css.candado} />
        <span className={`${css.url} maquina`}>{url}</span>
      </div>
      <div className={css.pantalla}>{children}</div>
    </figure>
  );
}

export function Telefono({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <figure className={`${css.telefono} ${className ?? ""}`}>
      <div className={css.pantallaTel}>{children}</div>
    </figure>
  );
}
