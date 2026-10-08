/**
 * SIRVE `out/` TAL COMO LO SERVIRIA UN HOSTING ESTATICO, para probar el build
 * antes de publicarlo: rutas con barra final → `index.html`, 404 para lo que
 * no existe, y los tipos MIME de lo que hay en el sitio.
 *
 *   npm run build && npm run preview     →  http://localhost:4173
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "out");
const PUERTO = Number(process.env.PORT ?? 4173);
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

async function archivoPara(url) {
  const ruta = decodeURIComponent(url.split("?")[0]);
  let archivo = path.join(RAIZ, ruta);
  if (!archivo.startsWith(RAIZ)) return null;
  try {
    if ((await stat(archivo)).isDirectory()) archivo = path.join(archivo, "index.html");
    await stat(archivo);
    return archivo;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const archivo = await archivoPara(req.url ?? "/");
  if (!archivo) {
    const pagina404 = await readFile(path.join(RAIZ, "404.html")).catch(() => "404");
    res.writeHead(404, { "content-type": TIPOS[".html"] });
    return res.end(pagina404);
  }
  const datos = await readFile(archivo);
  const tipo = TIPOS[path.extname(archivo)] ?? "application/octet-stream";
  // Los videos se piden por rangos: sin esto Safari no los reproduce.
  const rango = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
  if (rango && tipo === "video/mp4") {
    const inicio = rango[1] ? Number(rango[1]) : 0;
    const fin = rango[2] ? Number(rango[2]) : datos.length - 1;
    res.writeHead(206, { "content-type": tipo, "content-range": `bytes ${inicio}-${fin}/${datos.length}`, "accept-ranges": "bytes", "content-length": fin - inicio + 1 });
    return res.end(datos.subarray(inicio, fin + 1));
  }
  res.writeHead(200, { "content-type": tipo, "content-length": datos.length, "accept-ranges": "bytes" });
  res.end(datos);
}).listen(PUERTO, () => console.log(`out/ en http://localhost:${PUERTO}`));
