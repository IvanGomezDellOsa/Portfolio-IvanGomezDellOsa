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
 *
 * `allowedDevOrigins`: sólo cuenta en `next dev`. Para probar en el teléfono se
 * entra por la IP de la PC en la red de casa (`http://192.168.x.x:3210`), y sin
 * esto Next le corta la conexión de desarrollo: la página se ve, pero no
 * arranca (ningún botón responde).
 */
const config: NextConfig = {
  output: "export",
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Dos layouts raíz (uno por idioma): la 404 no tiene de qué layout colgar.
  experimental: { globalNotFound: true },
};

export default config;
