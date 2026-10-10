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
/**
 * LA PRUEBA DE FACEHUNT 2, dibujada (la corrida real de su video): los 112
 * rostros que detectó en el aviso, con los dos que coinciden encendidos, y los
 * 70 segundos del video con el segundo en que aparece la persona buscada.
 */
const ROSTROS = 112;
const COINCIDEN = [75, 76];
const DESDE = 53.76;
const HASTA = 54.24;
const DURA = 70;

function Busqueda({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  return (
    <div
      className={`${css.busqueda} aparece`}
      role="img"
      aria-label={es ? "112 rostros detectados, 2 coincidencias, en el segundo 53 de 70" : "112 faces detected, 2 matches, at second 53 of 70"}
    >
      <div className={css.rostros} aria-hidden="true">
        {Array.from({ length: ROSTROS }, (_, k) => (
          <span key={k} data-coincide={COINCIDEN.includes(k) || undefined} />
        ))}
      </div>
      <p className={`${css.rotuloBusqueda} maquina`} aria-hidden="true">
        <span>{es ? "112 rostros" : "112 faces"}</span>
        <span className={css.acierto}>{es ? "2 coinciden" : "2 match"}</span>
      </p>
      <div className={css.cinta} aria-hidden="true">
        <span className={css.momento} style={{ left: `${(DESDE / DURA) * 100}%`, width: `${((HASTA - DESDE) / DURA) * 100}%` }} />
        <span className={`${css.marcaTiempo} ${css.acierto} maquina`} style={{ left: `${(DESDE / DURA) * 100}%` }}>
          0:53
        </span>
      </div>
      <p className={`${css.rotuloBusqueda} maquina`} aria-hidden="true">
        <span>0:00</span>
        <span>1:10</span>
      </p>
    </div>
  );
}

export function Medicion({ dato, lang, i = 0 }: { dato: Dato; lang: Idioma; i?: number }) {
  return (
    <figure className={css.medicion} style={{ "--i": i } as CSSProperties}>
      <div className={css.cota} aria-hidden="true">
        <span className={`${css.linea} traza`} />
      </div>
      <p className={`${css.valor} maquina aparece`}>{dato.valor[lang]}</p>
      {dato.visual === "busqueda" && <Busqueda lang={lang} />}
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
