/**
 * LA ROTURA DEL RETRATO (pantallas táctiles): al tocarlo se parte, como una
 * placa rígida que recibe un golpe, y los pedazos caen.
 *
 * - LA GRIETA nace donde cayó el dedo y corre hasta los dos bordes, quebrada y
 *   distinta cada vez. Parte el disco en dos; del punto del golpe saltan además
 *   unas astillas chicas y un poco de polvo.
 * - LOS PEDAZOS son cuerpos rígidos con espesor (la foto adelante, el canto
 *   claro de la rotura, el dorso oscuro). El golpe entra por el punto tocado:
 *   cada mitad gira sobre su centro de masa con el momento que le deja ese
 *   empujón, y conserva su momento angular mientras cae (por eso cabecea como
 *   una placa de verdad, y no gira parejo).
 * - EL PRIMER CUADRO coincide con el retrato quieto: la cámara mira de frente
 *   al disco (el punto de fuga está en su centro) y la cara delantera, sin
 *   inclinar, sale con los mismos píxeles que la imagen. El cambio no se nota.
 *
 * Three.js, el mismo que usan las telas. El WebGL se prepara al cargar la
 * página (con el shader ya compilado) para que el toque responda en el acto.
 */
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Quaternion,
  Scene,
  ShaderMaterial,
  ShapeUtils,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

type P = readonly [number, number];

/** Píxeles por segundo al cuadrado: una caída que se alcanza a ver. */
const GRAVEDAD = 3400;
/** A cuántos píxeles mira el ojo: cuánta perspectiva tienen los pedazos al girar. */
const OJO = 820;
const PASO = 1 / 240;
const TOPE_S = 3.2;
/** A qué ritmo corre la caída: un poco más lenta que la real, para que se alcance a ver. */
const RITMO = 0.78;
/** Los lados del disco. */
const LADOS = 96;
const POLVO = 34;

const azar = (a: number, b: number) => a + Math.random() * (b - a);

/* ─── La grieta, en un disco de radio 1 con la y hacia arriba ─── */

/** Un tramo de grieta: camina desde el golpe hasta el borde, quebrándose sin salirse de su rumbo. */
function rayo(desde: P, rumbo: number): P[] {
  const pts: P[] = [];
  let [x, y] = desde;
  let desvio = 0;
  for (let i = 0; i < 60; i++) {
    desvio = Math.max(-0.5, Math.min(0.5, desvio * 0.7 + azar(-0.45, 0.45)));
    const paso = Math.min(0.075 * 1.3 ** i, 0.17) * azar(0.75, 1.25);
    const dx = Math.cos(rumbo + desvio) * paso;
    const dy = Math.sin(rumbo + desvio) * paso;
    if ((x + dx) ** 2 + (y + dy) ** 2 >= 1) {
      // El último punto, justo sobre el borde.
      const a = dx * dx + dy * dy;
      const b = 2 * (x * dx + y * dy);
      const c = x * x + y * y - 1;
      const t = (-b + Math.sqrt(Math.max(b * b - 4 * a * c, 0))) / (2 * a);
      pts.push([x + dx * t, y + dy * t]);
      return pts;
    }
    x += dx;
    y += dy;
    pts.push([x, y]);
  }
  const r = Math.hypot(x, y) || 1;
  pts.push([x / r, y / r]);
  return pts;
}

type Astilla = { lado: 1 | -1; i: number; j: number; q: P };

type Poligono = {
  pts: P[];
  /** Cuántas de sus primeras aristas son de rotura (el resto es el canto del disco). */
  rotas: number;
  /** De qué lado de la grieta quedó; 0, una astilla. */
  lado: 1 | -1 | 0;
};

function quebrar(golpe: P) {
  const lejos = Math.hypot(golpe[0], golpe[1]);
  // Lejos del centro, la grieta lo busca: dos pedazos, no un pedazo y una esquirla.
  const eje = lejos > 0.15 ? Math.atan2(golpe[1], golpe[0]) + azar(-0.7, 0.7) : azar(0, Math.PI * 2);
  const ida = rayo(golpe, eje);
  const vuelta = rayo(golpe, eje + Math.PI + azar(-0.35, 0.35));
  const linea: P[] = [...ida.reverse(), golpe, ...vuelta];
  const k = ida.length;
  const n = linea.length - 1;

  // Las astillas: muescas a un lado y al otro de la grieta, pegadas al golpe.
  const astillas: Astilla[] = [];
  const tramos: Omit<Astilla, "q">[] = [
    { lado: 1, i: k - 1, j: k + 1 },
    { lado: -1, i: k, j: k + 2 },
    { lado: -1, i: k - 2, j: k },
    { lado: 1, i: k + 1, j: k + 3 },
  ];
  tramos.forEach((t, orden) => {
    if (t.i < 1 || t.j > n - 1) return;
    if (orden > 1 && Math.random() < 0.35) return;
    const a = linea[t.i]!;
    const b = linea[t.j]!;
    const largo = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (largo < 1e-4) return;
    const ux = (b[0] - a[0]) / largo;
    const uy = (b[1] - a[1]) / largo;
    const nx = -uy * t.lado;
    const ny = ux * t.lado;
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    let saliente = 0;
    for (let s = t.i + 1; s < t.j; s++) saliente = Math.max(saliente, (linea[s]![0] - mx) * nx + (linea[s]![1] - my) * ny);
    const hondo = saliente + largo * azar(0.32, 0.7);
    const corrido = azar(-0.15, 0.15) * largo;
    const q: P = [mx + nx * hondo + ux * corrido, my + ny * hondo + uy * corrido];
    if (Math.hypot(q[0], q[1]) > 0.9) return;
    astillas.push({ ...t, q });
  });

  // El borde de cada mitad sobre la grieta: rodea sus astillas.
  const camino = (lado: 1 | -1) => {
    const mias = astillas.filter((a) => a.lado === lado);
    const pts: P[] = [];
    for (let t = 0; t <= n; t++) {
      if (mias.some((a) => t > a.i && t < a.j)) continue;
      const fin = mias.find((a) => a.j === t);
      if (fin) pts.push(fin.q);
      pts.push(linea[t]!);
    }
    return pts;
  };
  /** El canto del disco entre dos puntos del borde, en sentido antihorario y sin los extremos. */
  const arco = (desde: P, hasta: P) => {
    const a = Math.atan2(desde[1], desde[0]);
    let b = Math.atan2(hasta[1], hasta[0]);
    while (b <= a) b += Math.PI * 2;
    const pasos = Math.max(1, Math.ceil((b - a) / ((Math.PI * 2) / LADOS)));
    const pts: P[] = [];
    for (let s = 1; s < pasos; s++) {
      const w = a + ((b - a) * s) / pasos;
      pts.push([Math.cos(w), Math.sin(w)]);
    }
    return pts;
  };

  const izquierda = camino(1);
  const derecha = camino(-1).reverse();
  const poligonos: Poligono[] = [
    { pts: [...izquierda, ...arco(linea[n]!, linea[0]!)], rotas: izquierda.length - 1, lado: 1 },
    { pts: [...derecha, ...arco(linea[0]!, linea[n]!)], rotas: derecha.length - 1, lado: -1 },
    ...astillas.map((a): Poligono => {
      const tramo = linea.slice(a.i, a.j + 1);
      return { pts: [...(a.lado === 1 ? tramo : tramo.reverse()), a.q], rotas: Infinity, lado: 0 };
    }),
  ];

  // Los pelos: grietas finas que salen del golpe y no llegan a partir nada. Sólo se dibujan.
  const pelos: P[][] = [];
  const cuantos = 3 + Math.floor(Math.random() * 3);
  for (let h = 0; h < cuantos; h++) {
    const de = linea[Math.max(1, Math.min(n - 1, k + Math.round(azar(-1.4, 1.4))))]!;
    const rumbo = eje + (Math.random() < 0.5 ? 0 : Math.PI) + azar(0.45, 1.2) * (h % 2 ? 1 : -1);
    const pelo: P[] = [de];
    let [x, y] = de;
    let desvio = 0;
    const pasos = 3 + Math.floor(Math.random() * 4);
    for (let s = 0; s < pasos; s++) {
      desvio = desvio * 0.6 + azar(-0.5, 0.5);
      x += Math.cos(rumbo + desvio) * azar(0.05, 0.1);
      y += Math.sin(rumbo + desvio) * azar(0.05, 0.1);
      if (x * x + y * y > 0.94) break;
      pelo.push([x, y]);
    }
    if (pelo.length > 1) pelos.push(pelo);
  }

  return { linea, k, astillas, poligonos, pelos, eje };
}

/* ─── La foto, con la grieta dibujada ─── */

export type Fuente = { imagen: CanvasImageSource; recorte?: readonly [number, number, number, number] };

function pintar(fuente: Fuente, radio: number, escala: number, fondo: string, q: ReturnType<typeof quebrar>) {
  // El disco entero mide un píxel más que la foto: es el aro que la rodea.
  const fuera = radio + 1;
  const lado = Math.max(2, Math.ceil(fuera * 2 * escala));
  const lienzo = document.createElement("canvas");
  lienzo.width = lienzo.height = lado;
  const c = lienzo.getContext("2d", { willReadFrequently: true });
  if (!c) return null;
  const e = lado / (fuera * 2);
  const m = lado / 2;
  const X = (p: P) => m + p[0] * fuera * e;
  const Y = (p: P) => m - p[1] * fuera * e;

  c.save();
  c.beginPath();
  c.arc(m, m, radio * e, 0, Math.PI * 2);
  c.clip();
  if (fuente.recorte) c.drawImage(fuente.imagen, ...fuente.recorte, 0, 0, lado, lado);
  else c.drawImage(fuente.imagen, 0, 0, lado, lado);
  c.restore();

  // El mismo filtro que las capas del retrato: `grayscale(1) contrast(1.08)`.
  try {
    const datos = c.getImageData(0, 0, lado, lado);
    const d = datos.data;
    for (let i = 0; i < d.length; i += 4) {
      const gris = 0.2126 * d[i]! + 0.7152 * d[i + 1]! + 0.0722 * d[i + 2]!;
      d[i] = d[i + 1] = d[i + 2] = (gris - 127.5) * 1.08 + 127.5;
    }
    c.putImageData(datos, 0, 0);
  } catch {
    // Sin permiso para leer los píxeles: queda en color.
  }

  // Debajo de la foto: el aro (un pelo blanco) sobre el fondo de la página.
  c.globalCompositeOperation = "destination-over";
  c.fillStyle = "rgba(255, 255, 255, 0.12)";
  c.fillRect(0, 0, lado, lado);
  c.fillStyle = "#0b0b0b";
  c.fillStyle = fondo;
  c.fillRect(0, 0, lado, lado);
  c.globalCompositeOperation = "source-over";

  // La grieta: una línea oscura (la sombra del canto) con un filo claro al lado.
  const trazo = (pts: readonly P[], dx = 0, dy = 0) => {
    c.beginPath();
    pts.forEach((p, i) => (i ? c.lineTo(X(p) + dx, Y(p) + dy) : c.moveTo(X(p) + dx, Y(p) + dy)));
    c.stroke();
  };
  c.lineJoin = "round";
  c.lineCap = "round";
  const bordes: (readonly P[])[] = [q.linea, ...q.astillas.map((a) => [q.linea[a.i]!, a.q, q.linea[a.j]!])];
  for (const b of bordes) {
    c.strokeStyle = "rgba(255, 255, 255, 0.3)";
    c.lineWidth = 0.6 * e;
    trazo(b, -0.55 * e, -0.55 * e);
    c.strokeStyle = "rgba(0, 0, 0, 0.6)";
    c.lineWidth = 0.9 * e;
    trazo(b);
  }
  for (const pelo of q.pelos) {
    for (let i = 0; i < pelo.length - 1; i++) {
      const resta = 1 - i / (pelo.length - 1);
      c.strokeStyle = `rgba(0, 0, 0, ${0.2 + 0.4 * resta})`;
      c.lineWidth = (0.3 + 0.5 * resta) * e;
      trazo([pelo[i]!, pelo[i + 1]!]);
      c.strokeStyle = `rgba(255, 255, 255, ${0.22 * resta})`;
      c.lineWidth = 0.4 * e;
      trazo([pelo[i]!, pelo[i + 1]!], -0.5 * e, -0.5 * e);
    }
  }
  // Donde pegó: la superficie machucada, apenas más clara.
  const golpe = q.linea[q.k]!;
  const mancha = c.createRadialGradient(X(golpe), Y(golpe), 0, X(golpe), Y(golpe), fuera * e * 0.09);
  mancha.addColorStop(0, "rgba(255, 255, 255, 0.42)");
  mancha.addColorStop(1, "rgba(255, 255, 255, 0)");
  c.fillStyle = mancha;
  c.fillRect(0, 0, lado, lado);

  return lienzo;
}

/* ─── Los pedazos ─── */

const VERTICE = /* glsl */ `
  attribute float cara;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLugar;
  varying vec3 vLocal;
  varying float vCara;
  void main() {
    vUv = uv;
    vCara = cara;
    vLocal = position;
    vec4 mundo = modelMatrix * vec4(position, 1.0);
    vLugar = mundo.xyz;
    vNormal = mat3(modelMatrix) * normal;
    gl_Position = projectionMatrix * viewMatrix * mundo;
  }
`;

/*
 * Caras: 0 la foto, 1 el dorso, 2 el canto de la rotura, 3 el canto del disco.
 * El dorso y los cantos son claros, como una placa de cerámica: sobre el fondo
 * negro del sitio, un dorso oscuro haría desaparecer el pedazo al darse vuelta.
 * La luz viene de arriba y de la izquierda. La foto, de frente, sale tal cual
 * (factor 1): por eso el primer cuadro es igual al retrato.
 */
const FRAGMENTO = /* glsl */ `
  precision highp float;
  uniform sampler2D mapa;
  uniform vec3 luz;
  uniform vec3 ojo;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vLugar;
  varying vec3 vLocal;
  varying float vCara;

  float grano(vec3 p) {
    return fract(sin(dot(floor(p), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  }

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(ojo - vLugar);
    float lambert = max(dot(n, luz), 0.0);
    float brillo = pow(max(dot(n, normalize(luz + v)), 0.0), 56.0);
    vec3 c;
    if (vCara < 0.5) {
      float frente = (0.5 + 0.5 * lambert) / (0.5 + 0.5 * luz.z);
      c = texture2D(mapa, vUv).rgb * frente + brillo * 0.4;
    } else if (vCara < 1.5) {
      float g = grano(vLocal * 0.9);
      c = vec3(0.66, 0.655, 0.64) * (0.3 + 0.75 * lambert) * (0.94 + 0.06 * g) + brillo * 0.08;
    } else if (vCara < 2.5) {
      float g = grano(vLocal * 1.7);
      c = vec3(0.9, 0.89, 0.87) * (0.34 + 0.72 * lambert) * (0.8 + 0.2 * g);
    } else {
      c = vec3(0.78, 0.775, 0.76) * (0.32 + 0.75 * lambert) + brillo * 0.2;
    }
    gl_FragColor = vec4(c, 1.0);
  }
`;

type Pedazo = {
  malla: Mesh;
  pos: Vector3;
  vel: Vector3;
  giro: Quaternion;
  /** El momento angular, en el mundo: no cambia mientras cae. */
  momento: Vector3;
  /** La inversa del tensor de inercia, en el cuerpo: el bloque del plano (a, b, d) y el eje z. */
  inv: readonly [number, number, number, number];
  /** El menor de sus momentos de inercia: con él se le pone tope a la velocidad de giro. */
  menor: number;
  centro: P;
  lado: 1 | -1 | 0;
  alcance: number;
};

function armar(pol: Poligono, fuera: number, grosor: number, material: ShaderMaterial): Pedazo | null {
  const { pts, rotas } = pol;
  const N = pts.length;
  if (N < 3) return null;
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < N; i++) {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[(i + 1) % N]!;
    const w = x0 * y1 - x1 * y0;
    area += w;
    cx += (x0 + x1) * w;
    cy += (y0 + y1) * w;
  }
  area /= 2;
  if (area < 1e-5) return null;
  cx /= 6 * area;
  cy /= 6 * area;

  // En píxeles y alrededor del centro de masa: gira sobre él.
  const loc = pts.map(([x, y]) => [(x - cx) * fuera, (y - cy) * fuera] as const);
  let ixx = 0;
  let iyy = 0;
  let pxy = 0;
  let alcance = 0;
  for (let i = 0; i < N; i++) {
    const [x0, y0] = loc[i]!;
    const [x1, y1] = loc[(i + 1) % N]!;
    const w = x0 * y1 - x1 * y0;
    ixx += w * (y0 * y0 + y0 * y1 + y1 * y1);
    iyy += w * (x0 * x0 + x0 * x1 + x1 * x1);
    pxy += w * (x0 * y1 + 2 * x0 * y0 + 2 * x1 * y1 + x1 * y0);
    alcance = Math.max(alcance, Math.hypot(x0, y0));
  }
  const masa = area * fuera * fuera;
  const espesor = (masa * grosor * grosor) / 12;
  ixx = ixx / 12 + espesor;
  iyy = iyy / 12 + espesor;
  pxy /= 24;
  const det = ixx * iyy - pxy * pxy;
  if (!(det > 0)) return null;
  const traza = ixx + iyy;
  const menor = (traza - Math.sqrt(Math.max(traza * traza - 4 * det, 0))) / 2;

  const caras = ShapeUtils.triangulateShape(
    loc.map(([x, y]) => new Vector2(x, y)),
    [],
  );
  if (!caras.length) return null;

  const vertices = N * 2 + N * 4;
  const posicion = new Float32Array(vertices * 3);
  const normal = new Float32Array(vertices * 3);
  const uv = new Float32Array(vertices * 2);
  const cara = new Float32Array(vertices);
  const indices: number[] = [];
  const z = grosor / 2;
  let v = 0;
  const poner = (x: number, y: number, zz: number, nx: number, ny: number, nz: number, u: number, w: number, tipo: number) => {
    posicion.set([x, y, zz], v * 3);
    normal.set([nx, ny, nz], v * 3);
    uv.set([u, w], v * 2);
    cara[v] = tipo;
    return v++;
  };
  const u = (i: number) => (pts[i]![0] + 1) / 2;
  const w = (i: number) => (pts[i]![1] + 1) / 2;

  for (let i = 0; i < N; i++) poner(loc[i]![0], loc[i]![1], z, 0, 0, 1, u(i), w(i), 0);
  for (let i = 0; i < N; i++) poner(loc[i]![0], loc[i]![1], -z, 0, 0, -1, u(i), w(i), 1);
  for (const [a, b, c] of caras as [number, number, number][]) {
    const [ax, ay] = loc[a]!;
    const [bx, by] = loc[b]!;
    const [qx, qy] = loc[c]!;
    const antihorario = (bx - ax) * (qy - ay) - (by - ay) * (qx - ax) > 0;
    if (antihorario) indices.push(a, b, c, N + a, N + c, N + b);
    else indices.push(a, c, b, N + a, N + b, N + c);
  }
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const [x0, y0] = loc[i]!;
    const [x1, y1] = loc[j]!;
    const rota = i < rotas;
    const largo = Math.hypot(x1 - x0, y1 - y0) || 1;
    // La rotura, facetada; el canto del disco, liso (la normal del círculo).
    const n0: P = rota ? [(y1 - y0) / largo, -(x1 - x0) / largo] : [pts[i]![0], pts[i]![1]];
    const n1: P = rota ? n0 : [pts[j]![0], pts[j]![1]];
    const tipo = rota ? 2 : 3;
    const a = poner(x0, y0, z, n0[0], n0[1], 0, u(i), w(i), tipo);
    const b = poner(x0, y0, -z, n0[0], n0[1], 0, u(i), w(i), tipo);
    const c = poner(x1, y1, -z, n1[0], n1[1], 0, u(j), w(j), tipo);
    const d = poner(x1, y1, z, n1[0], n1[1], 0, u(j), w(j), tipo);
    indices.push(a, b, c, a, c, d);
  }

  const geom = new BufferGeometry();
  geom.setAttribute("position", new BufferAttribute(posicion, 3));
  geom.setAttribute("normal", new BufferAttribute(normal, 3));
  geom.setAttribute("uv", new BufferAttribute(uv, 2));
  geom.setAttribute("cara", new BufferAttribute(cara, 1));
  geom.setIndex(indices);
  const malla = new Mesh(geom, material);
  malla.frustumCulled = false;
  malla.matrixAutoUpdate = false;

  return {
    malla,
    pos: new Vector3(cx * fuera, cy * fuera, -z),
    vel: new Vector3(),
    giro: new Quaternion(),
    momento: new Vector3(),
    inv: [iyy / det, pxy / det, ixx / det, 1 / (ixx + iyy)],
    menor,
    centro: [cx, cy],
    lado: pol.lado,
    alcance,
  };
}

/** La velocidad angular que le corresponde a un momento, con el cuerpo girado como esté. */
function velocidadAngular(p: Pedazo, salida: Vector3, aux: Quaternion) {
  aux.copy(p.giro).conjugate();
  salida.copy(p.momento).applyQuaternion(aux);
  const [a, b, d, e] = p.inv;
  salida.set(a * salida.x + b * salida.y, b * salida.x + d * salida.y, e * salida.z);
  return salida.applyQuaternion(p.giro);
}

type Mota = { pos: Vector3; vel: Vector3; giro: Quaternion; eje: Vector3; vuelta: number; lado: number; freno: number; vida: number };

export type Golpe = {
  /** El retrato: de él salen el lugar y el tamaño. */
  caja: HTMLElement;
  /** Dónde caen los pedazos (la sección del hero): el lienzo la cubre entera. */
  escenario: HTMLElement;
  fuente: Fuente;
  /** Dónde cayó el dedo, en la ventana. */
  x: number;
  y: number;
  alTerminar?: () => void;
};

export type Rotura = {
  /** Parte el retrato y pinta el primer cuadro antes de volver. `false` si no pudo: nada cambió. */
  romper(g: Golpe): boolean;
  destruir(): void;
};

export function prepararRotura(): Rotura {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  const lienzo = renderer.domElement;
  lienzo.setAttribute("aria-hidden", "true");
  Object.assign(lienzo.style, { position: "absolute", inset: "0", width: "100%", height: "100%", zIndex: "3", pointerEvents: "none" });

  const escena = new Scene();
  const camara = new PerspectiveCamera();
  camara.position.set(0, 0, OJO);
  camara.updateMatrixWorld();

  const material = new ShaderMaterial({
    vertexShader: VERTICE,
    fragmentShader: FRAGMENTO,
    uniforms: {
      mapa: { value: null },
      luz: { value: new Vector3(-0.42, 0.62, 0.66).normalize() },
      ojo: { value: camara.position.clone() },
    },
  });

  // El polvo y las esquirlas mínimas: triángulos sueltos, sin espesor.
  const triangulo = new BufferGeometry();
  triangulo.setAttribute("position", new BufferAttribute(new Float32Array([-0.6, -0.4, 0, 0.7, -0.25, 0, -0.1, 0.65, 0]), 3));
  const materialPolvo = new MeshBasicMaterial({ side: DoubleSide });
  const polvo = new InstancedMesh(triangulo, materialPolvo, POLVO);
  polvo.instanceMatrix.setUsage(DynamicDrawUsage);
  polvo.frustumCulled = false;
  const gris = new Color();
  for (let i = 0; i < POLVO; i++) polvo.setColorAt(i, gris.setRGB(1, 1, 1, SRGBColorSpace));
  polvo.count = 0;
  escena.add(polvo);

  // Los programas, compilados ya: el toque no espera al shader.
  {
    const prueba = new Mesh(triangulo, material);
    escena.add(prueba);
    polvo.count = 1;
    renderer.compile(escena, camara);
    polvo.count = 0;
    escena.remove(prueba);
  }

  let cuadro = 0;
  let limpiar: (() => void) | null = null;

  const romper = ({ caja, escenario, fuente, x, y, alTerminar }: Golpe) => {
    if (limpiar || renderer.getContext().isContextLost()) return false;
    const r = caja.getBoundingClientRect();
    const e = escenario.getBoundingClientRect();
    const radio = r.width / 2;
    if (radio < 8 || e.width < 1 || e.height < 1) return false;
    const fuera = radio + 1;
    const grosor = Math.max(3, radio * 0.085);
    const cx = r.left + radio - e.left;
    const cy = r.top + r.height / 2 - e.top;

    // El golpe, en el disco; cerca del borde se corre adentro, para que la grieta tenga de dónde salir.
    let gx = (x - (r.left + radio)) / fuera;
    let gy = -(y - (r.top + r.height / 2)) / fuera;
    const lejos = Math.hypot(gx, gy);
    if (lejos > 0.7) {
      gx *= 0.7 / lejos;
      gy *= 0.7 / lejos;
    }
    const q = quebrar([gx, gy]);

    const escala = Math.min(window.devicePixelRatio || 1, 3);
    const foto = pintar(fuente, radio, escala, getComputedStyle(escenario).backgroundColor, q);
    if (!foto) return false;
    const mapa = new CanvasTexture(foto);
    mapa.anisotropy = renderer.capabilities.getMaxAnisotropy();
    material.uniforms.mapa!.value = mapa;

    const pedazos = q.poligonos.map((p) => armar(p, fuera, grosor, material)).filter((p): p is Pedazo => !!p);
    if (pedazos.length < 2) {
      mapa.dispose();
      pedazos.forEach((p) => p.malla.geometry.dispose());
      return false;
    }

    // ── El empujón ──
    // El dedo entra por el golpe: a cada mitad le deja un momento r × J, con J
    // hacia adentro de la pantalla. Las dos se abren como una tabla partida.
    const a = q.linea[0]!;
    const b = q.linea[q.linea.length - 1]!;
    const largoEje = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nx = -(b[1] - a[1]) / largoEje;
    const ny = (b[0] - a[0]) / largoEje;
    const omega = new Vector3();
    const aux = new Quaternion();
    const mayor = pedazos.reduce((m, p) => (p.lado && p.alcance > m.alcance ? p : m), pedazos[0]!);
    // Cuánto empuja: lo que haga girar a la mitad más grande a un ritmo que se alcance a ver.
    mayor.momento.set(-(gy - mayor.centro[1]) * fuera, (gx - mayor.centro[0]) * fuera, 0);
    const ritmo = velocidadAngular(mayor, omega, aux).length();
    const empuje = ritmo > 1e-9 ? azar(5.5, 7.5) / ritmo : 0;
    for (const p of pedazos) {
      if (p.lado) {
        p.momento.set(-(gy - p.centro[1]) * fuera * empuje, (gx - p.centro[0]) * fuera * empuje, (p.lado * azar(0.5, 1.5)) / p.inv[3]);
        p.vel.set(nx * p.lado * azar(45, 95) + azar(-25, 25), ny * p.lado * azar(45, 95) + azar(10, 70), azar(50, 130));
      } else {
        // Las astillas saltan del golpe, rápidas y girando sobre cualquier eje.
        const dx = p.centro[0] - gx + azar(-0.05, 0.05);
        const dy = p.centro[1] - gy + azar(-0.05, 0.05);
        const d = Math.hypot(dx, dy) || 1;
        const rapidez = azar(150, 330);
        p.vel.set((dx / d) * rapidez, (dy / d) * rapidez + azar(60, 220), azar(120, 320));
        p.momento.set(azar(-1, 1), azar(-1, 1), azar(-1, 1)).normalize().multiplyScalar(p.menor * azar(9, 20));
      }
      // Ninguno gira más de lo que el ojo puede seguir.
      const tope = p.menor * (p.lado ? 11 : 26);
      if (p.momento.length() > tope) p.momento.setLength(tope);
      p.malla.matrix.compose(p.pos, p.giro, p.malla.scale);
      p.malla.matrixWorldNeedsUpdate = true;
      escena.add(p.malla);
    }

    const motas: Mota[] = Array.from({ length: POLVO }, (_, i) => {
      const fino = i >= POLVO * 0.45;
      const hacia = azar(0, Math.PI * 2);
      const rapidez = fino ? azar(50, 220) : azar(120, 420);
      const sobre = q.linea[Math.max(0, Math.min(q.linea.length - 1, q.k + Math.round(azar(-1.2, 1.2))))]!;
      return {
        pos: new Vector3(sobre[0] * fuera + azar(-2, 2), sobre[1] * fuera + azar(-2, 2), 1),
        vel: new Vector3(Math.cos(hacia) * rapidez, Math.sin(hacia) * rapidez + azar(0, 160), azar(40, 380)),
        giro: new Quaternion().setFromAxisAngle(new Vector3(azar(-1, 1), azar(-1, 1), azar(-1, 1)).normalize(), azar(0, 6)),
        eje: new Vector3(azar(-1, 1), azar(-1, 1), azar(-1, 1)).normalize(),
        vuelta: azar(8, 34),
        lado: fino ? azar(0.5, 1.1) : azar(1.2, 3.2),
        freno: fino ? azar(3, 6) : azar(0.6, 1.6),
        vida: fino ? azar(0.35, 0.75) : azar(0.6, 1.2),
      };
    });
    polvo.count = POLVO;

    // ── La cámara: de frente al disco, con la pantalla del hero entera en el cuadro ──
    const W = e.width;
    const H = e.height;
    const cerca = 20;
    const k = cerca / OJO;
    camara.projectionMatrix.makePerspective(-cx * k, (W - cx) * k, cy * k, -(H - cy) * k, cerca, 6000);
    camara.projectionMatrixInverse.copy(camara.projectionMatrix).invert();
    renderer.setPixelRatio(escala);
    renderer.setSize(W, H, false);
    escenario.appendChild(lienzo);

    const matriz = new Matrix4();
    const tamano = new Vector3();
    const luz = material.uniforms.luz!.value as Vector3;
    const normalMota = new Vector3();
    const dq = new Quaternion();
    const pintarPolvo = (t: number) => {
      motas.forEach((m, i) => {
        const resta = Math.max(0, 1 - t / m.vida);
        const s = m.lado * Math.min(1, resta * 3.5);
        matriz.compose(m.pos, m.giro, tamano.set(s, s, s));
        polvo.setMatrixAt(i, matriz);
        const claro = 0.5 + 0.5 * Math.abs(normalMota.set(0, 0, 1).applyQuaternion(m.giro).dot(luz));
        polvo.setColorAt(i, gris.setRGB(0.92 * claro, 0.91 * claro, 0.89 * claro, SRGBColorSpace));
      });
      polvo.instanceMatrix.needsUpdate = true;
      if (polvo.instanceColor) polvo.instanceColor.needsUpdate = true;
    };

    const avanzar = (dt: number) => {
      for (const p of pedazos) {
        p.vel.y -= GRAVEDAD * dt;
        p.pos.addScaledVector(p.vel, dt);
        velocidadAngular(p, omega, aux);
        const w = omega.length();
        if (w > 1e-6) p.giro.premultiply(dq.setFromAxisAngle(omega.divideScalar(w), w * dt)).normalize();
      }
      for (const m of motas) {
        m.vel.multiplyScalar(Math.max(0, 1 - m.freno * dt));
        m.vel.y -= GRAVEDAD * dt;
        m.pos.addScaledVector(m.vel, dt);
        m.giro.premultiply(dq.setFromAxisAngle(m.eje, m.vuelta * dt));
      }
    };

    limpiar = () => {
      cancelAnimationFrame(cuadro);
      limpiar = null;
      lienzo.remove();
      for (const p of pedazos) {
        escena.remove(p.malla);
        p.malla.geometry.dispose();
      }
      polvo.count = 0;
      material.uniforms.mapa!.value = null;
      mapa.dispose();
      renderer.setSize(1, 1, false);
    };

    pintarPolvo(0);
    renderer.render(escena, camara);

    const piso = -(H - cy);
    const inicio = performance.now();
    let antes = inicio;
    let t = 0;
    let resto = 0;
    const tic = (ahora: number) => {
      // Con pocos cuadros por segundo la caída sigue el reloj, no se pone en cámara lenta.
      const dt = Math.max(0, Math.min((ahora - antes) / 1000, 1 / 10));
      antes = ahora;
      t += dt * RITMO;
      resto += dt * RITMO;
      while (resto >= PASO) {
        avanzar(PASO);
        resto -= PASO;
      }
      for (const p of pedazos) {
        p.malla.matrix.compose(p.pos, p.giro, p.malla.scale);
        p.malla.matrixWorldNeedsUpdate = true;
      }
      pintarPolvo(t);
      renderer.render(escena, camara);
      // Terminó cuando todo cayó por debajo del hero (más cerca del ojo, un pedazo se ve más abajo).
      const afuera = pedazos.every((p) => (p.pos.y + p.alcance * 1.5) * (OJO / Math.max(OJO - p.pos.z, 1)) < piso);
      // O cuando pasó el tope, por el reloj: una pestaña que estuvo oculta no retoma la caída a medias.
      if (afuera || (ahora - inicio) / 1000 > TOPE_S) {
        limpiar?.();
        alTerminar?.();
      } else cuadro = requestAnimationFrame(tic);
    };
    cuadro = requestAnimationFrame(tic);
    return true;
  };

  return {
    romper,
    destruir() {
      limpiar?.();
      triangulo.dispose();
      material.dispose();
      materialPolvo.dispose();
      polvo.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
