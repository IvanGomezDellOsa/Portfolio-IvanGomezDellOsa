import type { CSSProperties } from "react";
import { PROYECTOS } from "@/contenido/proyectos";
import { SALAS } from "@/contenido/salas";
import { SALA } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./Pasillo.module.css";

/**
 * EL INDICE LATERAL: un punto por proyecto, fijo al costado mientras se los
 * recorre. Dice dónde se está (el punto encendido es el proyecto actual) y
 * deja saltar a cualquier otro. Se enciende sin JavaScript de estado:
 * `ObservadorSalas` marca `<html data-sala>` y una regla de `raiz.tsx` le pone
 * `--encendida` al punto de ese proyecto.
 */
export function Pasillo({ lang }: { lang: Idioma }) {
  return (
    <nav className={css.pasillo} aria-label={SALA.pasillo[lang]}>
      <ol>
        {PROYECTOS.map((p) => (
          <li key={p.slug}>
            <a href={`#${p.slug}`} data-pasillo={p.slug} className={css.puerta} style={{ "--tinte": SALAS[p.slug].acento } as CSSProperties}>
              <span className={css.punto} aria-hidden="true" />
              <span className={css.nombre}>{p.nombre}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
