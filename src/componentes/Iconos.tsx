/**
 * LOS ICONOS DEL SITIO, en SVG y con `currentColor`. Los de las redes son los
 * glifos oficiales simplificados; siempre van con un nombre accesible al lado
 * (texto visible o `sr`), nunca solos.
 */

/** El triángulo de play. */
export function Triangulo({ lado = 12 }: { lado?: number }) {
  return (
    <svg width={lado} height={lado} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 1.6v8.8L10.4 6z" fill="currentColor" />
    </svg>
  );
}

export function IconoGithub({ lado = 18 }: { lado?: number }) {
  return (
    <svg width={lado} height={lado} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
      />
    </svg>
  );
}

export function IconoLinkedin({ lado = 18 }: { lado?: number }) {
  return (
    <svg width={lado} height={lado} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"
      />
    </svg>
  );
}

export function Flecha({ lado = 12 }: { lado?: number }) {
  return (
    <svg width={lado} height={lado} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconoMail({ lado = 18 }: { lado?: number }) {
  return (
    <svg width={lado} height={lado} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2.4 3.5h19.2c1.33 0 2.4 1.07 2.4 2.4v.33l-12 7.2L0 6.23V5.9c0-1.33 1.07-2.4 2.4-2.4ZM0 8.75l11.38 6.83a1.2 1.2 0 0 0 1.24 0L24 8.75v9.35c0 1.33-1.07 2.4-2.4 2.4H2.4A2.4 2.4 0 0 1 0 18.1V8.75Z"
      />
    </svg>
  );
}

export function IconoCopiar({ lado = 15 }: { lado?: number }) {
  return (
    <svg width={lado} height={lado} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="5.25" y="5.25" width="8.5" height="8.5" rx="1.75" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.75 2.75v-.5A1.5 1.5 0 0 0 9.25.75h-6A1.5 1.5 0 0 0 1.75 2.25v6a1.5 1.5 0 0 0 1.5 1.5h.5" fill="none" stroke="currentColor" strokeWidth="1.4" transform="translate(.5 1.5)" />
    </svg>
  );
}

export function IconoListo({ lado = 15 }: { lado?: number }) {
  return (
    <svg width={lado} height={lado} viewBox="0 0 16 16" aria-hidden="true">
      <path d="m3.25 8.5 3 3 6.5-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
