import type { CSSProperties, ReactNode } from "react";
import { SALA } from "@/contenido/sitio";
import type { Dato, Enlace, Idioma, TipoEnlace } from "@/contenido/tipos";
import { IconoDescarga, IconoExtension, IconoGithub, IconoWeb } from "./Iconos";
import { Texto } from "./Texto";
import css from "./Piezas.module.css";

/**
 * LAS PIEZAS COMUNES DE LA PAGINA DE UN PROYECTO: la cota del dato, el stack,
 * los enlaces, el marco de teléfono y la imagen con `srcset`.
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

/** El stack: el rótulo y los chips. `sinRotulo`, sólo los chips (la primera versión). */
export function Stack({ items, lang, i = 0, sinRotulo = false }: { items: string[]; lang: Idioma; i?: number; sinRotulo?: boolean }) {
  return (
    <div className={`${css.stack} aparece`} style={{ "--i": i } as CSSProperties}>
      {!sinRotulo && <p className="etiqueta">{SALA.stack[lang]}</p>}
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

/** Lo que se ve con un clic: el producto en vivo. */
export const EN_VIVO: ReadonlySet<TipoEnlace> = new Set<TipoEnlace>(["sitio", "tienda", "vista-previa"]);

function IconoEnlace({ tipo }: { tipo: TipoEnlace }) {
  if (tipo === "repositorio") return <IconoGithub lado={16} />;
  if (tipo === "tienda") return <IconoExtension lado={16} />;
  if (tipo === "descarga") return <IconoDescarga lado={16} />;
  return <IconoWeb lado={16} />;
}

/**
 * LOS ENLACES DE UN PROYECTO: una sola clase de botón, la pastilla hueca del
 * sitio, cada una con el ícono de su destino (los mismos de la lista de
 * proyectos). Todos abren afuera. La acción llena de la página es la del
 * video, en su pantalla: acá no compite ninguna.
 */
export function Enlaces({ enlaces, lang, className }: { enlaces: Enlace[]; lang: Idioma; className?: string }) {
  return (
    <ul className={`${css.enlaces} ${className ?? ""}`}>
      {enlaces.map((e) => {
        const href = lang === "en" && e.hrefEn ? e.hrefEn : e.href;
        return (
          <li key={href}>
            <a className="pastilla hueca" href={href} target="_blank" rel="noopener noreferrer">
              <IconoEnlace tipo={e.tipo} />
              {(e.texto ?? TEXTO_TIPO[e.tipo])[lang]}
            </a>
          </li>
        );
      })}
    </ul>
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

export function Telefono({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <figure className={`${css.telefono} ${className ?? ""}`}>
      <div className={css.pantallaTel}>{children}</div>
    </figure>
  );
}
