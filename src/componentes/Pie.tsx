import { variablesDe } from "@/contenido/salas";
import { EMAIL, GITHUB, LINKEDIN } from "@/contenido/sitio";
import css from "./Pie.module.css";

/** El pie: el email y las redes, nada más. */
export function Pie() {
  return (
    <footer className={css.pie} style={variablesDe("galeria")}>
      <div className={css.interior}>
        <div className={css.fila}>
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
        </div>
      </div>
    </footer>
  );
}
