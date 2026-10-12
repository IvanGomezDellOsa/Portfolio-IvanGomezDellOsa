/**
 * LOS NUEVE PROYECTOS, en el orden de la lista.
 *
 * DE DONDE SALEN LOS TEXTOS. De lo que ya está aprobado: el README de cada
 * proyecto, el CV 10-26, el perfil de LinkedIn y las descripciones aprobadas de
 * `Mensajes-Postulacion.md`. No se inventó ningún dato: cada número está en el
 * README del proyecto o se verificó en su repositorio.
 *
 * DECISIONES QUE ESTE ARCHIVO RESPETA (del dueño, no se reabren):
 *   · Ask Leonardo va siempre primero, con la descripción canónica textual y
 *     el giro de Richter cerca («1.565 pasajes»). Nunca «+7.000 páginas».
 *   · Navkok es «proyecto freelance» con «vista previa»: nunca «en curso»,
 *     «entregado» ni «en producción». Las ISO son de la empresa, no del sitio.
 *   · FaceHunt 2 sin «~10x» (no hay medición en el repo); los usos se
 *     presentan como aplicables, no como desplegados.
 *   · SeViVe con fecha de fin (jun. 2026), «más de 200 usuarios», PWA con
 *     inicio de sesión de Google (no iOS/Android ni Apple) y sin «US$4 por mes».
 *   · Inversiones sin enlace al canal de Telegram.
 *   · Rugidos sin «de 16 MB a menos de 1,5 MB». Las cifras que van son las
 *     verificadas del README (2026-09-30): Lighthouse y «~15,6 MB a ~1,8 MB».
 *   · Navkok nombra sus formularios como parte del diseño (decisión del dueño,
 *     2026-10-09): el de contacto y el de postulación, con el QR que se arma en
 *     pantalla. No se afirma que envíen. Su dirección de vista previa no se
 *     muestra: el enlace dice «Vista previa». «El contenido multimedia», no
 *     «las imágenes y el video de fondo».
 *   · SeViVe sin «acceso controlado» (el código se valida en la app).
 *   · Ninguna frase se presenta como cita: lo que explica algo va en párrafo.
 *   · FaceHunt (2025) y el sitio 2023 de Rugidos van como «primera versión»,
 *     dentro de su sucesor. El de 2023 sin su demo en video: sólo el repositorio.
 *   · Cada proyecto lleva su video de presentación de YouTube, el mismo que
 *     enlazan su README y el CV 10-26 v2, y es lo principal de su página. Los
 *     sitios (Rugidos, Navkok) no tienen: muestran el recorrido de su página.
 *
 * TRES NIVELES POR PROYECTO, y cada uno contesta otra pregunta (pedido del
 * dueño, 2026-10-10: nada se dice dos veces):
 *   · `resumen` (arriba del video, una a tres líneas): QUE ES y para quién.
 *   · `cuerpo` (debajo): QUE HACE y con qué está hecho, con la redacción del
 *     CV. No vuelve a presentar el proyecto.
 *   · `caso` (el detalle técnico, a pedido): COMO funciona. Arranca directo en
 *     el funcionamiento, sin otra introducción.
 * `dato` es un solo número, el que más pesa, aunque el resumen ya lo nombre.
 *
 * SIN «NOTAS DE DESARROLLO» por proyecto (2026-10-10): eran la misma frase en
 * todos. Que se desarrolla con asistencia de IA se dice una vez, en «Sobre mí».
 *
 * FORMA (docs/29 de Ask Leonardo): el sujeto es el proyecto y el verbo va en
 * presente («reserva», «publica», «se instala»). La primera persona queda para
 * una sola oración, y sólo donde el rol es parte del dato (los trabajos para
 * un cliente o una empresa: SeViVe, Navkok, Rugidos). Paréntesis en vez de
 * rayas, nada absoluto que no esté medido, ningún término que el dueño no
 * pueda explicar en una entrevista.
 *
 * LA EXCEPCION DE ASK LEONARDO (decisión del 2026-10-10): el primer párrafo de
 * su descripción ampliada cuenta la idea, con las palabras del guion de su
 * video, y por eso suena más narrado que el resto. Es el único proyecto que
 * necesita explicar por qué existe antes de decir qué hace. La excepción es de
 * contenido, no de gramática: sigue en tercera persona y en presente, y sus
 * otros dos párrafos llevan el tono común.
 */
import type { Bilingue, Proyecto } from "./tipos";

const b = <T,>(es: T, en: T): Bilingue<T> => ({ es, en });
const GH = "https://github.com/IvanGomezDellOsa";

export const PROYECTOS: Proyecto[] = [
  // ─────────────────────────────────────────────────────────── Ask Leonardo
  {
    slug: "ask-leonardo-da-vinci",
    nombre: "Ask Leonardo da Vinci",
    marca: "/medios/leonardo/marca.webp",
    origen: b("Proyecto propio", "Personal project"),
    periodo: b("2026", "2026"),
    area: b("IA aplicada · RAG", "Applied AI · RAG"),
    resumen: b(
      "**Leonardo da Vinci dejó más de 7.500 páginas escritas.** Por primera vez, un software las utiliza para conversar con él sin inventar respuestas. Una red neuronal encuentra, entre 1.565 pasajes de sus cuadernos, los que responden cada pregunta, y el sistema comprueba que cada cita exista en el original.",
      "**Leonardo da Vinci left more than 7,500 written pages.** For the first time, software uses them to speak with him without inventing answers. A neural network finds, among 1,565 passages from his notebooks, the ones that answer each question, and the system checks that every quotation exists in the original.",
    ),
    cuerpo: b(
      [
        "«Actúa como si fueras…» es uno de los pedidos más comunes que recibe una inteligencia artificial. Cuando se le pide ser alguien, el modelo asegura que puede, pero inventa respuestas, cambia la forma de expresarse de esa persona y opina sobre temas que nunca se planteó. Para no inventar necesitaría muchísimo contexto de esa persona: sus pensamientos, sus experiencias, lo que se preguntó alguna vez. Leonardo lo dejó escrito. Durante toda su vida llenó cuadernos, una *transfusión mental a papel*: anatomía, óptica, pintura, máquinas, fábulas y hasta sus listas de compras. Sus expresiones, sus respuestas y sus opiniones no hace falta inventarlas: las escribió él.",
        "El sitio recibe al visitante en el taller de Leonardo, sentado frente a él: se le hace una pregunta y responde en primera persona, con las fuentes a la vista. Lo que aparece entre comillas sale tal cual de sus cuadernos. Para quien no sabe qué preguntarle, la Pregunta asistida ofrece un mapa de 22 secciones y 396 temas, y cada uno se convierte en pregunta con un clic. Lo que no está en sus cuadernos no se inventa: el sitio lo aclara. Todo en español y en inglés, con una biblioteca 3D, un museo virtual 3D y un espacio vectorial que muestra cómo funciona por dentro.",
      ],
      [
        "“Act as if you were…” is one of the most common requests an artificial intelligence receives. When asked to be someone, the model claims it can, but it invents answers, changes the way that person speaks and gives opinions on things they never considered. To stop inventing it would need an enormous amount of context about that person: their thoughts, their experiences, what they once wondered. Leonardo left it in writing. All his life he filled notebooks, a *mind transfusion onto paper*: anatomy, optics, painting, machines, fables and even his shopping lists. His expressions, his answers and his opinions do not need to be invented: he wrote them himself.",
        "The site welcomes visitors into Leonardo's workshop, seated right in front of him: you ask him a question and he answers in the first person, with the sources in plain view. Everything in quotation marks comes word for word from his notebooks. For those who do not know what to ask, Guided questions offer a map of 22 sections and 396 subjects, each one turned into a question with one click. What is not in his notebooks is not invented: the site says so. All of it in Spanish and English, with a 3D library, a 3D virtual museum and a vector space that shows how it works on the inside.",
      ],
    ),
    dato: {
      valor: b("0 de 187", "0 of 187"),
      etiqueta: b(
        "citas inventadas. Con el mismo modelo y las mismas preguntas, una IA actuando como Leonardo inventa el 96,9% (156 de 161).",
        "invented quotations. With the same model and the same questions, an AI acting as Leonardo makes up 96.9% (156 of 161).",
      ),
    },
    stack: ["Next.js", "React", "TypeScript", "Three.js", "RAG", "Transformers.js", "Gemini API", "Python"],
    enlaces: [
      {
        tipo: "sitio",
        href: "https://www.askleonardodavinci.online",
        hrefEn: "https://www.askleonardodavinci.online/en",
        texto: b("askleonardodavinci.online", "askleonardodavinci.online"),
      },
      { tipo: "repositorio", href: `${GH}/Ask_Leonardo_da_Vinci` },
    ],
    video: {
      id: "35xaHDucoX8",
      duracion: 358,
      escenas: [
        { t: 0, titulo: b("Una IA que inventa", "An AI that makes things up") },
        { t: 52, titulo: b("Los cuadernos y Richter", "The notebooks and Richter") },
        { t: 90, titulo: b("Nace Ask Leonardo", "Ask Leonardo is born") },
        { t: 110, titulo: b("El taller y las citas", "The workshop and the quotations") },
        { t: 136, titulo: b("Pregunta asistida", "Guided questions") },
        { t: 168, titulo: b("Lo que no está en sus cuadernos", "What is not in his notebooks") },
        { t: 200, titulo: b("Biblioteca y museo 3D", "3D library and museum") },
        { t: 232, titulo: b("Por dentro: el espacio vectorial", "Inside: the vector space") },
        { t: 266, titulo: b("Pipeline RAG desde cero", "A RAG pipeline from scratch") },
        { t: 318, titulo: b("El resultado", "The result") },
        { t: 334, titulo: b("Stack", "Tech stack") },
      ],
    },
    descripcionMeta: b(
      "Leonardo dejó más de 7.500 páginas. Un pipeline RAG propio conversa con él sin inventar citas: 0 de 187, contra 96,9% de una IA común.",
      "Leonardo left more than 7,500 pages. A custom RAG pipeline speaks with him without inventing quotations: 0 of 187, against 96.9% for a plain AI.",
    ),
    caso: [
      {
        titulo: b("La diferencia se mide", "The difference can be measured"),
        bloques: [
          { tipo: "visual", id: "barras" },
          {
            tipo: "tabla",
            columnas: b(["También se midió", "Resultado"], ["Also measured", "Result"]),
            filas: b(
              [
                ["Preguntas con respuesta en los cuadernos que el sistema rechazó por error", "**0**, en 170 preguntas de prueba"],
                ["Temas de los cuadernos que el buscador encuentra en los dos idiomas", "**94%**"],
              ],
              [
                ["Questions answerable from the notebooks that the system wrongly refused", "**0**, across 170 test questions"],
                ["Notebook subjects the search finds in both languages", "**94%**"],
              ],
            ),
            pie: b(
              "Las dos corridas del gráfico, con cada respuesta completa, están publicadas en [`evals/out/`](https://github.com/IvanGomezDellOsa/Ask_Leonardo_da_Vinci/tree/main/evals/out).",
              "The two runs behind the chart, with every answer in full, are published in [`evals/out/`](https://github.com/IvanGomezDellOsa/Ask_Leonardo_da_Vinci/tree/main/evals/out).",
            ),
          },
        ],
      },
      {
        titulo: b("Preguntarle a Leonardo", "Asking Leonardo"),
        bloques: [
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/leonardo/codice-es", "/medios/leonardo/codice-en"),
                alt: b(
                  "El códice: el mapa de temas a la izquierda y una respuesta de Leonardo con una cita textual y sus fuentes.",
                  "The codex: the subject map on the left and an answer from Leonardo with a verbatim quotation and its sources.",
                ),
                ancho: 1600,
                alto: 900,
              },
            ],
          },
          {
            tipo: "lista",
            items: b(
              [
                "**Respuestas con fuentes.** Leonardo responde en primera persona a partir de los pasajes recuperados, con las fuentes debajo y el enlace a cada pasaje en Project Gutenberg.",
                "**Citas textuales.** Todo lo que aparece entre comillas sale tal cual de sus cuadernos. Si una cita no coincide con el original, no se muestra como cita.",
                "**Pregunta asistida.** ¿Qué se le pregunta a uno de los hombres más brillantes de la historia? Escribió sobre tantas cosas que hasta puede intimidar. Por eso hay un mapa de 22 secciones y 396 temas sobre los que sí escribió, más seis preguntas sugeridas: se elige un tema y con un clic se convierte en pregunta. Quien no está acostumbrado a la IA puede concentrarse en leer las respuestas en vez de armar un prompt.",
                "**Lo que no pudo escribir.** Hay cosas que Leonardo, lógicamente, no dejó en sus cuadernos, como su propia muerte, y datos que no solía anotar sobre sí mismo («¿qué día naciste?», «¿quién fue tu maestro?»). Ahí el sitio lo aclara y muestra el fragmento exacto de Wikipedia, con su atribución, fuera de su voz.",
                "**Lo que se perdió.** Con los siglos, parte de sus cuadernos se perdió. ¿La Mona Lisa? Sus manuscritos nunca la mencionan, y el sitio muestra la nota del editor que lo confirma. Queda el misterio, pero no se inventa.",
                "**Bilingüe.** Todo el sitio, incluidas las respuestas de Leonardo, está completo en español y en inglés.",
              ],
              [
                "**Answers with sources.** Leonardo answers in the first person from the retrieved passages, with the sources below and a link to each passage on Project Gutenberg.",
                "**Verbatim quotations.** Everything in quotation marks comes word for word from his notebooks. If a quotation does not match the original, it is not shown as a quotation.",
                "**Guided questions.** What do you ask one of the most brilliant minds in history? He wrote about so many things that it can even feel intimidating. That is why there is a map of 22 sections and 396 subjects he did write about, plus six suggested questions: pick a subject and one click turns it into a question. Anyone not used to AI can focus on reading the answers instead of crafting a prompt.",
                "**What he could not write.** Some things Leonardo, naturally, did not leave in his notebooks, like his own death, along with facts he rarely wrote down about himself (“what day were you born?”, “who was your teacher?”). There, the site says so and shows the exact Wikipedia excerpt, with attribution, outside his voice.",
                "**What was lost.** Over the centuries, part of his notebooks was lost. The Mona Lisa? His manuscripts never mention it, and the site shows the editor's note that confirms it. The mystery remains, but nothing is invented.",
                "**Bilingual.** The whole site, including Leonardo's answers, is complete in Spanish and English.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Biblioteca 3D", "3D Library"),
        bloques: [
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/leonardo/biblioteca-estante-es", "/medios/leonardo/biblioteca-estante-en"),
                alt: b("La estantería de la biblioteca, con el volumen de Anatomía fuera del estante.", "The library shelf, with the Anatomy volume taken out."),
                ancho: 1600,
                alto: 900,
              },
              {
                src: b("/medios/leonardo/biblioteca-libro-es", "/medios/leonardo/biblioteca-libro-en"),
                alt: b("Un volumen abierto mientras se pasa una hoja, con la lupa sobre una lámina.", "An open volume while a leaf is turning, with the loupe over a plate."),
                ancho: 1600,
                alto: 900,
              },
            ],
          },
          {
            tipo: "parrafos",
            texto: b(
              ["Cinco volúmenes con 27 láminas de Leonardo. Los tomos salen del estante, las hojas se pasan con el pliegue de un libro real y, en escritorio, una lupa permite leer la escritura de cerca."],
              ["Five volumes with 27 plates by Leonardo. The volumes come off the shelf, leaves turn with the curl of a real book and, on desktop, a loupe lets you read the handwriting up close."],
            ),
          },
        ],
      },
      {
        titulo: b("Museo virtual 3D", "3D Virtual museum"),
        bloques: [
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/leonardo/museo-es", "/medios/leonardo/museo-en"),
                alt: b(
                  "La sala del museo con La Gioconda y La Última Cena, el avatar del visitante y la ficha de la obra.",
                  "The museum gallery with the Mona Lisa and The Last Supper, the visitor's avatar and the label of the work.",
                ),
                ancho: 1600,
                alto: 900,
              },
            ],
          },
          {
            tipo: "parrafos",
            texto: b(
              ["Una sala que se recorre caminando, también desde el teléfono, con nueve de sus obras y la ficha de cada una."],
              ["A gallery you walk through, on mobile too, with nine of his works and a label for each one."],
            ),
          },
        ],
      },
      {
        titulo: b("Espacio vectorial", "Vector space"),
        bloques: [
          { tipo: "visual", id: "vectores" },
          {
            tipo: "parrafos",
            texto: b(
              [
                "Es la sección «Cómo funciona» del sitio. Le muestra al visitante los pasajes convertidos en vectores y cómo una pregunta encuentra los suyos. Está en una web para público general a propósito: la validez técnica del sistema es lo que respalda cada respuesta de Leonardo.",
                "No es una animación ilustrativa. Son los vectores reales del proyecto: los 1.402 pasajes que consulta el sistema, ubicados por su red neuronal y llevados de 384 dimensiones a 3 para poder verlos. Al encender una sección se entiende la cercanía: para la red neuronal, los pasajes que hablan de lo mismo tienden a quedar juntos.",
              ],
              [
                "It is the site's “How it works” section. It shows visitors the passages turned into vectors and how a question finds its own. It sits in a website for the general public on purpose: the technical soundness of the system is what backs every answer from Leonardo.",
                "This is not an illustrative animation. These are the project's real vectors: the 1,402 passages the system searches, placed by its neural network and brought down from 384 dimensions to 3 so they can be seen. Light up a section and the closeness makes sense: to the neural network, passages about the same thing tend to sit together.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Arquitectura", "Architecture"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["Corre sobre un pipeline RAG escrito desde cero, sin frameworks como LangChain o LlamaIndex, para que cada paso se pueda controlar y medir por separado. La pregunta se vuelve vector en el propio navegador; si ningún pasaje se le parece lo suficiente, el sistema se abstiene sin llamar al modelo. Si hay material, una búsqueda híbrida elige tres pasajes, Gemini responde con ellos delante y el código verifica cada cita.", "La idea fue el punto de partida, no el resultado. Hubo que medir y elegir modelos, calibrar la búsqueda semántica, dejar que hable sólo Leonardo (y no su editor), limitar la prosa que los modelos de IA tienden a inventar y comprobar que cada cita exista en los cuadernos. El texto que consulta el sistema es la edición que Jean Paul Richter transcribió y tradujo en 1888, hoy de dominio público."],
              ["It runs on a RAG pipeline written from scratch, with no frameworks such as LangChain or LlamaIndex, so that every step can be controlled and measured on its own. The question becomes a vector right in the browser; if no passage is close enough, the system abstains without calling the model. If there is material, a hybrid search picks three passages, Gemini answers with them in front of it, and the code verifies every quotation.", "The idea was the starting point, not the result. It took measuring and choosing models, calibrating the semantic search, letting only Leonardo speak (not his editor), reining in the prose AI models tend to invent, and checking that every quotation exists in the notebooks. The text the system searches is the edition Jean Paul Richter transcribed and translated in 1888, now in the public domain."],
            ),
          },
          { tipo: "visual", id: "recorrido" },
          {
            tipo: "lista",
            items: b(
              [
                "**El coseno decide y la fusión sólo ordena.** Un ranking siempre tiene un primer puesto, exista o no material pertinente; lo que determina si hay respuesta es la similitud contra un umbral calibrado.",
                "**Un índice y un umbral por idioma.** Con un umbral compartido, la exactitud del filtro caía de 88,4% a 70,5%.",
                "**Embeddings en el navegador.** La consulta se vectoriza en el dispositivo del usuario: sin costo por consulta y sin una cuota que se pueda agotar.",
                "**Sin servidor persistente ni base de datos vectorial.** El índice es un binario int8 versionado en Git, BM25 está precomputado y las secciones 3D se cargan sólo cuando alguien las visita.",
              ],
              [
                "**Cosine decides, fusion only orders.** A ranking always has a first place, whether or not relevant material exists; what determines whether there is an answer is similarity against a calibrated threshold.",
                "**One index and one threshold per language.** With a shared threshold, the filter's accuracy dropped from 88.4% to 70.5%.",
                "**Embeddings in the browser.** The query is vectorised on the user's device: no cost per query and no quota that can run out.",
                "**No persistent server and no vector database.** The index is an int8 binary versioned in Git, BM25 is precomputed, and the 3D sections load only when someone visits them.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Stack", "Tech stack"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["Capa", "Tecnología"], ["Layer", "Technology"]),
            filas: b(
              [
                ["Frontend", "Next.js 16 (App Router), React 19, TypeScript, Three.js"],
                ["Embeddings", "`multilingual-e5-small` (384 dimensiones, int8) · Transformers.js en el navegador"],
                ["Recuperación", "Coseno denso + BM25 precomputado, fusión RRF"],
                ["Generación", "Gemini 3.1 Flash-Lite, con GPT-OSS 120B en Groq como respaldo"],
                ["Ingesta", "Python: parseo de la edición de Gutenberg, separación de voces, chunking, embeddings y calibración"],
                ["Evaluación", "170 preguntas en 8 categorías · juez automático validado contra etiquetado humano"],
                ["Seguridad", "Cloudflare Turnstile, límite por IP hasheada y presupuesto diario global"],
                ["Hosting y CI", "Vercel · GitHub Actions"],
              ],
              [
                ["Frontend", "Next.js 16 (App Router), React 19, TypeScript, Three.js"],
                ["Embeddings", "`multilingual-e5-small` (384 dimensions, int8) · Transformers.js in the browser"],
                ["Retrieval", "Dense cosine + precomputed BM25, RRF fusion"],
                ["Generation", "Gemini 3.1 Flash-Lite, with GPT-OSS 120B on Groq as fallback"],
                ["Ingestion", "Python: parsing the Gutenberg edition, voice separation, chunking, embeddings and calibration"],
                ["Evaluation", "170 questions across 8 categories · automated judge validated against human labelling"],
                ["Security", "Cloudflare Turnstile, hashed-IP rate limiting and a global daily budget"],
                ["Hosting & CI", "Vercel · GitHub Actions"],
              ],
            ),
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── Datos Pauta
  {
    slug: "datos-pauta-oficial",
    nombre: "Datos Pauta Oficial",
    marca: "/medios/datos-pauta/marca.webp",
    origen: b("Proyecto propio", "Personal project"),
    periodo: b("2026", "2026"),
    area: b("Datos · ETL", "Data · ETL"),
    resumen: b(
      "La primera y única base unificada de pauta oficial argentina: **540.413 órdenes de publicidad** de Nación, CABA, PBA y Santa Fe (2003–2025), con montos deflactados por IPC. Se consulta desde el sitio con una tabla explorable, rankings y el buscador «Cuánto recibió» (por proveedor, medio o grupo mediático), con la metodología publicada.",
      "The first and only unified database of Argentine government advertising: **540,413 advertising orders** from the national government, Buenos Aires City, Buenos Aires Province and Santa Fe (2003–2025), with amounts adjusted for inflation (CPI). It is queried on the website through an explorable table, rankings and the “Cuánto recibió” (how much it received) search by supplier, media outlet or media group, with the methodology published.",
    ),
    cuerpo: b(
      [
        "Antes, esos datos estaban dispersos en portales, planillas y PDF de cada jurisdicción, sin una forma unificada y sencilla de acceder a ellos ni de compararlos. El ETL en Python incluye un dataset de PBA 2020–2024 reconstruido a partir de más de 500 resoluciones en PDF, datos que no existen en ningún portal de datos abiertos.",
        "Arquitectura sin backend: la base SQLite (~173 MB) se aloja en Cloudflare R2 y el navegador consulta únicamente los bytes necesarios mediante HTTP Range Requests.",
      ],
      [
        "Before, that data was scattered across portals, spreadsheets and PDFs from each jurisdiction, with no unified, simple way to access it or compare it. The Python ETL includes a Buenos Aires Province 2020–2024 dataset reconstructed from more than 500 PDF resolutions, data that does not exist in any open data portal.",
        "Backendless architecture: the SQLite database (~173 MB) is hosted on Cloudflare R2 and the browser queries only the bytes it needs through HTTP Range Requests.",
      ],
    ),
    dato: {
      valor: b("540.413", "540,413"),
      etiqueta: b("órdenes de publicidad unificadas, de cuatro jurisdicciones", "advertising orders unified from four jurisdictions"),
      nota: b("Nación · CABA · PBA · Santa Fe · 2003–2025", "National government · Buenos Aires City · Buenos Aires Province · Santa Fe · 2003–2025"),
    },
    stack: ["Python", "ETL", "SQLite", "Astro", "React", "TypeScript", "Cloudflare R2/Pages"],
    enlaces: [
      { tipo: "sitio", href: "https://datospautaoficial.com.ar", texto: b("datospautaoficial.com.ar", "datospautaoficial.com.ar") },
      { tipo: "repositorio", href: `${GH}/DatosPautaOficial` },
    ],
    video: {
      id: "o8Ht_Qv4Ji4",
      duracion: 211,
      escenas: [
        { t: 0, titulo: b("La pauta oficial", "Official advertising") },
        { t: 40, titulo: b("Una sola base", "One database") },
        { t: 62, titulo: b("PBA, reconstruida desde PDF", "Buenos Aires Province, rebuilt from PDFs") },
        { t: 90, titulo: b("Ajustada por inflación", "Adjusted for inflation") },
        { t: 114, titulo: b("Consultar la base", "Querying the database") },
        { t: 148, titulo: b("Donde faltan datos", "Where data is missing") },
        { t: 162, titulo: b("Sin backend ni servidores", "No backend, no servers") },
        { t: 184, titulo: b("Stack", "Tech stack") },
      ],
    },
    descripcionMeta: b(
      "540.413 órdenes de pauta oficial de Nación, CABA, PBA y Santa Fe en una sola base, consultable desde el navegador y sin backend.",
      "540,413 Argentine government advertising orders from four jurisdictions in one database, queried from the browser with no backend.",
    ),
    caso: [
      {
        titulo: b("PBA, reconstruida desde PDF", "Buenos Aires Province, rebuilt from PDFs"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["La Provincia de Buenos Aires no publica sus órdenes de publicidad de 2020 a 2024 en datasets abiertos: la información estaba en resoluciones individuales en PDF. Un script fue extrayendo los datos resolución por resolución (más de 500) para reconstruir el detalle de cada orden: proveedor, medio, monto y expediente. Ese tramo es un dataset propio del proyecto."],
              ["Buenos Aires Province does not publish its 2020 to 2024 advertising orders in open datasets: the information sat in individual PDF resolutions. A script extracted the data resolution by resolution (more than 500) to reconstruct the detail of each order: supplier, media outlet, amount and file number. That stretch is a dataset of the project's own."],
            ),
          },
        ],
      },
      {
        titulo: b("Cobertura", "Coverage"),
        bloques: [
          { tipo: "visual", id: "cobertura" },
          {
            tipo: "tabla",
            columnas: b(["Jurisdicción", "Período", "Órdenes"], ["Jurisdiction", "Period", "Orders"]),
            filas: b(
              [
                ["Nación", "2009–2022", "225.367"],
                ["CABA", "2003–2024", "209.877"],
                ["Santa Fe", "2008–2023", "61.187"],
                ["PBA", "2020–2025", "43.982"],
                ["**Total**", "**2003–2025**", "**540.413**"],
              ],
              [
                ["National government (Nación)", "2009–2022", "225,367"],
                ["Buenos Aires City (CABA)", "2003–2024", "209,877"],
                ["Santa Fe", "2008–2023", "61,187"],
                ["Buenos Aires Province (PBA)", "2020–2025", "43,982"],
                ["**Total**", "**2003–2025**", "**540,413**"],
              ],
            ),
            pie: b(
              "Los huecos de cobertura se muestran de forma explícita en la web: nunca se presentan agregados que puedan engañar por cobertura incompleta.",
              "Coverage gaps are shown explicitly on the website: aggregates that could mislead due to incomplete coverage are never presented.",
            ),
          },
        ],
      },
      {
        titulo: b("Arquitectura", "Architecture"),
        bloques: [{ tipo: "visual", id: "tuberia" }],
      },
      {
        titulo: b("Funcionalidades", "Features"),
        bloques: [
          {
            tipo: "lista",
            items: b(
              [
                "**Tabla explorable de 540 mil órdenes.** Filtros cruzados por jurisdicción y año, agrupación por proveedor o medio con filas expandibles. El estado inicial viene precomputado en el HTML, y la base se abre recién cuando el usuario interactúa. El dato que se muestra es el crudo exacto de la fuente oficial.",
                "**«Cuánto recibió».** Buscador por proveedor, medio o grupo mediático; el modo grupo consolida las razones sociales de cada holding según el Media Ownership Monitor Argentina, con fuente citada. Genera una imagen de 1080 × 1080 para compartir, con Canvas puro, y enlaces que restauran la búsqueda.",
                "**Rankings** de proveedores, medios y grupos por jurisdicción y año, servidos desde caches precomputados en el build.",
                "**Metodología pública:** fuentes, criterios de deflactación y de normalización documentados en el sitio.",
              ],
              [
                "**Explorable table of 540 thousand orders.** Cross filters by jurisdiction and year, grouping by supplier or media outlet with expandable rows. The initial state is precomputed into the HTML, and the database opens only when the user interacts. The value shown is the exact raw figure from the official source.",
                "**“Cuánto recibió” (how much it received).** Search by supplier, media outlet or media group; group mode consolidates each holding's companies according to the Media Ownership Monitor Argentina, with the source cited. It generates a 1080 × 1080 image for sharing, with pure Canvas, and links that restore the search.",
                "**Rankings** of suppliers, media outlets and groups by jurisdiction and year, served from caches precomputed at build time.",
                "**Public methodology:** sources, deflation and normalization criteria documented on the site.",
              ],
            ),
          },
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/datos-pauta/sitio", "/medios/datos-pauta/sitio"),
                alt: b(
                  "La portada de Datos Pauta Oficial: 540.413 pautas asignadas, 15.688 medios, 6.481 proveedores y 4 jurisdicciones.",
                  "The Datos Pauta Oficial home page: 540,413 advertising orders, 15,688 media outlets, 6,481 suppliers and 4 jurisdictions.",
                ),
                ancho: 1600,
                alto: 1000,
              },
              {
                src: b("/medios/datos-pauta/movil.webp", "/medios/datos-pauta/movil.webp"),
                alt: b("La portada de Datos Pauta Oficial en un teléfono.", "The Datos Pauta Oficial home page on a phone."),
                ancho: 640,
                alto: 1385,
                telefono: true,
              },
            ],
          },
        ],
      },
      {
        titulo: b("Decisiones de datos", "Data decisions"),
        bloques: [
          {
            tipo: "lista",
            items: b(
              [
                "**Montos deflactados, no nominales.** Todo está en pesos constantes (IPC INDEC): comparar la pauta de 2009 con la de 2024 en pesos nominales no tiene sentido en Argentina.",
                "**El dato exacto, aun a costa de la comodidad.** La tabla muestra cada orden tal como figura en la fuente oficial, sin corregir ni agrupar nombres, aunque eso la haga menos cómoda de leer: un mismo proveedor puede aparecer escrito de varias formas. Los rankings y «Cuánto recibió» sólo unifican variantes de escritura de una misma razón social, con un listado curado de forma conservadora; la consolidación por grupo mediático es una opción aparte, con su fuente citada.",
                "**Honestidad sobre los huecos.** Cada limitación de la fuente (filas sin fecha, períodos parciales) se documenta en vez de ocultarse.",
                "**Postura informativa:** sin denuncia ni opinión.",
              ],
              [
                "**Deflated, not nominal amounts.** Everything is in constant pesos (INDEC CPI): comparing 2009 advertising with 2024 in nominal pesos makes no sense in Argentina.",
                "**The exact figure, even at the cost of convenience.** The table shows every order as it appears in the official source, without correcting or grouping names, even though that makes it less comfortable to read: the same supplier can appear spelled several ways. Rankings and “Cuánto recibió” only unify spelling variants of the same company name, from a conservatively curated list; consolidation by media group is a separate option, with its source cited.",
                "**Honesty about the gaps.** Every source limitation (rows without a date, partial periods) is documented rather than hidden.",
                "**An informative stance:** no accusation, no opinion.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Stack", "Tech stack"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["Capa", "Tecnología"], ["Layer", "Technology"]),
            filas: b(
              [
                ["ETL", "Python: extractores por jurisdicción, unificación y validación"],
                ["Base de datos", "SQLite estática, consultada desde el navegador con `sql.js-httpvfs`"],
                ["Framework", "Astro 6 (salida estática) + React 19 (islas)"],
                ["Lenguaje", "TypeScript"],
                ["Búsqueda", "MiniSearch (índice en el cliente)"],
                ["Hosting", "Cloudflare Pages + Cloudflare R2"],
                ["Deflactación", "IPC INDEC, montos en pesos constantes"],
              ],
              [
                ["ETL", "Python: per-jurisdiction extractors, unification and validation"],
                ["Database", "Static SQLite, queried from the browser with `sql.js-httpvfs`"],
                ["Framework", "Astro 6 (static output) + React 19 (islands)"],
                ["Language", "TypeScript"],
                ["Search", "MiniSearch (client-side index)"],
                ["Hosting", "Cloudflare Pages + Cloudflare R2"],
                ["Deflation", "INDEC CPI, amounts in constant pesos"],
              ],
            ),
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────── SeViVe
  {
    slug: "sevive",
    nombre: "SeViVe",
    marca: "/medios/sevive/marca.webp",
    origen: b("Freelance", "Freelance"),
    periodo: b("dic. 2025 – jun. 2026", "Dec 2025 – Jun 2026"),
    area: b("Full stack", "Full stack"),
    resumen: b(
      "Aplicación de reservas y gestión para un estudio de pilates, en producción con más de 200 usuarios. Los alumnos reservan sus clases desde el celular y la administración gestiona el estudio desde su panel. API REST en Python/FastAPI y PostgreSQL.",
      "A booking and management application for a pilates studio, in production with more than 200 users. Students book their classes from their phones and the administration runs the studio from its panel. REST API in Python/FastAPI and PostgreSQL.",
    ),
    cuerpo: b(
      [
        "La desarrollé como único programador para un estudio de Canning, Buenos Aires (franquicia), desde la definición de requisitos con el cliente hasta la puesta en producción. Finalizado el desarrollo, continúo a cargo del soporte, la administración del servidor y las actualizaciones solicitadas por el cliente.",
        "Reservas con control de concurrencia para evitar sobrerreservas, créditos con vencimiento, turnos fijos con reserva automática, toma de asistencia y calendario con feriados configurables. Las cuentas que crea la administración se unifican automáticamente con la del alumno cuando se registra (por DNI), preservando historial, créditos y turnos.",
        "Se instala como PWA en cualquier dispositivo, con una guía paso a paso pensada para usuarios no técnicos.",
      ],
      [
        "I built it as the sole developer for a studio in Canning, Buenos Aires (a franchise), from defining requirements with the client to production launch. Since development ended, I remain responsible for support, server administration and client-requested updates.",
        "Bookings with concurrency control to prevent overbooking, expiring credits, recurring slots with automatic booking, attendance tracking and a calendar with configurable holidays. Accounts created by the administration merge automatically with the student's own account at sign-up (by national ID), preserving history, credits and slots.",
        "It installs as a PWA on any device, with a step-by-step guide designed for non-technical users.",
      ],
    ),
    dato: {
      valor: b("+200", "200+"),
      etiqueta: b("usuarios", "users"),
    },
    stack: ["Flutter", "Python", "FastAPI", "PostgreSQL", "Firebase", "Docker", "Nginx"],
    enlaces: [
      { tipo: "repositorio", href: `${GH}/PilatesAllCanning_App` },
    ],
    video: {
      id: "nI6Iz2L-hFs",
      duracion: 221,
      escenas: [
        { t: 0, titulo: b("La aplicación", "The app") },
        { t: 30, titulo: b("Reservas en vivo", "Live booking") },
        { t: 42, titulo: b("Dos alumnos, un solo lugar", "Two students, one spot") },
        { t: 55, titulo: b("Turnos fijos", "Fixed classes") },
        { t: 66, titulo: b("Apto médico y novedades", "Medical certificate and news") },
        { t: 92, titulo: b("El panel del estudio", "The studio panel") },
        { t: 117, titulo: b("Alumnos sin la aplicación", "Students without the app") },
        { t: 139, titulo: b("Alumnos, calendario y ajustes", "Students, calendar and settings") },
        { t: 177, titulo: b("La rifa mensual", "The monthly raffle") },
        { t: 188, titulo: b("Stack", "Tech stack") },
      ],
    },
    descripcionMeta: b(
      "App de reservas y gestión para un estudio de pilates, en producción con más de 200 usuarios: Flutter, FastAPI y PostgreSQL.",
      "Booking and management app for a pilates studio, in production with more than 200 users: Flutter, FastAPI and PostgreSQL.",
    ),
    caso: [
      {
        titulo: b("Qué resuelve", "What it solves"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["El objetivo: una aplicación fácil de usar, que permita delegar y ordenar la gestión del estudio, y que al mismo tiempo impida que un alumno rompa las reglas del negocio."],
              ["The goal: an easy-to-use application that lets the studio delegate and organize its management, while keeping any student from breaking the business rules."],
            ),
          },
          {
            tipo: "lista",
            items: b(
              [
                "**Reservas con control de concurrencia.** El backend valida cupos, créditos y horarios en cada reserva: dos alumnos no pueden quedarse con el mismo último lugar.",
                "**Turnos fijos y clases recurrentes.** La administración crea una clase una vez y el sistema genera las instancias semanales respetando los feriados; los abonos se reservan solos cada semana.",
                "**Créditos con vencimiento**, descontados automáticamente con cada reserva, y cancelación con política de sanciones por aviso tardío o ausencia.",
                "**Fusión de cuentas por DNI.** La administración puede cargar alumnos que todavía no tienen la aplicación, para que los cupos y las estadísticas sean reales. Cuando ese alumno se registra con su DNI, las dos cuentas se unifican y conserva turnos fijos, créditos e historial.",
                "**Asistencia.** La administración la toma desde la agenda del día, y el calendario mensual guarda cada clase dictada con su ocupación y su asistencia.",
                "**Panel de administración:** historial por alumno, bloqueo de usuarios con cancelación de sus reservas futuras, pausa general de las reservas y feriados que se cargan desde la aplicación, sin un nuevo despliegue.",
                "**Comunicación:** novedades con notificaciones push y feedback después de cada clase, con aviso por email a la administración ante una respuesta negativa.",
                "**Apto médico:** carga de PDF o imagen, con compresión automática.",
                "**Rifa mensual** entre alumnos activos, ponderada por asistencia, para incentivar la constancia.",
                "**Instalación sin tienda de aplicaciones.** Es una PWA: se instala desde el navegador en el teléfono, la tablet o la computadora, con una guía paso a paso pensada para usuarios no técnicos.",
              ],
              [
                "**Bookings with concurrency control.** The backend validates spots, credits and schedules on every booking: two students cannot both take the same last spot.",
                "**Recurring slots and classes.** The administration creates a class once and the system generates the weekly instances around holidays; memberships book themselves every week.",
                "**Expiring credits**, deducted automatically on each booking, and cancellation with penalties for late notice or no-shows.",
                "**Account merging by national ID.** The administration can add students who do not have the app yet, so that spots and statistics are real. When that student signs up with their ID, both accounts merge and keep recurring slots, credits and history.",
                "**Attendance.** The administration takes it from the day's schedule, and the monthly calendar keeps every class taught with its occupancy and attendance.",
                "**Admin panel:** per-student history, blocking users with cancellation of their future bookings, a global pause on bookings, and holidays added from the app, with no deploy.",
                "**Communication:** announcements with push notifications and feedback after every class, with an email alert to the administration on a negative answer.",
                "**Medical certificate:** PDF or image upload, with automatic compression.",
                "**Monthly raffle** among active students, weighted by attendance, to encourage consistency.",
                "**Installation without an app store.** It is a PWA: it installs from the browser on a phone, tablet or computer, with a step-by-step guide designed for non-technical users.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Arquitectura", "Architecture"),
        bloques: [
          { tipo: "visual", id: "sistema" },
          {
            tipo: "parrafos",
            texto: b(
              [
                "Una sola aplicación en Flutter (Riverpod, Freezed, GoRouter) para alumnos y administración, servida como PWA. El inicio de sesión es el de Google, mediante Firebase, y el backend verifica esa identidad en cada pedido.",
                "Nginx recibe el tráfico por HTTPS, limita los pedidos por dirección IP y sirve la aplicación y los archivos subidos. Detrás, la API asíncrona en FastAPI (SQLModel, asyncpg) trabaja sobre PostgreSQL 16, con los cambios de estructura versionados en Alembic. Las notificaciones push salen por Firebase Cloud Messaging.",
                "Todo corre en tres contenedores de Docker Compose (base de datos, API y Nginx) en un VPS que administro: despliegue con un script que aplica las migraciones, backups y resolución de fallas.",
              ],
              [
                "A single Flutter app (Riverpod, Freezed, GoRouter) for students and administration, served as a PWA. Sign-in is Google's, through Firebase, and the backend verifies that identity on every request.",
                "Nginx receives the traffic over HTTPS, rate-limits requests per IP address and serves the app and the uploaded files. Behind it, the asynchronous FastAPI API (SQLModel, asyncpg) works on PostgreSQL 16, with schema changes versioned in Alembic. Push notifications go out through Firebase Cloud Messaging.",
                "Everything runs in three Docker Compose containers (database, API and Nginx) on a VPS I manage: deployment with a script that applies the migrations, backups and troubleshooting.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Stack", "Tech stack"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["Capa", "Tecnología"], ["Layer", "Technology"]),
            filas: b(
              [
                ["App", "Flutter 3, Riverpod, Freezed, GoRouter, Dio · instalable como PWA"],
                ["Backend", "Python, FastAPI (async), SQLModel, asyncpg"],
                ["Base de datos", "PostgreSQL 16, Alembic"],
                ["Autenticación", "Firebase Authentication (Google)"],
                ["Archivos y avisos", "Firebase Storage, Firebase Cloud Messaging"],
                ["Infraestructura", "Docker Compose, Nginx, VPS en Hetzner"],
              ],
              [
                ["App", "Flutter 3, Riverpod, Freezed, GoRouter, Dio · installable as a PWA"],
                ["Backend", "Python, FastAPI (async), SQLModel, asyncpg"],
                ["Database", "PostgreSQL 16, Alembic"],
                ["Authentication", "Firebase Authentication (Google)"],
                ["Files and notifications", "Firebase Storage, Firebase Cloud Messaging"],
                ["Infrastructure", "Docker Compose, Nginx, VPS on Hetzner"],
              ],
            ),
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────── Inversiones en Argentina
  {
    slug: "inversiones-en-argentina",
    nombre: "Inversiones en Argentina",
    marca: "/medios/inversiones/marca.webp",
    origen: b("Proyecto propio", "Personal project"),
    periodo: b("2026", "2026"),
    area: b("IA · Automatización", "AI · Automation"),
    resumen: b(
      "Automatiza con IA el seguimiento de las inversiones privadas en Argentina. Identifica las inversiones reales, descarta duplicados y publica los resultados en la web y en un canal de Telegram.",
      "Uses AI to track private investments in Argentina. It identifies the real investments, discards duplicates and publishes the results on the website and in a Telegram channel.",
    ),
    cuerpo: b(
      [
        "La información estaba dispersa en noticias, cuentas de X y registros oficiales, y cada inversión aparece repetida en muchos medios, escrita de formas distintas. Un flujo programado en GitHub Actions reúne esas fuentes y suma una búsqueda en Google con Gemini y Search Grounding.",
        "Un sistema de capas decide qué llega a publicarse: Gemini estructura cada mención, reglas deterministas y Jev (TypeSafe) separan las inversiones reales de lo que no lo es, y pgvector recupera los registros parecidos. El mismo proyecto, contado por dos medios, puede leerse muy distinto, y dos proyectos distintos de la misma región pueden parecer casi idénticos: por eso la similitud sólo sugiere candidatos, y la decisión la toman reglas de identidad y un modelo de decisión (Jev). API en FastAPI y frontend en Next.js con render en servidor, sobre Vercel.",
      ],
      [
        "The information was scattered across news outlets, X accounts and official registries, and each investment shows up repeated in many outlets, written in different ways. A scheduled GitHub Actions workflow gathers those sources and adds a Google search with Gemini and Search Grounding.",
        "A layered system decides what gets published: Gemini structures each mention, deterministic rules and Jev (TypeSafe) separate the real investments from everything else, and pgvector retrieves similar records. The same project, reported by two outlets, can read very differently, and two distinct projects in the same region can look almost identical: that is why similarity only suggests candidates, and the decision is made by identity rules and a decision model (Jev). FastAPI API and a Next.js frontend with server-side rendering, on Vercel.",
      ],
    ),
    stack: ["Python", "FastAPI", "Gemini", "Jev (TypeSafe)", "PostgreSQL/pgvector", "GitHub Actions", "Next.js"],
    enlaces: [
      { tipo: "sitio", href: "https://www.inversionesargentina.com.ar", texto: b("inversionesargentina.com.ar", "inversionesargentina.com.ar") },
      { tipo: "repositorio", href: `${GH}/Inversiones_Argentina` },
    ],
    video: {
      id: "aFhefFVcW4M",
      duracion: 176,
      escenas: [
        { t: 0, titulo: b("El problema", "The problem") },
        { t: 17, titulo: b("El producto", "The product") },
        { t: 27, titulo: b("Qué hace", "What it does") },
        { t: 39, titulo: b("El sitio en vivo", "Live demo") },
        { t: 63, titulo: b("En números", "By the numbers") },
        { t: 83, titulo: b("Cómo funciona", "How it works") },
        { t: 115, titulo: b("Lo difícil: los duplicados", "The hard part: duplicates") },
        { t: 136, titulo: b("Web, Telegram y celular", "Web, Telegram and mobile") },
        { t: 147, titulo: b("Stack", "Tech stack") },
      ],
    },
    descripcionMeta: b(
      "Un flujo automático con Gemini, pgvector y Jev rastrea las inversiones privadas en Argentina y publica sólo las reales, sin repetidos.",
      "An automated pipeline with Gemini, pgvector and Jev tracks private investments in Argentina and publishes only the real ones, without duplicates.",
    ),
    caso: [
      {
        titulo: b("El flujo de cada corrida", "The pipeline of each run"),
        bloques: [
          { tipo: "visual", id: "capas" },
          {
            tipo: "lista",
            items: b(
              [
                "**Recolección.** Cuentas especializadas de X (API de Apify), medios de distintos rubros por RSS, paginados hasta cubrir la ventana completa, y el registro oficial del RIGI (el régimen de incentivo a las grandes inversiones) de forma incremental: se guarda una huella de cada proyecto y sólo se reenvían los nuevos o los que cambiaron.",
                "**Filtro de relevancia.** Un filtro determinista descarta el ruido estructural de los feeds antes de que llegue a Gemini. No sólo ahorra tokens: los pasos siguientes reciben menos material irrelevante, y sus decisiones son más simples y con menos margen de error. Prioriza no perder: ante la duda deja pasar, porque descartar de más significa perder una inversión real.",
                "**Extracción con Gemini y Search Grounding.** El material recolectado entra como primera fuente y Gemini busca en Google noticias del período como segunda, con foco en los rubros que las fuentes propias cubren poco. Devuelve cada inversión como JSON estructurado.",
                "**Validación.** Una red determinista descarta lo que no es una inversión productiva nueva: emisiones de deuda, préstamos, constituciones de sociedades, compraventa de acciones, contratos ganados por proveedores y lanzamientos de productos.",
                "**Juicio semántico con Jev.** Un modelo que devuelve decisiones tipadas con probabilidad calibrada, en lugar de texto, responde si cada registro es una inversión privada concreta.",
                "**Deduplicación.** El embedding recupera los candidatos más parecidos; la decisión la toman reglas de identidad y Jev, respondiendo si dos registros describen el mismo proyecto.",
                "**Publicación y parte de estado.** Lo nuevo se guarda y se publica a la vez en la web y en Telegram. Cada corrida termina informando el estado de cada fuente, y falla si alguna que debería responder no trajo nada.",
              ],
              [
                "**Collection.** Specialised X accounts (Apify API), outlets from different sectors via RSS, paginated until the whole window is covered, and the official RIGI registry (the incentive regime for large investments) incrementally: a fingerprint of each project is stored and only new or changed ones are re-sent.",
                "**Relevance filter.** A deterministic filter discards the structural noise in the feeds before it reaches Gemini. It does more than save tokens: the following steps receive less irrelevant material, so their decisions are simpler and leave less room for error. It favours not losing anything: when in doubt it lets an item through, because over-filtering means losing a real investment.",
                "**Extraction with Gemini and Search Grounding.** The collected material goes in as the first source and Gemini searches Google for news from the period as the second, focused on the sectors its own sources cover least. It returns each investment as structured JSON.",
                "**Validation.** A deterministic filter discards whatever is not a new productive investment: debt issuance, loans, company incorporations, share purchases, contracts won by suppliers and product launches.",
                "**Semantic judgement with Jev.** A model that returns typed decisions with calibrated probability, instead of text, answers whether each record is a concrete private investment.",
                "**Deduplication.** The embedding retrieves the closest candidates; the decision is made by identity rules and Jev, answering whether two records describe the same project.",
                "**Publishing and status report.** New records are stored and published at once to the website and Telegram. Each run ends by reporting the status of every source, and fails if one that should be responding returned nothing.",
              ],
            ),
          },
          {
            tipo: "parrafos",
            texto: b(
              ["**Por qué la similitud recupera pero no decide.** Sobre un corpus temáticamente estrecho, el espacio vectorial se comprime. Dos proyectos distintos del mismo rubro y la misma región pueden parecerse tanto como el mismo proyecto contado por dos medios, y no hay un umbral que separe esos dos casos."],
              ["**Why similarity retrieves but does not decide.** Over a thematically narrow corpus, the vector space compresses. Two distinct projects in the same sector and region can look as alike as the same project reported by two outlets, and no threshold separates those two cases."],
            ),
          },
        ],
      },
      {
        titulo: b("Funcionalidades", "Features"),
        bloques: [
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/inversiones/sitio", "/medios/inversiones/sitio"),
                alt: b("La portada de inversionesargentina.com.ar: la bandera, el buscador y la cronología de inversiones.", "The inversionesargentina.com.ar home page: the flag, the search box and the investment timeline."),
                ancho: 1600,
                alto: 1000,
              },
            ],
          },
          {
            tipo: "lista",
            items: b(
              [
                "**Cronología interactiva** ordenada por fecha de anuncio, con el estado de cada inversión (confirmada, anunciada o en evaluación), montos legibles (USD 40M, USD 1.2B), provincia y empleos cuando están disponibles.",
                "**Búsqueda en tiempo real** sobre empresa, descripción y ubicación, sin importar las tildes: «Neuquen» encuentra las inversiones de Neuquén.",
                "**Indexable:** la primera página se renderiza en el servidor, con datos estructurados (JSON-LD), `sitemap.xml` y `robots.txt`.",
                "**API REST** en FastAPI con documentación automática.",
              ],
              [
                "**Interactive timeline** sorted by announcement date, with each investment's status (confirmed, announced or under evaluation), readable amounts (USD 40M, USD 1.2B), province and jobs when available.",
                "**Real-time search** across company, description and location, accent-insensitive: “Neuquen” finds the investments in Neuquén.",
                "**Indexable:** the first page is server-rendered, with structured data (JSON-LD), `sitemap.xml` and `robots.txt`.",
                "**REST API** in FastAPI with automatic documentation.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Stack", "Tech stack"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["Capa", "Tecnología"], ["Layer", "Technology"]),
            filas: b(
              [
                ["Automatización", "GitHub Actions (cada 72 horas)"],
                ["Fuentes", "Apify (X), RSS de medios, registro oficial del RIGI"],
                ["IA generativa", "Gemini 2.5 Flash con Google Search Grounding"],
                ["Juicio semántico", "Jev (TypeSafe)"],
                ["Embeddings", "`gemini-embedding` (768 dimensiones)"],
                ["Base de datos", "PostgreSQL (Neon) con `pgvector` y `unaccent`"],
                ["API", "Python, FastAPI (async), Mangum, sobre Vercel"],
                ["Frontend", "Next.js 16 con render en servidor, TypeScript, Tailwind CSS, Framer Motion"],
                ["Publicación", "Telegram Bot API"],
              ],
              [
                ["Automation", "GitHub Actions (every 72 hours)"],
                ["Sources", "Apify (X), outlet RSS feeds, official RIGI registry"],
                ["Generative AI", "Gemini 2.5 Flash with Google Search Grounding"],
                ["Semantic judgement", "Jev (TypeSafe)"],
                ["Embeddings", "`gemini-embedding` (768 dimensions)"],
                ["Database", "PostgreSQL (Neon) with `pgvector` and `unaccent`"],
                ["API", "Python, FastAPI (async), Mangum, on Vercel"],
                ["Frontend", "Server-rendered Next.js 16, TypeScript, Tailwind CSS, Framer Motion"],
                ["Publishing", "Telegram Bot API"],
              ],
            ),
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── FaceHunt 2
  {
    slug: "facehunt-2",
    nombre: "FaceHunt 2",
    marca: "/medios/facehunt-2/marca.webp",
    origen: b("Proyecto propio", "Personal project"),
    periodo: b("2026", "2026"),
    area: b("Visión por computador", "Computer vision"),
    resumen: b(
      "Sistema de reconocimiento facial con IA y deep learning que, a partir de una foto, localiza cada aparición de una persona en horas de video, incluso de perfil, parcialmente cubierta o en baja resolución.",
      "A facial recognition system with AI and deep learning that, from a photo, finds every appearance of a person in hours of video, even in profile, partially covered or at low resolution.",
    ),
    cuerpo: b(
      [
        "Procesa todo en local con aceleración por GPU, sin enviar datos a la nube. Es una aplicación de escritorio que devuelve los intervalos de tiempo exactos, con miniatura, mini-clip y acceso directo a cada momento, para un archivo local o un video de YouTube. Aplicable a seguridad, investigación y análisis de video.",
        "Reconocimiento facial con InsightFace (ArcFace, embeddings de 512 dimensiones) sobre ONNX Runtime, con aceleración por GPU según el hardware disponible y seguimiento entre cuadros. Es la reconstrucción integral de la primera versión, FaceHunt (2025): de TensorFlow en CPU a ONNX Runtime con GPU.",
      ],
      [
        "Everything is processed locally with GPU acceleration, without sending data to the cloud. It is a desktop application that returns exact time ranges, with a thumbnail, a mini-clip and direct access to each moment, for a local file or a YouTube video. Applicable to security, investigation and video analysis.",
        "Facial recognition with InsightFace (ArcFace, 512-dimensional embeddings) on ONNX Runtime, with GPU acceleration based on the available hardware and cross-frame tracking. It is a full rebuild of the first version, FaceHunt (2025): from TensorFlow on CPU to ONNX Runtime on GPU.",
      ],
    ),
    dato: {
      valor: b("7 s", "7 s"),
      etiqueta: b(
        "para encontrar una aparición de un segundo en un video de 70 segundos",
        "to find a one-second appearance in a 70-second video",
      ),
      visual: "busqueda",
    },
    stack: ["Python", "InsightFace", "ArcFace", "ONNX Runtime", "FastAPI", "pywebview", "pytest"],
    enlaces: [
      { tipo: "repositorio", href: `${GH}/FaceHunt-2` },
      { tipo: "descarga", href: `${GH}/FaceHunt-2/releases`, texto: b("Descargar (Windows)", "Download (Windows)") },
    ],
    video: {
      id: "huNRQiAW_ss",
      duracion: 195,
      escenas: [
        { t: 0, titulo: b("Millones de rostros", "Millions of faces") },
        { t: 28, titulo: b("Qué hace", "What it does") },
        { t: 46, titulo: b("La prueba", "The test") },
        { t: 64, titulo: b("La búsqueda", "The search") },
        { t: 92, titulo: b("Por dentro: detección, ArcFace y seguimiento", "Inside: detection, ArcFace and tracking") },
        { t: 128, titulo: b("Seguridad", "Security") },
        { t: 150, titulo: b("Todo en local", "Everything runs locally") },
        { t: 166, titulo: b("Stack", "Tech stack") },
      ],
    },
    primeraVersion: {
      nombre: "FaceHunt",
      periodo: b("2025", "2025"),
      texto: b(
        "Reconocimiento facial en video con deep learning: DeepFace (FaceNet) con dos modos de análisis (alta precisión con RetinaFace, equilibrado con MTCNN), extracción de cuadros por lotes con OpenCV y descarga de YouTube con yt-dlp. Empezó como aplicación de escritorio en Tkinter y sumó una API en FastAPI con interfaz web por pasos. Se publicó como demo web en Hugging Face Spaces y como imagen en Docker Hub, y corre en Windows, macOS y Linux.",
        "Deep learning facial recognition in video: DeepFace (FaceNet) with two analysis modes (high precision with RetinaFace, balanced with MTCNN), batched frame extraction with OpenCV and YouTube downloads with yt-dlp. It started as a Tkinter desktop app and gained a FastAPI API with a step-by-step web interface. It was published as a web demo on Hugging Face Spaces and as an image on Docker Hub, and runs on Windows, macOS and Linux.",
      ),
      stack: ["Python", "DeepFace", "FaceNet", "RetinaFace", "FastAPI", "Docker", "Hugging Face Spaces"],
      enlaces: [{ tipo: "repositorio", href: `${GH}/FaceHunt` }],
      imagen: {
        src: b("/medios/facehunt-2/v1.webp", "/medios/facehunt-2/v1.webp"),
        alt: b("La interfaz web de la primera versión de FaceHunt, en el paso de carga de la foto de referencia.", "The web interface of the first version of FaceHunt, at the reference photo step."),
        ancho: 1280,
        alto: 720,
      },
    },
    descripcionMeta: b(
      "Aplicación de escritorio que encuentra cada aparición de una persona en un video a partir de una foto. InsightFace, ArcFace y ONNX Runtime, 100% local.",
      "Desktop app that finds every appearance of a person in a video from a photo. InsightFace, ArcFace and ONNX Runtime, 100% local.",
    ),
    caso: [
      {
        titulo: b("Qué hace", "What it does"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["Se cargan una o varias fotos de la persona y un video (archivo local o URL de YouTube). La aplicación devuelve los rangos de tiempo exactos en los que aparece, cada uno con una miniatura del rostro, un mini-clip animado del momento y un salto directo, más una línea de tiempo del video completo en la que se puede hacer clic."],
              ["You load one or more photos of the person and a video (a local file or a YouTube URL). The application returns the exact time ranges in which they appear, each with a thumbnail of the face, an animated mini-clip of the moment and a direct jump, plus a clickable timeline of the whole video."],
            ),
          },
        ],
      },
      {
        titulo: b("Cómo funciona una búsqueda", "How a search works"),
        bloques: [
          {
            tipo: "lista",
            items: b(
              [
                "**Referencia.** Se validan las fotos y se calcula un embedding de 512 dimensiones por rostro; con varias fotos se promedian, para una identificación más estable.",
                "**Video.** Se valida el archivo o la URL (YouTube se descarga con yt-dlp).",
                "**Análisis en segundo plano.** Un hilo productor lee los cuadros y otro los analiza: detección con SCRFD, comparación por coseno contra la referencia y seguimiento de cada rostro entre cuadros.",
                "**Progreso en vivo.** El avance, el tiempo restante y las coincidencias llegan por Server-Sent Events, y la búsqueda se puede cancelar en cualquier momento.",
                "**Resultados.** Las coincidencias se agrupan en rangos, cada uno con su miniatura, su mini-clip y su enlace.",
              ],
              [
                "**Reference.** The photos are validated and a 512-dimensional embedding is computed per face; with several photos they are averaged, for a more stable identification.",
                "**Video.** The file or URL is validated (YouTube is downloaded with yt-dlp).",
                "**Background analysis.** A producer thread reads frames and another analyses them: detection with SCRFD, cosine comparison against the reference and tracking of each face across frames.",
                "**Live progress.** Progress, remaining time and matches arrive through Server-Sent Events, and the search can be cancelled at any moment.",
                "**Results.** Matches are grouped into ranges, each with its thumbnail, mini-clip and link.",
              ],
            ),
          },
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/facehunt-2/interfaz", "/medios/facehunt-2/interfaz"),
                alt: b("La interfaz de FaceHunt 2 en el primer paso: subir la foto de referencia.", "The FaceHunt 2 interface at the first step: uploading the reference photo."),
                ancho: 1600,
                alto: 1000,
              },
            ],
            pie: b("La interfaz corre en una ventana nativa (pywebview) sobre un servidor FastAPI local.", "The interface runs in a native window (pywebview) on top of a local FastAPI server."),
          },
        ],
      },
      {
        titulo: b("Características", "Features"),
        bloques: [
          {
            tipo: "lista",
            items: b(
              [
                "**100% local y privado.** Las fotos y los videos nunca salen del equipo: no hay servidor en línea ni subida a la nube.",
                "**Reconocimiento facial actual.** InsightFace `antelopev2` (SCRFD-10G + ArcFace ResNet100 entrenado en Glint360K, embeddings de 512 dimensiones) sobre ONNX Runtime, con flip-TTA para no perder apariciones.",
                "**Aceleración por GPU automática.** Elige el mejor proveedor disponible (CUDA, DirectML o CPU): funciona con placas NVIDIA, AMD e Intel en Windows.",
                "**Seguimiento temporal.** Agrupa los rostros en tracklets entre cuadros y compara contra el embedding agregado, lo que recupera apariciones en cuadros degradados (de perfil, tapadas o en baja resolución).",
                "**Dos modos:** rápido (2 cuadros por segundo) y exhaustivo (5 cuadros por segundo y rostros más chicos).",
                "**Ejecutable de un clic** para Windows, con tests de la lógica pura en pytest.",
              ],
              [
                "**100% local and private.** Photos and videos never leave the computer: no online server and no cloud upload.",
                "**Current facial recognition.** InsightFace `antelopev2` (SCRFD-10G + ArcFace ResNet100 trained on Glint360K, 512-dimensional embeddings) on ONNX Runtime, with flip-TTA so appearances are not missed.",
                "**Automatic GPU acceleration.** It picks the best available provider (CUDA, DirectML or CPU): it works with NVIDIA, AMD and Intel cards on Windows.",
                "**Temporal tracking.** It groups faces into tracklets across frames and compares against the aggregated embedding, which recovers appearances in degraded frames (in profile, covered or at low resolution).",
                "**Two modes:** fast (2 frames per second) and thorough (5 frames per second and smaller faces).",
                "**One-click executable** for Windows, with pytest tests for the pure logic.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("De FaceHunt a FaceHunt 2", "From FaceHunt to FaceHunt 2"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["", "FaceHunt (2025)", "FaceHunt 2 (2026)"], ["", "FaceHunt (2025)", "FaceHunt 2 (2026)"]),
            filas: b(
              [
                ["Motor", "TensorFlow en CPU", "ONNX Runtime con GPU (CUDA, DirectML o CPU)"],
                ["Modelo", "FaceNet, 128 dimensiones", "ArcFace ResNet100, 512 dimensiones"],
                ["Resultado", "Marcas de tiempo sueltas", "Rangos con miniatura, mini-clip y línea de tiempo"],
                ["Uso", "Interfaz web: demo en Hugging Face Spaces o imagen de Docker", "Aplicación de escritorio de un clic, sin servidor ni nube"],
              ],
              [
                ["Engine", "TensorFlow on CPU", "ONNX Runtime on GPU (CUDA, DirectML or CPU)"],
                ["Model", "FaceNet, 128 dimensions", "ArcFace ResNet100, 512 dimensions"],
                ["Result", "Loose timestamps", "Ranges with thumbnail, mini-clip and timeline"],
                ["Use", "Web interface: demo on Hugging Face Spaces or a Docker image", "One-click desktop application, no server or cloud"],
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Stack", "Tech stack"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["Capa", "Tecnología"], ["Layer", "Technology"]),
            filas: b(
              [
                ["Reconocimiento", "InsightFace (SCRFD + ArcFace), ONNX Runtime"],
                ["Video", "OpenCV, yt-dlp"],
                ["Backend", "Python, FastAPI, Server-Sent Events"],
                ["Interfaz", "HTML, CSS y JavaScript sin build, en una ventana pywebview"],
                ["Pruebas y empaquetado", "pytest, PyInstaller, instalador para Windows"],
              ],
              [
                ["Recognition", "InsightFace (SCRFD + ArcFace), ONNX Runtime"],
                ["Video", "OpenCV, yt-dlp"],
                ["Backend", "Python, FastAPI, Server-Sent Events"],
                ["Interface", "HTML, CSS and JavaScript with no build step, in a pywebview window"],
                ["Testing and packaging", "pytest, PyInstaller, Windows installer"],
              ],
            ),
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────── MementoLife
  {
    slug: "mementolife",
    nombre: "MementoLife",
    marca: "/medios/mementolife/marca.webp",
    origen: b("Proyecto propio", "Personal project"),
    periodo: b("2026", "2026"),
    area: b("Extensión de Chrome", "Chrome extension"),
    resumen: b(
      "Extensión de Chrome publicada en la Chrome Web Store que reemplaza la pestaña nueva por una grilla con las semanas de la vida, calculada a partir de la fecha de nacimiento.",
      "A Chrome extension published on the Chrome Web Store that replaces the new tab with a grid of the weeks of a life, calculated from the date of birth.",
    ),
    cuerpo: b(
      [
        "Tema claro, oscuro o del sistema, interfaz completa en 6 idiomas y una efeméride histórica para cada día del año. Ninguna conexión de red y un solo permiso (storage): la fecha de nacimiento se guarda sólo en el equipo.",
        "TypeScript, sin frameworks ni bundler: ESM nativo compilado con tsc. Tests unitarios y de snapshots con Vitest, pruebas de extremo a extremo con Playwright sobre la extensión empaquetada y CI con GitHub Actions.",
      ],
      [
        "Light, dark or system theme, a full interface in 6 languages and a historical fact for every day of the year. No network connections and a single permission (storage): the date of birth is stored only on the device.",
        "TypeScript with no framework or bundler: native ESM compiled with tsc. Unit and snapshot tests with Vitest, end-to-end tests with Playwright on the packaged extension, and CI with GitHub Actions.",
      ],
    ),
    dato: {
      valor: b("3 trazados", "3 paths"),
      etiqueta: b(
        "SVG para dibujar 4.160 semanas, en lugar de un elemento por semana. El renderizado baja de 10,00 ms a 1,30 ms.",
        "in SVG to draw 4,160 weeks, instead of one element per week. Rendering drops from 10.00 ms to 1.30 ms.",
      ),
    },
    stack: ["TypeScript", "Manifest V3", "SVG", "Vitest", "Playwright", "GitHub Actions"],
    enlaces: [
      { tipo: "tienda", href: "https://chromewebstore.google.com/detail/mementolife/eackmngdibobdeciapcedkmjoecaiblp", texto: b("Chrome Web Store", "Chrome Web Store") },
      { tipo: "repositorio", href: `${GH}/MementoLife` },
    ],
    video: {
      id: "tZbJvq8xoBk",
      duracion: 34,
    },
    descripcionMeta: b(
      "Extensión de Chrome que reemplaza la pestaña nueva por las semanas de la vida: 4.160 semanas dibujadas con 3 trazados SVG, en 6 idiomas y sin red.",
      "Chrome extension that replaces the new tab with the weeks of a life: 4,160 weeks drawn with 3 SVG paths, in 6 languages and with no network.",
    ),
    caso: [
      {
        titulo: b("Qué hace", "What it does"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["Cada punto es una semana. Las vividas se dibujan llenas, las que faltan apenas insinuadas, y un anillo marca la semana actual. La esperanza de vida se ajusta entre 20 y 100 años, y cada día muestra una efeméride histórica distinta, en los 6 idiomas, que se puede desactivar."],
              ["Every dot is one week. The weeks lived are drawn filled in, the ones ahead barely there, and a ring marks the current week. Life expectancy can be set between 20 and 100 years, and every day shows a different historical fact, in all 6 languages, which can be turned off."],
            ),
          },
        ],
      },
      {
        titulo: b("La grilla, en vivo", "The grid, live"),
        bloques: [
          { tipo: "visual", id: "grilla" },
          {
            tipo: "parrafos",
            texto: b(
              ["La grilla de esta página se dibuja con la misma técnica que la extensión: tres trazados SVG acumulados (pasado, futuro y anillo) en lugar de un elemento por celda. En la extensión, eso evita 4.160 elementos y baja el renderizado de 10,00 ms a 1,30 ms, medido contra la alternativa de un elemento por semana."],
              ["The grid on this page is drawn with the same technique as the extension: three accumulated SVG paths (past, future and ring) instead of one element per cell. In the extension, that avoids 4,160 elements and brings rendering down from 10.00 ms to 1.30 ms, measured against the alternative of one element per week."],
            ),
          },
        ],
      },
      {
        titulo: b("Capturas", "Screenshots"),
        bloques: [
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/mementolife/oscuro", "/medios/mementolife/oscuro"),
                alt: b("MementoLife en tema oscuro: el porcentaje de vida, la semana actual y la grilla de puntos.", "MementoLife in dark theme: the percentage of life, the current week and the dot grid."),
                ancho: 1280,
                alto: 800,
                anchos: [960, 1280],
              },
              {
                src: b("/medios/mementolife/claro", "/medios/mementolife/claro"),
                alt: b("MementoLife en tema claro.", "MementoLife in light theme."),
                ancho: 1280,
                alto: 800,
                anchos: [960, 1280],
              },
              {
                src: b("/medios/mementolife/opciones.webp", "/medios/mementolife/opciones.webp"),
                alt: b("La página de opciones: fecha de nacimiento, esperanza de vida, tema e idioma.", "The options page: date of birth, life expectancy, theme and language."),
                ancho: 960,
                alto: 600,
              },
              {
                src: b("/medios/mementolife/efemeride.webp", "/medios/mementolife/efemeride.webp"),
                alt: b("La efeméride del día debajo del porcentaje.", "The fact of the day under the percentage."),
                ancho: 960,
                alto: 600,
              },
            ],
          },
        ],
      },
      {
        titulo: b("Privacidad", "Privacy"),
        bloques: [
          {
            tipo: "lista",
            items: b(
              [
                "Ninguna conexión de red.",
                "Un solo permiso: `storage`.",
                "La fecha de nacimiento se guarda en `chrome.storage.local`, nunca en `sync`: no viaja por la cuenta de Google.",
              ],
              [
                "No network connections.",
                "A single permission: `storage`.",
                "The date of birth is stored in `chrome.storage.local`, never in `sync`: it never travels through the Google account.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Stack", "Tech stack"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["Capa", "Tecnología"], ["Layer", "Technology"]),
            filas: b(
              [
                ["Lenguaje", "TypeScript"],
                ["Ejecución", "Sin framework ni bundler: ESM nativo, `tsc` como único paso de build"],
                ["Render", "SVG generado por un núcleo puro: sin DOM, sin `chrome.*`, la fecha entra como parámetro"],
                ["Pruebas", "Vitest (unitarios y snapshots) + Playwright (extremo a extremo sobre el paquete real)"],
                ["Empaquetado", "Manifest V3, un solo permiso, sin service worker"],
                ["CI", "GitHub Actions en cada push"],
              ],
              [
                ["Language", "TypeScript"],
                ["Runtime", "No framework, no bundler: native ESM, `tsc` as the only build step"],
                ["Render", "SVG from a pure core: no DOM, no `chrome.*`, the date comes in as a parameter"],
                ["Testing", "Vitest (unit + snapshots) + Playwright (end-to-end on the real package)"],
                ["Packaging", "Manifest V3, a single permission, no service worker"],
                ["CI", "GitHub Actions on every push"],
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Historia del proyecto", "Project history"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["MementoLife empezó como una aplicación de Android que ponía la grilla en la pantalla de bloqueo. Funcionaba, pero MIUI y One UI ignoran en silencio los intentos de actualizar sólo la pantalla de bloqueo (`setBitmap(..., FLAG_LOCK)` no falla: no hace nada). En vez de romper una decisión de diseño del proyecto, se cambió de plataforma."],
              ["MementoLife started as an Android app that put the grid on the lock screen. It worked, but MIUI and One UI silently ignore attempts to update only the lock screen (`setBitmap(..., FLAG_LOCK)` does not fail: it does nothing). Rather than break one of the project's design decisions, the platform changed."],
            ),
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────── Rugidos
  {
    slug: "rugidos-fiestas",
    nombre: "Rugidos Fiestas",
    marca: "/medios/rugidos/marca.webp",
    origen: b("Rugidos Fiestas Tandil", "Rugidos Fiestas Tandil"),
    periodo: b("2023 – actualidad", "2023 – present"),
    area: b("Sitio web comercial", "Commercial website"),
    resumen: b(
      "Sitio comercial de una empresa de eventos, mobile first y optimizado para búsquedas locales.",
      "Commercial website for an events company, mobile first and optimized for local search.",
    ),
    cuerpo: b(
      [
        "Diseñé, desarrollé y mantengo el sitio web comercial de la empresa, en producción. La versión actual está hecha con Next.js, TypeScript, Tailwind CSS y Framer Motion, con diseño UX/UI propio.",
        "Los efectos pesados se desactivan en teléfonos para sostener la fluidez del scroll, el feed de Instagram y las reseñas son contenido local en lugar de widgets externos, y los datos estructurados ayudan en las búsquedas locales.",
      ],
      [
        "I designed, built and maintain the company's commercial website, in production. The current version is built with Next.js, TypeScript, Tailwind CSS and Framer Motion, with my own UX/UI design.",
        "Heavy effects are turned off on phones to keep scrolling smooth, the Instagram feed and the reviews are local content instead of external widgets, and structured data helps with local search.",
      ],
    ),
    dato: {
      valor: b("95 / 100", "95 / 100"),
      etiqueta: b(
        "de rendimiento en Lighthouse con el perfil móvil, sobre el sitio en producción (99 en escritorio)",
        "Lighthouse performance with the mobile profile, on the live site (99 on desktop)",
      ),
      nota: b("Mediana de 3 corridas · septiembre de 2026", "Median of 3 runs · September 2026"),
    },
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Lenis", "shadcn/ui", "Vercel"],
    enlaces: [
      { tipo: "sitio", href: "https://www.rugidosfiestas.com.ar", texto: b("rugidosfiestas.com.ar", "rugidosfiestas.com.ar") },
      { tipo: "repositorio", href: `${GH}/RugidosWebSite` },
    ],
    primeraVersion: {
      nombre: "RugidosWebSite 2023",
      periodo: b("2023 – 2026", "2023 – 2026"),
      texto: b(
        "En producción desde 2023 hasta ser reemplazada por la versión actual. HTML, CSS y JavaScript sin frameworks, con deploy automático a cPanel. Desarrollada sin asistencia de IA.",
        "In production from 2023 until it was replaced by the current version. HTML, CSS and JavaScript with no frameworks, with automatic deploy to cPanel. Built without AI assistance.",
      ),
      stack: ["HTML5", "CSS3", "JavaScript"],
      enlaces: [{ tipo: "repositorio", href: `${GH}/RugidosWebSite-2023-Legacy` }],
      imagen: {
        src: b("/medios/rugidos/primera-version", "/medios/rugidos/primera-version"),
        alt: b("La portada del sitio de 2023: fondo rosa, el león de Rugidos y los enlaces a redes.", "The 2023 site's home page: pink background, the Rugidos lion and the social links."),
        ancho: 1600,
        alto: 770,
      },
    },
    descripcionMeta: b(
      "Sitio comercial de Rugidos Fiestas Tandil, en producción: Next.js, TypeScript, Tailwind CSS y Framer Motion, mobile first y optimizado para búsquedas locales.",
      "Commercial website of Rugidos Fiestas Tandil, in production: Next.js, TypeScript, Tailwind CSS and Framer Motion, mobile first and optimized for local search.",
    ),
    caso: [
      {
        titulo: b("El sitio", "The website"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["El sitio es el canal comercial de Rugidos Fiestas Tandil, una PyME de eventos infantiles: tiene que mostrar el salón, los servicios y los extras, y llevar al visitante a una consulta por WhatsApp. Por eso se diseñó primero para el teléfono."],
              ["The website is the sales channel of Rugidos Fiestas Tandil, a children's events business: it has to show the venue, the services and the extras, and lead visitors to a WhatsApp enquiry. That is why it was designed for phones first."],
            ),
          },
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/rugidos/servicios", "/medios/rugidos/servicios"),
                alt: b("La sección «¿Por qué elegirnos?»: los contadores de años y eventos y las tarjetas de atención, propuestas, espacio y experiencia.", "The “Why choose us?” section: the years and events counters and the cards for service, ideas, venue and experience."),
                ancho: 1600,
                alto: 1000,
              },
              {
                src: b("/medios/rugidos/movil.webp", "/medios/rugidos/movil.webp"),
                alt: b("El sitio en un teléfono.", "The website on a phone."),
                ancho: 640,
                alto: 1385,
                telefono: true,
              },
            ],
          },
        ],
      },
      {
        titulo: b("Secciones y funcionalidades", "Sections and features"),
        bloques: [
          {
            tipo: "lista",
            items: b(
              [
                "**Nuestro espacio:** galería con lightbox navegable con teclado y una grilla con las características del salón.",
                "**Academia de Estrellas:** en escritorio, una máscara radial que sigue al cursor revela el look «superstar» debajo del casual; en teléfonos, un comparador antes/después que se arrastra con el dedo.",
                "**Detección real de hover** (`hover: hover` y `pointer: fine`) en lugar de un corte por ancho, para no romper la experiencia en tablets táctiles.",
                "**Reseñas:** resumen de Google Reviews y marquesinas con pausa manual, sin depender de widgets.",
                "**Contacto:** un botón de WhatsApp que abre la conversación con el mensaje ya escrito, la dirección del salón con su mapa de Google, las redes y una selección de publicaciones de Instagram.",
              ],
              [
                "**Our venue:** a gallery with a keyboard-navigable lightbox and a grid of the venue's features.",
                "**Star Academy:** on desktop, a radial mask that follows the cursor reveals the “superstar” look under the casual one; on phones, a before/after slider dragged with a finger.",
                "**Real hover detection** (`hover: hover` and `pointer: fine`) instead of a width breakpoint, so the experience does not break on touch tablets.",
                "**Reviews:** a Google Reviews summary and marquees with a manual pause, with no dependency on widgets.",
                "**Contact:** a WhatsApp button that opens the chat with the message already written, the venue's address with its Google map, the social links and a selection of Instagram posts.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Rendimiento", "Performance"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["Lighthouse", "Móvil", "Escritorio"], ["Lighthouse", "Mobile", "Desktop"]),
            filas: b(
              [
                ["Rendimiento", "**95**", "**99**"],
                ["Accesibilidad", "96", "96"],
                ["Buenas prácticas", "100", "100"],
                ["SEO", "100", "100"],
                ["LCP", "2,9 s", "0,8 s"],
                ["CLS", "0", "0"],
              ],
              [
                ["Performance", "**95**", "**99**"],
                ["Accessibility", "96", "96"],
                ["Best practices", "100", "100"],
                ["SEO", "100", "100"],
                ["LCP", "2.9 s", "0.8 s"],
                ["CLS", "0", "0"],
              ],
            ),
            pie: b(
              "Lighthouse 12 sobre el sitio en producción, mediana de 3 corridas por perfil (septiembre de 2026).",
              "Lighthouse 12 on the live site, median of 3 runs per profile (September 2026).",
            ),
          },
          {
            tipo: "lista",
            items: b(
              [
                "Parallax, efecto 3D de las tarjetas, vidrio esmerilado y animaciones de entrada se desactivan en teléfonos, para que el contenido llegue antes y el scroll se mantenga fluido en equipos de gama media.",
                "El logo pasó de PNG (127 KB) a WebP (7 KB), y el recurso crítico del hero se pide con prioridad alta.",
                "Las fotos del salón y de los extras se procesaron en lote con Sharp: de ~15,6 MB a ~1,8 MB.",
                "El feed de Instagram y las reseñas de Google se sirven como contenido local: sin dependencias externas ni saltos de diseño mientras cargan.",
              ],
              [
                "Parallax, the cards' 3D effect, frosted glass and entrance animations are turned off on phones, so content arrives sooner and scrolling stays smooth on mid-range devices.",
                "The logo went from PNG (127 KB) to WebP (7 KB), and the hero's critical asset is requested with high priority.",
                "The venue and extras photos were batch-processed with Sharp: from ~15.6 MB to ~1.8 MB.",
                "The Instagram feed and the Google reviews are served as local content: no external dependencies and no layout shifts while they load.",
              ],
            ),
          },
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/rugidos/espacio", "/medios/rugidos/espacio"),
                alt: b("Las tarjetas de servicios y la sección violeta con cumpleaños, capacidad y precio congelado.", "The service cards and the purple section with birthdays, capacity and frozen price."),
                ancho: 1600,
                alto: 1000,
              },
            ],
          },
        ],
      },
      {
        titulo: b("Stack", "Tech stack"),
        bloques: [
          {
            tipo: "tabla",
            columnas: b(["Capa", "Tecnología"], ["Layer", "Technology"]),
            filas: b(
              [
                ["Framework", "Next.js (App Router), TypeScript"],
                ["Estilos y componentes", "Tailwind CSS, shadcn/ui, Radix UI, Lucide"],
                ["Movimiento", "Framer Motion, Lenis (sólo en escritorio)"],
                ["Deploy", "Vercel, Vercel Analytics"],
              ],
              [
                ["Framework", "Next.js (App Router), TypeScript"],
                ["Styling and components", "Tailwind CSS, shadcn/ui, Radix UI, Lucide"],
                ["Motion", "Framer Motion, Lenis (desktop only)"],
                ["Deploy", "Vercel, Vercel Analytics"],
              ],
            ),
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────────── Navkok
  {
    slug: "navkok-security-group",
    nombre: "Navkok Security Group",
    marca: "/medios/navkok/marca.webp",
    origen: b("Freelance", "Freelance"),
    periodo: b("mar. – abr. 2026", "Mar – Apr 2026"),
    area: b("Sitio institucional", "Corporate website"),
    resumen: b(
      "Rediseño completo del sitio institucional de una empresa de seguridad privada con más de 30 años de trayectoria y certificaciones ISO 9001, 14001 y 45001.",
      "A complete redesign of the corporate website of a private security company with more than 30 years in business and ISO 9001, 14001 and 45001 certifications.",
    ),
    cuerpo: b(
      [
        "Proyecto freelance a mi cargo de principio a fin, desde la venta del proyecto hasta su finalización. Definí la arquitectura de información y el diseño UX/UI, redacté los textos institucionales y produje con herramientas de IA el contenido multimedia.",
        "El diseño incluye el formulario de contacto y la sección «Trabajá con nosotros», donde un código QR se arma pieza por pieza al entrar en pantalla y lleva al formulario de postulación. Next.js, React, TypeScript y Tailwind CSS, con microanimaciones y diseño responsive.",
      ],
      [
        "A freelance project I handled end to end, from selling the project to its completion. I defined the information architecture and the UX/UI design, wrote the corporate copy and produced the multimedia content with AI tools.",
        "The design includes the contact form and the “Work with us” section, where a QR code assembles itself piece by piece as it enters the screen and leads to the application form. Next.js, React, TypeScript and Tailwind CSS, with micro-animations and responsive design.",
      ],
    ),
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    enlaces: [
      { tipo: "vista-previa", href: "https://navkok-website-private.vercel.app", texto: b("Vista previa", "Preview") },
      { tipo: "repositorio", href: `${GH}/NavkokSecurityGroup_Website` },
    ],
    descripcionMeta: b(
      "Proyecto freelance: rediseño completo del sitio institucional de una empresa de seguridad privada con más de 30 años de trayectoria.",
      "Freelance project: a complete redesign of the corporate website of a private security company with more than 30 years in business.",
    ),
    caso: [
      {
        titulo: b("Qué hice", "What I did"),
        bloques: [
          {
            tipo: "lista",
            items: b(
              [
                "**Relación con el cliente:** venta del proyecto y trato directo durante todo el desarrollo.",
                "**Contenido:** definí las secciones del sitio y redacté los textos institucionales con el tono de la empresa.",
                "**Contenido multimedia:** producido con herramientas de IA y curado para la identidad de la marca.",
                "**Formularios:** el de contacto, con validación de campos, y el de postulación, al que lleva un código QR que se arma pieza por pieza al entrar en pantalla.",
                "**Desarrollo:** Next.js, React, TypeScript y Tailwind CSS, con microanimaciones y diseño responsive.",
              ],
              [
                "**Client relationship:** selling the project and direct contact throughout development.",
                "**Content:** I defined the site's sections and wrote the corporate copy in the company's tone.",
                "**Multimedia content:** produced with AI tools and curated for the brand identity.",
                "**Forms:** the contact form, with field validation, and the application form, reached through a QR code that assembles itself piece by piece as it enters the screen.",
                "**Development:** Next.js, React, TypeScript and Tailwind CSS, with micro-animations and responsive design.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Diseño", "Design"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["Un sistema visual oscuro con acento dorado: la paleta, la tipografía y los componentes se definieron desde cero para transmitir la experiencia y las credenciales de la empresa. El contenido multimedia se optimizó con FFmpeg (compresión y recorte del video) y con Sharp (las imágenes, en lote)."],
              ["A dark visual system with a gold accent: the palette, typography and components were defined from scratch to convey the company's track record and credentials. The multimedia content was optimized with FFmpeg (compressing and trimming the video) and with Sharp (the images, in batch)."],
            ),
          },
          {
            tipo: "imagenes",
            imagenes: [
              {
                src: b("/medios/navkok/sitio", "/medios/navkok/sitio"),
                alt: b("El hero del sitio: el escudo de Navkok, el nombre en dorado y las provincias donde opera.", "The site's hero: the Navkok badge, the name in gold and the provinces where it operates."),
                ancho: 1600,
                alto: 1000,
              },
              {
                src: b("/medios/navkok/movil.webp", "/medios/navkok/movil.webp"),
                alt: b("El sitio en un teléfono.", "The website on a phone."),
                ancho: 640,
                alto: 1385,
                telefono: true,
              },
            ],
          },
        ],
      },
    ],
  },

  // ───────────────────────────────────────────────────────── FreeMagicMirror
  {
    slug: "freemagicmirror",
    nombre: "FreeMagicMirror",
    marca: "/medios/freemagicmirror/marca.webp",
    origen: b("Rugidos Fiestas Tandil", "Rugidos Fiestas Tandil"),
    periodo: b("2025", "2025"),
    area: b("Aplicación de escritorio", "Desktop application"),
    resumen: b(
      "Aplicación de fotomatón táctil en uso en el salón de Rugidos, distribuida como ejecutable portable para Windows.",
      "A touchscreen photo booth application in use at the Rugidos venue, distributed as a portable Windows executable.",
    ),
    cuerpo: b(
      [
        "Captura con cuenta regresiva animada, editor multitáctil con dibujo libre y stickers que se escalan y rotan con los dedos, y guardado automático en una galería local. Pensada para chicos: videos animados, transiciones suaves y controles grandes.",
        "Python, Kivy y OpenCV. Un panel de administración oculto (cinco toques en una esquina) permite elegir cámara, orientación y monitor, y la aplicación corre en modo kiosco, a pantalla completa y sin bordes.",
      ],
      [
        "Capture with an animated countdown, a multitouch editor with free drawing and stickers that scale and rotate with the fingers, and automatic saving to a local gallery. Designed for children: animated videos, smooth transitions and large controls.",
        "Python, Kivy and OpenCV. A hidden admin panel (five taps in a corner) sets the camera, orientation and monitor, and the app runs in kiosk mode, full screen and borderless.",
      ],
    ),
    stack: ["Python", "Kivy", "OpenCV", "PyInstaller", "Docker"],
    enlaces: [
      { tipo: "repositorio", href: `${GH}/FreeMagicMirror` },
      { tipo: "descarga", href: `${GH}/FreeMagicMirror/releases`, texto: b("Descargar (Windows)", "Download (Windows)") },
    ],
    video: {
      id: "UjSz98p7nPk",
      duracion: 87,
      escenas: [
        { t: 0, titulo: b("El fotomatón", "The photo booth") },
        { t: 22, titulo: b("Pose y cuenta regresiva", "Pose and countdown") },
        { t: 30, titulo: b("Decorar la foto", "Decorating the photo") },
        { t: 42, titulo: b("Guardar", "Saving") },
        { t: 50, titulo: b("Panel de configuración", "Setup panel") },
        { t: 60, titulo: b("Stack", "Tech stack") },
        { t: 72, titulo: b("En eventos reales", "At real events") },
      ],
    },
    descripcionMeta: b(
      "Fotomatón táctil en Python, Kivy y OpenCV, en uso en un salón de eventos: editor multitáctil, modo kiosco y ejecutable portable para Windows.",
      "Touchscreen photo booth in Python, Kivy and OpenCV, in use at an events venue: multitouch editor, kiosk mode and a portable Windows executable.",
    ),
    caso: [
      {
        titulo: b("El recorrido en pantalla", "The on-screen flow"),
        bloques: [
          { tipo: "visual", id: "kiosco" },
          {
            tipo: "lista",
            items: b(
              [
                "**Inicio:** un video en loop invita a tocar la pantalla.",
                "**Pose:** una animación sugiere poses para la foto.",
                "**Cuenta regresiva** y captura desde la cámara.",
                "**Editor:** dibujo libre con cinco colores, stickers que se escalan, rotan y mueven con varios dedos, y deshacer.",
                "**Guardado** en una galería local, con numeración incremental.",
              ],
              [
                "**Start:** a looping video invites people to touch the screen.",
                "**Pose:** an animation suggests poses for the photo.",
                "**Countdown** and capture from the camera.",
                "**Editor:** free drawing in five colors, stickers that scale, rotate and move with several fingers, and undo.",
                "**Saving** to a local gallery, with incremental numbering.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Decisiones técnicas", "Technical decisions"),
        bloques: [
          {
            tipo: "lista",
            items: b(
              [
                "La cámara se inicializa después de los videos, a 10 cuadros por segundo, para que la reproducción no se trabe.",
                "Videos decodificados con FFPyPlayer, integrado en Kivy, y exportación del lienzo completo (foto, dibujos y stickers) a PNG.",
                "Panel de administración oculto: detección de cámaras con OpenCV, orientación vertical u horizontal con ajuste de la ventana, y elección del monitor de salida.",
                "Rutas que detectan si la aplicación corre empaquetada con PyInstaller, para que el ejecutable encuentre sus recursos al copiarlo a otro equipo.",
              ],
              [
                "The camera starts after the videos, at 10 frames per second, so playback does not stutter.",
                "Videos decoded with FFPyPlayer, integrated into Kivy, and the whole canvas (photo, drawings and stickers) exported to PNG.",
                "Hidden admin panel: camera detection with OpenCV, portrait or landscape orientation with window adjustment, and choice of output monitor.",
                "Paths that detect whether the app runs packaged with PyInstaller, so the executable finds its resources when copied to another computer.",
              ],
            ),
          },
        ],
      },
      {
        titulo: b("Distribución", "Distribution"),
        bloques: [
          {
            tipo: "parrafos",
            texto: b(
              ["Ejecutable portable (.exe) para Windows, sin dependencias externas, publicado en los Releases del repositorio, e imagen en Docker Hub para Linux."],
              ["A portable Windows executable (.exe) with no external dependencies, published in the repository's Releases, and an image on Docker Hub for Linux."],
            ),
          },
        ],
      },
    ],
  },
];
