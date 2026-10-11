/**
 * LOS TEXTOS DEL SITIO QUE NO SON DE UN PROYECTO: el hero, la lista, la persona
 * (sobre mí y experiencia) y los rótulos del contacto.
 *
 * NO HAY SECCION DE STACK (decisión del dueño, 2026-10-09): enumerar todo lo
 * que se usó en cada proyecto nunca es preciso ni completo, es difícil de
 * mantener y nadie busca habilidades así en un sitio personal. Las tecnologías
 * van con cada proyecto, en su página, y la lista completa está en el CV.
 *
 * Salen del «Acerca de» publicado en LinkedIn, del CV 10-26 v2 y de las reglas
 * de `Mensajes-Postulacion.md`: firma con email y LinkedIn (nunca teléfono),
 * «tengo experiencia», sin años (decisión del dueño, 2026-10-10), «Full Stack Developer» como puesto (no «Software Engineer»:
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
    "Iván Gómez Dell’Osa, Full Stack Developer con foco en backend e IA aplicada. Proyectos propios y freelance, con su video y su detalle técnico.",
    "Iván Gómez Dell’Osa, Full Stack Developer focused on backend and applied AI. Personal and freelance projects, each with its video and technical details.",
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
  /** El nombre completo: lo que dice el ícono del CV al posarse sobre él. */
  cvLargo: b("Currículum Vitae", "Resume"),
  /** El menú del botón «CV»: el nombre accesible del botón y de la lista. */
  /** El botón «CV» del sitio: abre la vista previa (con los dos idiomas adentro). */
  cvVer: b("Ver el CV", "View the resume"),
  /** En el teléfono, el botón «CV» del sitio: abre el PDF, después de elegir idioma. */
  cvElegir: b("Abrir el CV: elegir idioma", "Open the resume: choose a language"),
  cvMenu: b("Descargar el CV: elegir idioma", "Download the resume: choose a language"),
  /** En la vista previa: abrir el PDF en otra pestaña, como siempre. */
  cvPestana: b("Abrir el PDF en otra pestaña: elegir idioma", "Open the PDF in a new tab: choose a language"),
  /** El rótulo de ese botón: para quien prefiere el PDF de siempre. */
  cvAbrir: b("Abrir PDF", "Open PDF"),
  /** El mail de la tapa del CV se copia: el aviso. */
  cvCopiado: b("Email copiado", "Email copied"),
  idioma: b("Idioma", "Language"),
  inicio: b("Inicio", "Home"),
  /** El botón que despliega los enlaces de la barra, en el teléfono. */
  menu: b("Menú", "Menu"),
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
  /** El segundo botón de las telas: lleva a la página del proyecto elegido. */
  proyecto: b("Ver proyecto", "View project"),
  lista: b("Lista de proyectos", "Project list"),
  arriba: b("Volver arriba", "Back to top"),
  reel: b("Los proyectos, en video", "The projects, on video"),
  /** El botón de las telas de los dos sitios web, que no tienen video. */
  verSitio: b("Ver sitio web", "Visit the website"),
};

/** La lista de los nueve proyectos, debajo de las telas. */
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
  descripcion: b("Descripción", "Description"),
  /**
   * El botón que abre el detalle técnico (arquitectura, decisiones, resultados), y lo cierra.
   * Dice lo que hay adentro. «Caso completo» era jerga de portfolio, y «explicación
   * completa» daba a entender que lo de arriba estaba incompleto. Sin «Ver»: la flecha lo dice.
   */
  verCaso: b("Detalle técnico", "Technical details"),
  ocultarCaso: b("Ocultar el detalle técnico", "Hide the technical details"),
  primeraVersion: b("Primera versión", "First version"),
  sitio: b("Sitio web", "Website"),
  repositorio: b("Repositorio", "Repository"),
  demo: b("Demo", "Demo"),
  vistaPrevia: b("Vista previa", "Preview"),
  verVistaPrevia: b("Ver la vista previa", "Open the preview"),
  tienda: b("Chrome Web Store", "Chrome Web Store"),
  descarga: b("Descargar", "Download"),
  anterior: b("Proyecto anterior", "Previous project"),
  siguiente: b("Proyecto siguiente", "Next project"),
  pausar: b("Pausar", "Pause"),
  reanudar: b("Reanudar", "Play"),
};

/** El video de cada proyecto y su reproductor. */
export const VIDEO = {
  /** El rótulo del video en todo el sitio, con el nombre fijo del CV. Sin «Ver»: el triángulo ya lo dice. */
  presentacion: b("Video de presentación", "Presentation video"),
  /** Los dos sitios web no tienen video: su pantalla muestra el recorrido de la página. */
  recorridoDe: b("Recorrido sin sonido del sitio de", "Silent walkthrough of the website of"),
  escenas: b("Escenas", "Scenes"),
  cerrar: b("Cerrar", "Close"),
  pausar: b("Pausar", "Pause"),
  reproducir: b("Reproducir", "Play"),
  /** El mando del reproductor, abajo: lo que YouTube pone en el mismo lugar. */
  avance: b("Avance del video", "Seek"),
  volumen: b("Volumen", "Volume"),
  silenciar: b("Silenciar", "Mute"),
  sonar: b("Activar el sonido", "Unmute"),
  velocidad: b("Velocidad", "Playback speed"),
  normal: b("Normal", "Normal"),
  completa: b("Pantalla completa", "Full screen"),
  salirCompleta: b("Salir de pantalla completa", "Exit full screen"),
  anterior: b("Video anterior", "Previous video"),
  siguiente: b("Video siguiente", "Next video"),
  enYoutube: b("Abrir en YouTube", "Open on YouTube"),
  sinReproductor: b("El reproductor de YouTube no cargó.", "The YouTube player did not load."),
  vistaPrevia: b("Vista previa sin sonido del video de", "Silent preview of the video for"),
};

/** Etiquetas de los gráficos de cada proyecto. */
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
  cobertura: {
    titulo: b("Cobertura de la base, por jurisdicción", "Database coverage, by jurisdiction"),
    exclusivo: b("Reconstruido de más de 500 resoluciones en PDF", "Rebuilt from more than 500 PDF resolutions"),
    ordenes: b("órdenes", "orders"),
    total: b("órdenes en total, 2003–2025", "orders in total, 2003–2025"),
  },
  capas: {
    titulo: b("Qué llega a publicarse", "What gets published"),
    pie: b(
      "Cada capa descarta algo y le deja a la siguiente menos ruido y menos margen de error. Sin Jev, el flujo funciona igual sobre sus capas deterministas.",
      "Each layer discards something and leaves the next one less noise and less room for error. Without Jev, the pipeline runs the same on its deterministic layers.",
    ),
  },
  recorrido: {
    titulo: b("Qué pasa con cada pregunta", "What happens to each question"),
    pie: b(
      "En dos de los pasos el sistema puede abstenerse antes de llamar al modelo: prefiere decir que los cuadernos no tratan un tema antes que inventar una respuesta.",
      "At two of the steps the system can abstain before calling the model: it would rather say the notebooks do not cover a subject than invent an answer.",
    ),
  },
  tuberia: {
    titulo: b("De la fuente oficial al navegador", "From the official source to the browser"),
  },
  sistema: {
    titulo: b("Cómo está armada", "How it is built"),
  },
  grilla: {
    titulo: b("Una vida de 80 años, semana por semana", "An 80-year life, week by week"),
    nacimiento: b("Año de nacimiento del ejemplo", "Example year of birth"),
    semana: b("semana", "week"),
    de: b("de", "of"),
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
      "Desarrollo productos de software completos, desde el diseño hasta la puesta en producción, con foco en backend e inteligencia artificial aplicada. Tengo experiencia en proyectos de principio a fin, propios y freelance, con clientes y usuarios reales, con Python, React y Next.js, PostgreSQL y APIs REST.",
      "Sobre la base que me da la carrera de Ingeniería de Sistemas (lógica de programación, análisis matemático y diseño de algoritmos), trabajo de forma autodidacta con tecnologías actuales, que aplico en proyectos propios con el código publicado. Lo combino con la gestión operativa de una PyME, donde sumo conocimientos de administración de empresas, producto y manejo de equipos.",
      "Domino la IA aplicada al trabajo y a soluciones de producto: forma parte de mi proceso de desarrollo y de los productos que construyo. Las decisiones de producto, diseño y arquitectura son propias.",
    ],
    [
      "I build complete software products, from design to production, with a focus on backend and applied artificial intelligence. I have experience with end-to-end projects, personal and freelance, with real clients and users, using Python, React and Next.js, PostgreSQL and REST APIs.",
      "Building on the foundation my Systems Engineering studies give me (programming logic, mathematical analysis and algorithm design), I teach myself current technologies and apply them in personal projects with published code. I combine this with running the operations of a small business, where I am gaining knowledge of business administration, product and team management.",
      "I am proficient in AI applied to work and to product solutions: it is part of my development process and of the products I build. The product, design and architecture decisions are my own.",
    ],
  ),
  fotoAlt: b("Iván Gómez Dell’Osa", "Iván Gómez Dell’Osa"),
  detalles: [
    { clave: b("Ubicación", "Location"), valor: b("Argentina · Trabajo remoto", "Argentina · Remote work") },
    { clave: b("Idiomas", "Languages"), valor: b("Español (nativo) · Inglés (B2)", "Spanish (native) · English (B2)") },
    { clave: b("Ciudadanía", "Citizenship"), valor: b("Argentina e italiana (pasaporte de la UE)", "Argentine and Italian (EU passport)") },
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
          "Desarrollé FreeMagicMirror, una aplicación de fotomatón táctil que se usa en eventos.",
          "Gestiono la operación diaria: organización de los eventos, optimización de procesos internos y mejoras del modelo de servicio, parte de ellas implementadas con software propio.",
        ],
        [
          "Designed, built and maintain the company's commercial website, in production: first version in 2023 and a full redesign in 2026, with my own UX/UI design.",
          "Built FreeMagicMirror, a touchscreen photo booth application used at events.",
          "Manage daily operations: event organization, internal process optimization and service model improvements, some of them implemented with in-house software.",
        ],
      ),
      salas: ["rugidos-fiestas", "freemagicmirror"],
    },
    {
      empresa: "SeViVe",
      descripcion: b("Estudio de pilates (franquicia) · Canning, Buenos Aires", "Pilates studio (franchise) · Canning, Buenos Aires"),
      puestos: [{ cargo: b("Desarrollador Full Stack Freelance", "Freelance Full Stack Developer"), periodo: b("dic. 2025 – jun. 2026", "Dec 2025 – Jun 2026") }],
      logros: b(
        [
          "Desarrollé como único programador una aplicación de reservas y gestión con más de 200 usuarios, desde la definición de requisitos con el cliente hasta la puesta en producción: reservas con control de concurrencia, créditos con vencimiento, turnos fijos y panel de administración.",
          "Finalizado el desarrollo, continúo a cargo del soporte, la administración del servidor y las actualizaciones solicitadas por el cliente.",
        ],
        [
          "Built, as the sole developer, a booking and management application with more than 200 users, from defining requirements with the client to production launch: bookings with concurrency control, expiring credits, recurring slots and an admin panel.",
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

export const CONTACTO = {
  copiar: b("Copiar el email", "Copy the email"),
  copiado: b("Email copiado", "Email copied"),
};

export const NO_ENCONTRADA = {
  titulo: b("Esta página no existe", "This page does not exist"),
  texto: b("La dirección no corresponde a ninguna página del sitio.", "The address does not match any page on the site."),
  volver: b("Volver al inicio", "Back to the home page"),
};
