# ivangomezdellosa.com.ar — Sitio personal

🌐 **Sitio:** [ivangomezdellosa.com.ar](https://ivangomezdellosa.com.ar)

Mi portfolio: nueve proyectos propios y freelance, cada uno con su video de presentación y su detalle técnico, más mi experiencia y mi CV. En español y en inglés.

---

## 🎯 Qué tiene

- **Los proyectos al frente.** Cada uno es una sección del recorrido principal: descripción corta, video de presentación y un caso completo que se despliega a pedido
- **Telas con física real.** Los nueve proyectos cuelgan de un hilo como telas que se agarran, se arrastran y se sueltan de sus broches (Three.js + Bullet compilado a WebAssembly)
- **CV como libro 3D.** La vista previa del CV es una revista que se hojea, con las dos versiones (español e inglés) adentro
- **Un retrato que mira el cursor.** En el hero la cara sigue al mouse cuadro por cuadro; en el teléfono es una foto quieta
- **Reproductor propio.** Los videos se ven desde YouTube sin cookies, con un mando hecho para el sitio y las escenas de cada video como capítulos

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Framework** | Next.js 16 (exportación estática) + React 19 |
| **Lenguaje** | TypeScript |
| **Estilos** | CSS Modules, sin librería de componentes |
| **3D y física** | Three.js + Ammo.js (Bullet en WebAssembly) |
| **Medios** | Sharp y Playwright para generar capturas, imágenes y el CV |

El sitio es 100% estático: `next build` deja HTML, CSS, JS y medios listos para cualquier hosting, sin servidor ni base de datos.

---

## Desarrollo

```bash
npm install
npm run dev         # servidor de desarrollo
npm run build       # sitio estático en out/
npm run preview     # sirve out/ como lo haría el hosting
npm run typecheck   # tsc estricto
```

Los textos viven en `src/contenido/` (los proyectos en `proyectos.ts`, el resto en `sitio.ts`). Los scripts de `tools/` regeneran los medios: tráilers de los videos, páginas del CV, íconos e imagen para redes.

---

## 📝 Notas de Desarrollo

Desarrollo apoyado fuertemente en IA a lo largo de todo el ciclo: como motor para acelerar la producción y como segunda opinión ante decisiones técnicas. Las decisiones de producto, diseño y contenido fueron tomadas y orquestadas por mí.

---

## 👤 Autor

**Iván Gómez Dell'Osa**

- Email: [ivangomezdellosa@gmail.com](mailto:ivangomezdellosa@gmail.com)
- LinkedIn: [linkedin.com/in/ivangomezdellosa](https://www.linkedin.com/in/ivangomezdellosa/)
- GitHub: [IvanGomezDellOsa](https://github.com/IvanGomezDellOsa)
