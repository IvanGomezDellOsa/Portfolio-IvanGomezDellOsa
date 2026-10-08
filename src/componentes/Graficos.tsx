import type { CSSProperties } from "react";
import { VISUALES } from "@/contenido/sitio";
import type { Idioma } from "@/contenido/tipos";
import css from "./Graficos.module.css";

/**
 * LOS GRAFICOS DE LAS SALAS. Todos dibujan datos del proyecto que muestran
 * (ninguno es una ilustración con números inventados) y se arman cuando la sala
 * se revela: las barras se trazan en el orden en que se leen.
 */

/** El resultado medido de Ask Leonardo: 96,9% contra 0 de 187. */
export function Barras({ lang }: { lang: Idioma }) {
  const t = VISUALES.barras;
  return (
    <figure className={css.barras} data-revelar="">
      <figcaption className={`${css.tituloGrafico} aparece`}>{t.titulo[lang]}</figcaption>
      <div className={css.fila}>
        <p className={`${css.quien} aparece`} style={{ "--i": 1 } as CSSProperties}>
          {t.modelo[lang]}
        </p>
        <div className={css.pista}>
          <span className={`${css.relleno} ${css.inventa} traza`} style={{ "--p": 0.969, "--i": 2 } as CSSProperties} />
        </div>
        <p className={`${css.cifra} aparece`} style={{ "--i": 3 } as CSSProperties}>
          <span className={`${css.valorBarra} ${css.rojo} maquina`}>{t.modeloValor[lang]}</span>
          <span className={`${css.detalle} maquina`}>{t.modeloDetalle[lang]}</span>
        </p>
      </div>
      <div className={css.fila}>
        <p className={`${css.quien} ${css.propio} aparece`} style={{ "--i": 4 } as CSSProperties}>
          {t.ask[lang]}
        </p>
        <div className={css.pista}>
          <span className={`${css.relleno} ${css.cero} traza`} style={{ "--i": 5 } as CSSProperties} />
        </div>
        <p className={`${css.cifra} aparece`} style={{ "--i": 6 } as CSSProperties}>
          <span className={`${css.valorBarra} maquina`}>{t.askValor[lang]}</span>
          <span className={`${css.detalle} maquina`}>{t.askDetalle[lang]}</span>
        </p>
      </div>
      <p className={`${css.pie} aparece`} style={{ "--i": 7 } as CSSProperties}>
        {t.pie[lang]}
      </p>
    </figure>
  );
}

const PRIMER_ANIO = 2003;
const ULTIMO_ANIO = 2025;
const TRAMO = ULTIMO_ANIO + 1 - PRIMER_ANIO;

/**
 * LA COBERTURA DE DATOS PAUTA OFICIAL, del README del proyecto. Cada barra va
 * del primer al último año de su jurisdicción y su grosor sigue la cantidad de
 * órdenes. El tramo de PBA reconstruido desde PDF se marca aparte.
 */
const JURISDICCIONES = [
  { nombre: "CABA", desde: 2003, hasta: 2024, ordenes: 209877 },
  { nombre: "Santa Fe", desde: 2008, hasta: 2023, ordenes: 61187 },
  { nombre: "Nación", desde: 2009, hasta: 2022, ordenes: 225367 },
  { nombre: "PBA", desde: 2020, hasta: 2025, ordenes: 43982, exclusivo: [2020, 2024] as const },
];

export function Cobertura({ lang }: { lang: Idioma }) {
  const t = VISUALES.cobertura;
  const max = Math.max(...JURISDICCIONES.map((j) => j.ordenes));
  const numero = (n: number) => n.toLocaleString(lang === "es" ? "es-AR" : "en-US");
  const total = JURISDICCIONES.reduce((s, j) => s + j.ordenes, 0);
  const x = (anio: number) => (anio - PRIMER_ANIO) / TRAMO;
  return (
    <figure className={css.cobertura} data-revelar="">
      <figcaption className={`${css.tituloGrafico} aparece`}>{t.titulo[lang]}</figcaption>
      <div className={css.grillaCobertura}>
        {/* El eje ocupa la columna de las pistas: una celda vacía a cada lado lo alinea. */}
        <span aria-hidden="true" />
        <div className={`${css.eje} maquina aparece`} aria-hidden="true">
          {[2003, 2008, 2013, 2018, 2023].map((a) => (
            <span key={a} style={{ "--x": x(a) } as CSSProperties}>
              {a}
            </span>
          ))}
        </div>
        <span aria-hidden="true" />
        {JURISDICCIONES.map((j, i) => (
          <div key={j.nombre} className={css.jurisdiccion}>
            <span className={`${css.nombreJ} aparece`} style={{ "--i": i + 1 } as CSSProperties}>
              {j.nombre}
            </span>
            <span className={css.pistaJ}>
              <span
                className={`${css.tramo} traza`}
                style={{ "--desde": x(j.desde), "--hasta": x(j.hasta + 1), "--grosor": 0.25 + 0.75 * (j.ordenes / max), "--i": i + 1 } as CSSProperties}
                title={`${j.nombre}: ${j.desde}–${j.hasta}`}
              />
              {j.exclusivo && (
                <span
                  className={`${css.exclusivo} traza`}
                  style={{ "--desde": x(j.exclusivo[0]), "--hasta": x(j.exclusivo[1] + 1), "--i": i + 3 } as CSSProperties}
                />
              )}
            </span>
            <span className={`${css.cantidad} maquina aparece`} style={{ "--i": i + 2 } as CSSProperties}>
              {numero(j.ordenes)}
            </span>
            <span className="sr">
              {j.nombre}: {j.desde}–{j.hasta}, {numero(j.ordenes)} {t.ordenes[lang]}.
            </span>
          </div>
        ))}
        <p className={`${css.notaExclusivo} aparece`} style={{ "--i": 6 } as CSSProperties}>
          <span className={css.muestra} aria-hidden="true" />
          PBA 2020–2024 · {t.exclusivo[lang]}
        </p>
      </div>
      <p className={`${css.totalCobertura} aparece`} style={{ "--i": 7 } as CSSProperties}>
        <span className="maquina">{numero(total)}</span> {t.total[lang]}
      </p>
    </figure>
  );
}

/** Las capas de Inversiones en Argentina: qué descarta cada una antes de publicar. */
const CAPAS = {
  es: [
    ["Fuentes", "X · RSS · RIGI", "Cuentas especializadas, medios por rubro y el registro oficial."],
    ["Filtro", "determinista", "Descarta el ruido antes de gastar un token."],
    ["Extracción", "Gemini + Grounding", "Cada mención pasa a datos estructurados."],
    ["Validación", "reglas", "Fuera deuda, préstamos, compraventa de acciones y lanzamientos."],
    ["Juicio", "Jev (TypeSafe)", "¿Es una inversión privada concreta?"],
    ["Deduplicación", "pgvector + identidad", "La similitud recupera; la identidad decide."],
    ["Publicación", "web · Telegram", "Sólo lo nuevo, sin intervención."],
  ],
  en: [
    ["Sources", "X · RSS · RIGI", "Specialised accounts, outlets by sector and the official registry."],
    ["Filter", "deterministic", "Discards the noise before spending a token."],
    ["Extraction", "Gemini + Grounding", "Every mention becomes structured data."],
    ["Validation", "rules", "Out go debt, loans, share purchases and launches."],
    ["Judgement", "Jev (TypeSafe)", "Is it a concrete private investment?"],
    ["Deduplication", "pgvector + identity", "Similarity retrieves; identity decides."],
    ["Publishing", "web · Telegram", "Only what is new, unattended."],
  ],
} as const;

export function Capas({ lang }: { lang: Idioma }) {
  const t = VISUALES.capas;
  return (
    <figure className={css.capas} data-revelar="">
      <figcaption className={`${css.tituloGrafico} aparece`}>{t.titulo[lang]}</figcaption>
      <ol className={css.listaCapas}>
        {CAPAS[lang].map(([nombre, herramienta, que], i) => (
          <li key={nombre} className="aparece" style={{ "--i": i + 1 } as CSSProperties}>
            <span className={css.punto} aria-hidden="true" />
            <span className={css.nombreCapa}>{nombre}</span>
            <span className={`${css.herramienta} maquina`}>{herramienta}</span>
            <span className={css.que}>{que}</span>
          </li>
        ))}
      </ol>
      <p className={`${css.pie} aparece`} style={{ "--i": 9 } as CSSProperties}>
        {t.pie[lang]}
      </p>
    </figure>
  );
}

/** La arquitectura de SeViVe: quién habla con quién, y dónde corre cada parte. */
export function Sistema({ lang }: { lang: Idioma }) {
  const es = lang === "es";
  return (
    <figure className={css.sistema} data-revelar="">
      <figcaption className={`${css.tituloGrafico} aparece`}>{VISUALES.sistema.titulo[lang]}</figcaption>
      <div className={css.planoSistema}>
        <div className={`${css.nodo} ${css.app} aparece`} style={{ "--i": 1 } as CSSProperties}>
          <span className={css.nombreNodo}>{es ? "App Flutter (PWA)" : "Flutter app (PWA)"}</span>
          <span className={`${css.detalleNodo} maquina`}>{es ? "alumnos · administración" : "students · administration"}</span>
        </div>
        <span className={`${css.enlaceNodo} aparece`} style={{ "--i": 2 } as CSSProperties} aria-hidden="true">
          <span className="maquina">HTTPS · REST</span>
        </span>
        <div className={`${css.servidor} aparece`} style={{ "--i": 3 } as CSSProperties}>
          <span className={`${css.rotuloServidor} maquina`}>VPS · Docker Compose</span>
          <div className={css.cadena}>
            <div className={css.nodo}>
              <span className={css.nombreNodo}>Nginx</span>
            </div>
            <span className={css.flecha} aria-hidden="true">→</span>
            <div className={css.nodo}>
              <span className={css.nombreNodo}>FastAPI</span>
              <span className={`${css.detalleNodo} maquina`}>async</span>
            </div>
            <span className={css.flecha} aria-hidden="true">→</span>
            <div className={css.nodo}>
              <span className={css.nombreNodo}>PostgreSQL</span>
              <span className={`${css.detalleNodo} maquina`}>asyncpg · Alembic</span>
            </div>
          </div>
        </div>
        <div className={`${css.nodo} ${css.firebase} aparece`} style={{ "--i": 4 } as CSSProperties}>
          <span className={css.nombreNodo}>Firebase</span>
          <span className={`${css.detalleNodo} maquina`}>
            {es ? "Google · Storage · push (FCM)" : "Google · Storage · push (FCM)"}
          </span>
        </div>
      </div>
      <ul className={`${css.reglas} aparece`} style={{ "--i": 5 } as CSSProperties}>
        <li>{es ? "Reservas con control de concurrencia" : "Bookings with concurrency control"}</li>
        <li>{es ? "Créditos con vencimiento" : "Expiring credits"}</li>
        <li>{es ? "Turnos fijos con reserva automática" : "Recurring slots, booked automatically"}</li>
        <li>{es ? "Fusión de cuentas por DNI" : "Account merging by national ID"}</li>
      </ul>
    </figure>
  );
}
