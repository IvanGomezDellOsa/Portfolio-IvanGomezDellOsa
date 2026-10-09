/**
 * LOS TEXTOS DEL SITIO QUE NO SON DE UN PROYECTO: el hero, la galería (la
 * persona), la experiencia, el stack con su evidencia y el contacto.
 *
 * Salen del «Acerca de» publicado en LinkedIn, del CV 10-26 v2 y de las reglas
 * de `Mensajes-Postulacion.md`: firma con email y LinkedIn (nunca teléfono),
 * «más de 2 años», «Full Stack Developer» como puesto (no «Software Engineer»:
 * en un sitio personal, como en el CV, puede leerse como título terminado).
 *
 * El hero lleva sólo el nombre y el puesto (pedido del dueño, 2026-10-06): sin
 * frases descriptivas. El sitio es oscuro, sobrio y con poco texto.
 */
import type { SalaId } from "./salas";
import type { Bilingue, Marcado } from "./tipos";

const b = <T,>(es: T, en: T): Bilingue<T> => ({ es, en });

export const SITIO = "https://www.ivangomezdellosa.com.ar";
export const EMAIL = "ivangomezdellosa@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/ivangomezdellosa/";
export const GITHUB = "https://github.com/IvanGomezDellOsa";
export const NOMBRE = "Iván Gómez Dell’Osa";

/**
 * LOS DOS CV, siempre los dos: el botón «CV» ofrece el español y el inglés en
 * cualquiera de las dos versiones del sitio. Son los del CV 10-26 v2, sin el
 * teléfono (`tools/cv.mjs`).
 */
export const CV = {
  es: "/cv/CV_IvanGomezDellOsa.pdf",
  en: "/cv/Resume_IvanGomezDellOsa.pdf",
} as const;

/** Cada CV se nombra en su propio idioma, en las dos versiones del sitio. */
export const CV_OPCIONES = [
  { lang: "es", href: CV.es, idioma: "Español" },
  { lang: "en", href: CV.en, idioma: "English" },
] as const;

export const META = {
  titulo: b("Iván Gómez Dell’Osa · Full Stack Developer", "Iván Gómez Dell’Osa · Full Stack Developer"),
  /** Google recorta cerca de los 155 caracteres: las dos entran enteras. */
  descripcion: b(
    "Iván Gómez Dell’Osa, Full Stack Developer con foco en backend e IA aplicada. Proyectos propios y freelance, con casos completos y videos.",
    "Iván Gómez Dell’Osa, Full Stack Developer focused on backend and applied AI. Personal and freelance projects, with full case studies and videos.",
  ),
  /** LinkedIn, WhatsApp y Slack muestran más: acá entran los proyectos. */
  social: b(
    "Full Stack Developer con foco en backend e IA aplicada. Nueve proyectos, siete con su video: Ask Leonardo da Vinci, Datos Pauta Oficial, Inversiones en Argentina y más.",
    "Full Stack Developer focused on backend and applied AI. Nine projects, seven with their own video: Ask Leonardo da Vinci, Datos Pauta Oficial, Inversiones en Argentina and more.",
  ),
};

export const NAV = {
  saltar: b("Saltar al contenido", "Skip to content"),
  proyectos: b("Proyectos", "Projects"),
  sobreMi: b("Sobre mí", "About"),
  contacto: b("Contacto", "Contact"),
  cv: b("CV", "Resume"),
  /** El menú del botón «CV»: el nombre accesible del botón y de la lista. */
  /** El botón «CV» del sitio: abre la vista previa (con los dos idiomas adentro). */
  cvVer: b("Ver el CV", "View the resume"),
  cvMenu: b("Descargar el CV: elegir idioma", "Download the resume: choose a language"),
  /** En la vista previa: abrir el PDF en otra pestaña, como siempre. */
  cvPestana: b("Abrir el PDF en otra pestaña: elegir idioma", "Open the PDF in a new tab: choose a language"),
  /** El rótulo de ese botón: para quien prefiere el PDF de siempre. */
  cvAbrir: b("Abrir PDF", "Open PDF"),
  /** El mail de la tapa del CV se copia: el aviso. */
  cvCopiado: b("Email copiado", "Email copied"),
  idioma: b("Idioma", "Language"),
  inicio: b("Inicio", "Home"),
};

/**
 * EL HERO: el nombre y el puesto, nada más. El puesto es el del CV («Full
 * Stack Developer»); lo que hace y cómo lo cuentan los proyectos y el «Sobre
 * mí», no una frase en el hero.
 */
export const HERO = {
  rol: b("Full Stack Developer", "Full Stack Developer"),
  verProyectos: b("Ver los proyectos", "See the projects"),
  bajar: b("Seguir bajando", "Keep scrolling"),
  /** El segundo botón de las telas: lleva a la sección completa del proyecto elegido. */
  detalles: b("Ver detalles", "View details"),
  lista: b("Lista de proyectos", "Project list"),
  arriba: b("Volver arriba", "Back to top"),
  reel: b("Los proyectos, en video", "The projects, on video"),
  /** El botón de las telas de los dos sitios web, que no tienen video. */
  verSitio: b("Ver sitio web", "Visit the website"),
};

/** El índice de los nueve proyectos, debajo del hero. */
export const INDICE = {
  titulo: b("Proyectos", "Projects"),
  sitio: b("Sitio web", "Website"),
  /** Los títulos de las columnas de enlaces. */
  proyecto: b("Proyecto", "Project"),
  video: b("Video", "Video"),
  repositorio: b("Repositorio", "Repository"),
  enlace: b("Enlace", "Link"),
};

export const SALA = {
  stack: b("Stack", "Stack"),
  enlaces: b("Enlaces", "Links"),
  stackYEnlaces: b("Stack y enlaces", "Stack and links"),
  caso: b("Caso completo", "Full case study"),
  primeraVersion: b("Primera versión", "First version"),
  sitio: b("Sitio web", "Website"),
  repositorio: b("Repositorio", "Repository"),
  demo: b("Demo", "Demo"),
  vistaPrevia: b("Vista previa", "Preview"),
  tienda: b("Chrome Web Store", "Chrome Web Store"),
  descarga: b("Descargar", "Download"),
  pasillo: b("Proyectos", "Projects"),
  anterior: b("Proyecto anterior", "Previous project"),
  siguiente: b("Proyecto siguiente", "Next project"),
  todos: b("Todos los proyectos", "All projects"),
  pausar: b("Pausar", "Pause"),
  reanudar: b("Reanudar", "Play"),
};

/** El video de cada proyecto y su reproductor. */
export const VIDEO = {
  ver: b("Ver video", "Watch video"),
  escenas: b("Escenas", "Scenes"),
  porEscenas: b("El video, por escenas", "The video, scene by scene"),
  cerrar: b("Cerrar", "Close"),
  pausar: b("Pausar", "Pause"),
  reproducir: b("Reproducir", "Play"),
  anterior: b("Video anterior", "Previous video"),
  siguiente: b("Video siguiente", "Next video"),
  enYoutube: b("Abrir en YouTube", "Open on YouTube"),
  sinReproductor: b("El reproductor de YouTube no cargó.", "The YouTube player did not load."),
  vistaPrevia: b("Vista previa sin sonido del video de", "Silent preview of the video for"),
};

/** Etiquetas de los visuales de cada sala. */
export const VISUALES = {
  barras: {
    titulo: b("Citas atribuidas a Leonardo que no existen en sus cuadernos", "Quotations attributed to Leonardo that do not exist in his notebooks"),
    modelo: b("Modelo de lenguaje actuando como Leonardo", "Language model acting as Leonardo"),
    ask: b("Ask Leonardo da Vinci", "Ask Leonardo da Vinci"),
    modeloValor: b("96,9%", "96.9%"),
    modeloDetalle: b("156 de 161 citas", "156 of 161 quotations"),
    askValor: b("0%", "0%"),
    askDetalle: b("0 de 187 citas", "0 of 187 quotations"),
    pie: b(
      "Mismo modelo, mismo prompt y las mismas 120 preguntas. Cada cita se buscó en el texto completo, en los dos idiomas.",
      "Same model, same prompt and the same 120 questions. Every quotation was searched for in the full text, in both languages.",
    ),
  },
  vectores: {
    titulo: b("Espacio vectorial", "Vector space"),
    pie: b(
      "No es una animación ilustrativa. Son los vectores reales del proyecto: los 1.402 pasajes que consulta el sistema, ubicados por su red neuronal y llevados de 384 dimensiones a 3 para poder verlos. Cada uno apunta al pasaje que más se le parece.",
      "This is not an illustrative animation. These are the project's real vectors: the 1,402 passages the system searches, placed by its neural network and brought down from 384 dimensions to 3 so they can be seen. Each one points to the passage most similar to it.",
    ),
    ficha: b("1.402 pasajes · 22 secciones · 384 → 3 dimensiones", "1,402 passages · 22 sections · 384 → 3 dimensions"),
    seccion: b("Sección encendida", "Section lit"),
    pasajes: b("pasajes", "passages"),
    arrastrar: b("Arrastrar para girar", "Drag to rotate"),
    alt: b(
      "Nube de 1.402 vectores que gira lentamente; una de sus 22 secciones se enciende por vez.",
      "A cloud of 1,402 vectors rotating slowly; one of its 22 sections lights up at a time.",
    ),
  },
  piezas: {
    pregunta: {
      titulo: b("Pregunta asistida", "Guided questions"),
      texto: b(
        "Un mapa de 22 secciones y 396 temas muestra en segundos sobre qué escribió Leonardo; cada tema se convierte en pregunta con un clic.",
        "A map of 22 sections and 396 subjects shows in seconds what Leonardo wrote about; any subject becomes a question in one click.",
      ),
    },
    biblioteca: {
      titulo: b("Biblioteca 3D", "3D Library"),
      texto: b("Cinco volúmenes con 27 láminas; las hojas se pasan con el pliegue de un libro real.", "Five volumes with 27 plates; leaves turn with the curl of a real book."),
    },
    museo: {
      titulo: b("Museo virtual 3D", "3D Virtual museum"),
      texto: b("Una sala que se recorre caminando, también desde el teléfono, con nueve de sus obras.", "A gallery you walk through, on mobile too, with nine of his works."),
    },
  },
  cobertura: {
    titulo: b("Cobertura de la base, por jurisdicción", "Database coverage, by jurisdiction"),
    exclusivo: b("Reconstruido de más de 500 resoluciones en PDF", "Rebuilt from more than 500 PDF resolutions"),
    ordenes: b("órdenes", "orders"),
    total: b("órdenes en total, 2003–2025", "orders in total, 2003–2025"),
  },
  capas: {
    titulo: b("Qué llega a publicarse", "What gets published"),
    pie: b(
      "Cada capa descarta algo antes de la siguiente. El filtro determinista trabaja antes de gastar un token, y sin Jev el flujo funciona igual sobre sus capas deterministas.",
      "Each layer discards something before the next. The deterministic filter works before a single token is spent, and without Jev the pipeline runs the same on its deterministic layers.",
    ),
  },
  sistema: {
    titulo: b("Cómo está armada", "How it is built"),
  },
  grilla: {
    titulo: b("Una vida de 80 años, semana por semana", "An 80-year life, week by week"),
    nacimiento: b("Año de nacimiento del ejemplo", "Example year of birth"),
    semana: b("semana", "week"),
    de: b("de", "of"),
    pie: b(
      "Dibujada en vivo con la técnica de la extensión: tres trazados SVG (pasado, futuro y anillo) para 4.160 semanas. Nada se guarda ni se envía.",
      "Drawn live with the extension's technique: three SVG paths (past, future and ring) for 4,160 weeks. Nothing is stored or sent.",
    ),
  },
  kiosco: {
    titulo: b("Las pantallas de la aplicación, en orden", "The application's screens, in order"),
    pasos: b(["Inicio", "Pose", "Cuenta regresiva"], ["Start", "Pose", "Countdown"]),
  },
};

/** Las 22 secciones de Richter, en el orden de `proyeccion.json` (índice = sección). */
export const SECCIONES_LEONARDO: Bilingue<string[]> = b(
  [
    "La práctica de la pintura",
    "Escritos humorísticos",
    "Seis libros sobre luz y sombra",
    "Notas topográficas",
    "Botánica y paisaje para pintores",
    "Geografía física",
    "Proporciones y movimiento del cuerpo",
    "Máximas, moral y polémicas",
    "Notas misceláneas",
    "Perspectiva lineal",
    "Astronomía",
    "Anatomía, zoología y fisiología",
    "Cartas y apuntes personales",
    "Perspectiva de la desaparición",
    "Prolegómenos al libro de pintura",
    "Notas sobre escultura",
    "Escritos de arquitectura",
    "Estudios y bocetos para cuadros",
    "Teoría de los colores",
    "Diseños arquitectónicos",
    "Perspectiva del color",
    "Guerra naval, máquinas y música",
  ],
  [
    "The practice of painting",
    "Humorous writings",
    "Light and shade",
    "Topographical notes",
    "Botany and landscape for painters",
    "Physical geography",
    "Proportions and movement of the body",
    "Maxims, morals and polemics",
    "Miscellaneous notes",
    "Linear perspective",
    "Astronomy",
    "Anatomy, zoology and physiology",
    "Letters and personal records",
    "Perspective of disappearance",
    "Prolegomena to the book on painting",
    "Notes on sculpture",
    "Writings on architecture",
    "Studies and sketches for pictures",
    "Theory of colours",
    "Architectural designs",
    "Perspective of colour",
    "Naval warfare, machines and music",
  ],
);

export const PERSONA = {
  titulo: b("Sobre mí", "About"),
  parrafos: b<Marcado[]>(
    [
      "Desarrollo productos de software completos, desde el diseño hasta la puesta en producción, con foco en backend e inteligencia artificial aplicada. Tengo más de 2 años de experiencia en proyectos de principio a fin, propios y freelance, con clientes y usuarios reales.",
      "Sobre la base que me da la carrera de Ingeniería de Sistemas (lógica de programación, análisis matemático y diseño de algoritmos), trabajo de forma autodidacta con tecnologías actuales. Lo combino con la gestión operativa de una PyME, donde sumo conocimientos de administración de empresas, producto y manejo de equipos.",
      "Desarrollo con asistencia de IA para ganar productividad; las decisiones de producto, diseño y arquitectura son propias.",
    ],
    [
      "I build complete software products, from design to production, with a focus on backend and applied artificial intelligence. I have more than 2 years of experience with end-to-end projects, personal and freelance, with real clients and users.",
      "Building on the foundation my Systems Engineering studies give me (programming logic, mathematical analysis and algorithm design), I teach myself current technologies. I combine this with running the operations of a small business, where I am gaining knowledge of business administration, product and team management.",
      "I develop with AI assistance to gain productivity; the product, design and architecture decisions are my own.",
    ],
  ),
  fotoAlt: b("Iván Gómez Dell’Osa", "Iván Gómez Dell’Osa"),
  detalles: [
    { clave: b("Ubicación", "Location"), valor: b("Tandil, Buenos Aires, Argentina · trabajo remoto", "Tandil, Buenos Aires, Argentina · remote work") },
    { clave: b("Idiomas", "Languages"), valor: b("Español (nativo) · Inglés (B2)", "Spanish (native) · English (B2)") },
    { clave: b("Ciudadanía", "Citizenship"), valor: b("Argentina e Italia (pasaporte de la UE)", "Argentina and Italy (EU passport)") },
    { clave: b("Formación", "Education"), valor: b("Ingeniería de Sistemas · UNICEN · 2022 – actualidad", "Systems Engineering · UNICEN · 2022 – present") },
    { clave: b("Certificación", "Certification"), valor: b("Scrum Fundamentals Certified (SFC) · VMEdu · 2024", "Scrum Fundamentals Certified (SFC) · VMEdu · 2024") },
  ],
};

export interface Puesto {
  cargo: Bilingue;
  periodo: Bilingue;
}

export interface Experiencia {
  empresa: string;
  descripcion: Bilingue;
  puestos: Puesto[];
  logros: Bilingue<Marcado[]>;
  salas: SalaId[];
}

export const EXPERIENCIA: { titulo: Bilingue; items: Experiencia[] } = {
  titulo: b("Experiencia", "Experience"),
  items: [
    {
      empresa: "Rugidos Fiestas Tandil",
      descripcion: b("PyME de eventos · Tandil, Argentina", "Events SME · Tandil, Argentina"),
      puestos: [
        { cargo: b("Desarrollador de Software", "Software Developer"), periodo: b("sep. 2023 – actualidad", "Sep 2023 – present") },
        { cargo: b("Responsable de Operaciones", "Operations Manager"), periodo: b("sep. 2019 – actualidad", "Sep 2019 – present") },
      ],
      logros: b(
        [
          "Diseñé, desarrollé y mantengo el sitio web comercial de la empresa, en producción: primera versión en 2023 y rediseño integral en 2026, con diseño UX/UI propio.",
          "Desarrollé FreeMagicMirror, la aplicación de fotomatón táctil que se usa en el salón.",
          "Gestiono la operación diaria: organización de los eventos, optimización de procesos internos y mejoras del modelo de servicio, parte de ellas implementadas con software propio.",
        ],
        [
          "Designed, built and maintain the company's commercial website, in production: first version in 2023 and a full redesign in 2026, with my own UX/UI design.",
          "Built FreeMagicMirror, the touchscreen photo booth application used at the venue.",
          "Manage daily operations: event organization, internal process optimization and service model improvements, some of them implemented with in-house software.",
        ],
      ),
      salas: ["rugidos-fiestas", "freemagicmirror"],
    },
    {
      empresa: "SeViVe",
      descripcion: b("Ex Pilates All Canning · estudio de pilates (franquicia), Canning", "Formerly Pilates All Canning · pilates studio (franchise), Canning"),
      puestos: [{ cargo: b("Desarrollador Full Stack Freelance", "Freelance Full Stack Developer"), periodo: b("dic. 2025 – jun. 2026", "Dec 2025 – Jun 2026") }],
      logros: b(
        [
          "Desarrollé como único programador una aplicación de reservas y gestión con más de 200 usuarios, desde la captación del cliente y la definición de requisitos hasta la puesta en producción.",
          "Finalizado el desarrollo, continúo a cargo del soporte, la administración del servidor y las actualizaciones solicitadas por el cliente.",
        ],
        [
          "Built, as the sole developer, a booking and management application with more than 200 users, from client acquisition and requirements definition to production launch.",
          "Since development ended, I remain responsible for support, server administration and client-requested updates.",
        ],
      ),
      salas: ["sevive"],
    },
    {
      empresa: "Navkok Security Group SRL",
      descripcion: b("Empresa de seguridad privada · Argentina", "Private security company · Argentina"),
      puestos: [{ cargo: b("Desarrollador Web Freelance", "Freelance Web Developer"), periodo: b("mar. 2026 – abr. 2026", "Mar 2026 – Apr 2026") }],
      logros: b(
        [
          "Rediseñé el sitio institucional, desde la venta del proyecto hasta su finalización: arquitectura de información, diseño UX/UI, textos institucionales y contenido multimedia producido con herramientas de IA.",
        ],
        [
          "Redesigned the corporate website, from selling the project to its completion: information architecture, UX/UI design, corporate copy and multimedia content produced with AI tools.",
        ],
      ),
      salas: ["navkok-security-group"],
    },
  ],
};

export interface Tecnologia {
  nombre: Bilingue;
  salas: SalaId[];
}

/**
 * EL STACK, CON EVIDENCIA. Es la línea de habilidades del CV, pero cada
 * tecnología lleva los proyectos donde se usó de verdad: lo específico y no
 * sólo lo genérico (criterio del dueño para LinkedIn, 2026-09-15). Si una
 * tecnología no tiene dónde apoyarse, no va.
 */
export const STACK: { titulo: Bilingue; intro: Bilingue; grupos: { titulo: Bilingue; tecnologias: Tecnologia[] }[] } = {
  titulo: b("Stack, con evidencia", "Stack, with evidence"),
  intro: b("Cada tecnología, con los proyectos donde se usó.", "Each technology, with the projects where it was used."),
  grupos: [
    {
      titulo: b("Lenguajes", "Languages"),
      tecnologias: [
        { nombre: b("Python", "Python"), salas: ["ask-leonardo-da-vinci", "datos-pauta-oficial", "sevive", "inversiones-en-argentina", "facehunt-2", "freemagicmirror"] },
        { nombre: b("TypeScript", "TypeScript"), salas: ["ask-leonardo-da-vinci", "datos-pauta-oficial", "inversiones-en-argentina", "mementolife", "rugidos-fiestas", "navkok-security-group"] },
        { nombre: b("JavaScript", "JavaScript"), salas: ["facehunt-2", "rugidos-fiestas"] },
        { nombre: b("SQL", "SQL"), salas: ["datos-pauta-oficial", "sevive", "inversiones-en-argentina"] },
        { nombre: b("HTML y CSS", "HTML & CSS"), salas: ["ask-leonardo-da-vinci", "facehunt-2", "mementolife", "rugidos-fiestas"] },
      ],
    },
    {
      titulo: b("Backend y datos", "Backend & data"),
      tecnologias: [
        { nombre: b("FastAPI", "FastAPI"), salas: ["sevive", "inversiones-en-argentina", "facehunt-2"] },
        { nombre: b("APIs REST", "REST APIs"), salas: ["sevive", "inversiones-en-argentina", "facehunt-2"] },
        { nombre: b("PostgreSQL", "PostgreSQL"), salas: ["sevive", "inversiones-en-argentina"] },
        { nombre: b("pgvector", "pgvector"), salas: ["inversiones-en-argentina"] },
        { nombre: b("SQLite", "SQLite"), salas: ["datos-pauta-oficial"] },
        { nombre: b("ETL", "ETL"), salas: ["datos-pauta-oficial"] },
      ],
    },
    {
      titulo: b("IA", "AI"),
      tecnologias: [
        { nombre: b("LLM", "LLMs"), salas: ["ask-leonardo-da-vinci", "inversiones-en-argentina"] },
        { nombre: b("RAG", "RAG"), salas: ["ask-leonardo-da-vinci"] },
        { nombre: b("Gemini API", "Gemini API"), salas: ["ask-leonardo-da-vinci", "inversiones-en-argentina"] },
        { nombre: b("Embeddings", "Embeddings"), salas: ["ask-leonardo-da-vinci", "inversiones-en-argentina", "facehunt-2"] },
        { nombre: b("Jev (TypeSafe)", "Jev (TypeSafe)"), salas: ["inversiones-en-argentina"] },
        { nombre: b("Visión por computador", "Computer vision"), salas: ["facehunt-2", "freemagicmirror"] },
      ],
    },
    {
      titulo: b("Frontend y móvil", "Frontend & mobile"),
      tecnologias: [
        { nombre: b("React", "React"), salas: ["ask-leonardo-da-vinci", "datos-pauta-oficial", "inversiones-en-argentina", "rugidos-fiestas", "navkok-security-group"] },
        { nombre: b("Next.js", "Next.js"), salas: ["ask-leonardo-da-vinci", "inversiones-en-argentina", "rugidos-fiestas", "navkok-security-group"] },
        { nombre: b("Astro", "Astro"), salas: ["datos-pauta-oficial"] },
        { nombre: b("Tailwind CSS", "Tailwind CSS"), salas: ["inversiones-en-argentina", "rugidos-fiestas", "navkok-security-group"] },
        { nombre: b("Three.js", "Three.js"), salas: ["ask-leonardo-da-vinci"] },
        { nombre: b("Flutter", "Flutter"), salas: ["sevive"] },
      ],
    },
    {
      titulo: b("Diseño", "Design"),
      tecnologias: [
        { nombre: b("UX/UI", "UX/UI"), salas: ["ask-leonardo-da-vinci", "sevive", "mementolife", "rugidos-fiestas", "navkok-security-group"] },
        { nombre: b("Diseño responsive", "Responsive design"), salas: ["ask-leonardo-da-vinci", "datos-pauta-oficial", "inversiones-en-argentina", "rugidos-fiestas", "navkok-security-group"] },
        { nombre: b("Arquitectura de la información", "Information architecture"), salas: ["ask-leonardo-da-vinci", "navkok-security-group"] },
      ],
    },
    {
      titulo: b("Testing y DevOps", "Testing & DevOps"),
      tecnologias: [
        { nombre: b("pytest", "pytest"), salas: ["facehunt-2"] },
        { nombre: b("Vitest", "Vitest"), salas: ["mementolife"] },
        { nombre: b("Playwright", "Playwright"), salas: ["mementolife"] },
        { nombre: b("GitHub Actions (CI/CD)", "GitHub Actions (CI/CD)"), salas: ["ask-leonardo-da-vinci", "inversiones-en-argentina", "mementolife"] },
        { nombre: b("Docker", "Docker"), salas: ["sevive", "freemagicmirror"] },
        { nombre: b("Nginx y Linux/VPS", "Nginx & Linux/VPS"), salas: ["sevive"] },
        { nombre: b("Vercel", "Vercel"), salas: ["ask-leonardo-da-vinci", "inversiones-en-argentina", "rugidos-fiestas", "navkok-security-group"] },
        { nombre: b("Cloudflare", "Cloudflare"), salas: ["ask-leonardo-da-vinci", "datos-pauta-oficial"] },
        { nombre: b("Firebase", "Firebase"), salas: ["sevive"] },
      ],
    },
  ],
};

export const CONTACTO = {
  titulo: b("Contacto", "Contact"),
  copiar: b("Copiar", "Copy"),
  copiado: b("Copiado", "Copied"),
  escribir: b("Escribir un email", "Send an email"),
};

export const NO_ENCONTRADA = {
  titulo: b("Esta página no existe", "This page does not exist"),
  texto: b("La dirección no corresponde a ninguna página del sitio.", "The address does not match any page on the site."),
  volver: b("Volver al inicio", "Back to the home page"),
};
