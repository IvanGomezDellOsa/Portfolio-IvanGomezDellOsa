import type { NextConfig } from "next";

/**
 * SITIO ESTATICO. `next build` deja en `out/` HTML, CSS, JS y medios listos para
 * servir desde cualquier hosting (Vercel, Cloudflare Pages o un cPanel): no hay
 * nada que ejecutar en un servidor, y el costo de operación es el del dominio.
 *
 * `trailingSlash`: cada ruta sale como carpeta con su `index.html`
 * (`/proyectos/sevive/index.html`), que es lo que cualquier hosting estático
 * sirve sin reglas de reescritura.
 *
 * `images.unoptimized`: el optimizador de `next/image` necesita un servidor.
 * Las imágenes ya salen optimizadas de `tools/medios.mjs` (WebP en dos anchos),
 * así que no hace falta.
 */
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Dos layouts raíz (uno por idioma): la 404 no tiene de qué layout colgar.
  experimental: { globalNotFound: true },
};

export default config;
