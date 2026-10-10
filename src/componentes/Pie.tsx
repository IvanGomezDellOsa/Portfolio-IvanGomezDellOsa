import { variablesDe } from "@/contenido/salas";
import { EMAIL, GITHUB, LINKEDIN, NOMBRE } from "@/contenido/sitio";
import css from "./Pie.module.css";

/**
 * EL PIE: una línea. En la portada, sólo la firma: el contacto es la sección
 * de arriba y no se repite. En la página de un proyecto, que no tiene esa
 * sección, suma el email y las redes.
 */
export function Pie({ conContacto = false }: { conContacto?: boolean }) {
  return (
    <footer className={css.pie} style={variablesDe("galeria")}>
      <div className={css.interior}>
        <p className={css.firma}>
          {NOMBRE} · <span className="maquina">2026</span>
        </p>
        {conContacto && (
          <ul className={css.enlaces}>
            <li>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </li>
            <li>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        )}
      </div>
    </footer>
  );
}
