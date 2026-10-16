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
  { nombre: "CABA", desde: 2003, hasta: 2025, ordenes: 224677 },
  { nombre: "Santa Fe", desde: 2008, hasta: 2023, ordenes: 64585 },
  { nombre: "Nación", desde: 2009, hasta: 2022, ordenes: 224175 },
  { nombre: "PBA", desde: 2020, hasta: 2025, ordenes: 57574, exclusivo: [2020, 2024] as const },
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
    ["Filtro", "determinista", "Saca el ruido: menos tokens y decisiones más simples después."],
    ["Extracción", "Gemini + Grounding", "Cada mención pasa a datos estructurados."],
    ["Validación", "reglas", "Fuera deuda, préstamos, compraventa de acciones y lanzamientos."],
    ["Juicio", "Jev (TypeSafe)", "¿Es una inversión privada concreta?"],
    ["Deduplicación", "pgvector + identidad", "La similitud recupera; la identidad decide."],
    ["Publicación", "web · Telegram", "Sólo lo nuevo, sin intervención."],
  ],
  en: [
    ["Sources", "X · RSS · RIGI", "Specialised accounts, outlets by sector and the official registry."],
    ["Filter", "deterministic", "Removes the noise: fewer tokens and simpler decisions downstream."],
    ["Extraction", "Gemini + Grounding", "Every mention becomes structured data."],
    ["Validation", "rules", "Out go debt, loans, share purchases and launches."],
    ["Judgement", "Jev (TypeSafe)", "Is it a concrete private investment?"],
    ["Deduplication", "pgvector + identity", "Similarity retrieves; identity decides."],
    ["Publishing", "web · Telegram", "Only what is new, unattended."],
  ],
} as const;

/** Los pasos de un flujo, uno debajo del otro sobre un hilo: qué es cada uno, con qué se hace y qué deja. */
function Pasos({ titulo, pasos, pie }: { titulo: string; pasos: readonly (readonly [string, string, string])[]; pie?: string }) {
  return (
    <figure className={css.capas} data-revelar="">
      <figcaption className={`${css.tituloGrafico} aparece`}>{titulo}</figcaption>
      <ol className={css.listaCapas}>
        {pasos.map(([nombre, herramienta, que], i) => (
          <li key={nombre} className="aparece" style={{ "--i": i + 1 } as CSSProperties}>
            <span className={css.punto} aria-hidden="true" />
            <span className={css.nombreCapa}>{nombre}</span>
            <span className={`${css.herramienta} maquina`}>{herramienta}</span>
            <span className={css.que}>{que}</span>
          </li>
        ))}
      </ol>
      {pie && (
        <p className={`${css.pie} aparece`} style={{ "--i": pasos.length + 2 } as CSSProperties}>
          {pie}
        </p>
      )}
    </figure>
  );
}

export function Capas({ lang }: { lang: Idioma }) {
  const t = VISUALES.capas;
  return <Pasos titulo={t.titulo[lang]} pasos={CAPAS[lang]} pie={t.pie[lang]} />;
}

/** La arquitectura de Datos Pauta Oficial: de lo que publica cada jurisdicción a la consulta en el navegador. */
const TUBERIA = {
  es: [
    ["Fuentes oficiales", "CSV · Excel · PDF", "Cada jurisdicción publica a su manera."],
    ["Extracción", "Python", "Un extractor por jurisdicción."],
    ["Unificación", "unificar.py · validar.py", "Un solo CSV canónico y validado: 8 columnas, 571.011 filas."],
    ["Base de datos", "build_db.py · SQLite", "Montos deflactados por IPC (INDEC) y cachés precomputados."],
    ["Almacenamiento", "Cloudflare R2", "La base, partida en bloques de 20 MiB."],
    ["Consulta", "sql.js-httpvfs", "SQL desde el navegador, que pide sólo los bloques que necesita."],
    ["Sitio", "Astro · React · Cloudflare Pages", "Estático, con islas de React: sin backend ni servidores."],
  ],
  en: [
    ["Official sources", "CSV · Excel · PDF", "Each jurisdiction publishes in its own way."],
    ["Extraction", "Python", "One extractor per jurisdiction."],
    ["Unification", "unificar.py · validar.py", "A single validated canonical CSV: 8 columns, 571,011 rows."],
    ["Database", "build_db.py · SQLite", "Amounts deflated by CPI (INDEC) and precomputed caches."],
    ["Storage", "Cloudflare R2", "The database, split into 20 MiB chunks."],
    ["Querying", "sql.js-httpvfs", "SQL from the browser, which requests only the chunks it needs."],
    ["Website", "Astro · React · Cloudflare Pages", "Static, with React islands: no backend or servers."],
  ],
} as const;

/** El pipeline de Ask Leonardo: lo que recorre una pregunta hasta volver como respuesta verificada. */
const RECORRIDO = {
  es: [
    ["Pregunta", "embedding en el navegador", "Se vuelve vector en el dispositivo de quien pregunta, sin API."],
    ["Casos curados", "capa 0", "Lo que se sabe que no está en los cuadernos: abstención con la evidencia citada."],
    ["Umbral de similitud", "capa 1", "Si ningún pasaje se le parece lo suficiente, se abstiene sin llamar al modelo."],
    ["Recuperación híbrida", "coseno + BM25 · RRF", "Elige los tres pasajes que van a sostener la respuesta."],
    ["Generación", "capa 2 · Gemini", "El modelo responde, o se abstiene, con los pasajes delante."],
    ["Verificación", "capa 3 · código", "Cada cita se compara con el pasaje original."],
    ["Respuesta", "con sus fuentes", "En la voz de Leonardo, con los pasajes a la vista."],
  ],
  en: [
    ["Question", "embedding in the browser", "It becomes a vector on the asker's device, with no API."],
    ["Curated cases", "layer 0", "What is known not to be in the notebooks: a refusal with the evidence cited."],
    ["Similarity threshold", "layer 1", "If no passage is close enough, it abstains without calling the model."],
    ["Hybrid retrieval", "cosine + BM25 · RRF", "Picks the three passages that will back the answer."],
    ["Generation", "layer 2 · Gemini", "The model answers, or declines, with the passages in front of it."],
    ["Verification", "layer 3 · code", "Every quotation is compared against the original passage."],
    ["Answer", "with its sources", "In Leonardo's voice, with the passages in plain view."],
  ],
} as const;

export function Recorrido({ lang }: { lang: Idioma }) {
  const t = VISUALES.recorrido;
  return <Pasos titulo={t.titulo[lang]} pasos={RECORRIDO[lang]} pie={t.pie[lang]} />;
}

export function Tuberia({ lang }: { lang: Idioma }) {
  return <Pasos titulo={VISUALES.tuberia.titulo[lang]} pasos={TUBERIA[lang]} />;
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
