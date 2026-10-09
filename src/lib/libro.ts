/**
 * EL LIBRO DEL CV: una revista de papel en 3D, de frente, como la del sitio de
 * Paper Mono (la idea y los principios, no el código: esto está escrito de
 * cero). En pantallas anchas se ve abierta a dos carillas; en las angostas, una
 * sola carilla y las hojas leídas se enrollan detrás del lomo.
 *
 * El contenido: la tapa (con los enlaces), las cuatro carillas del CV, dos en
 * español y dos en inglés, y la contratapa (con «Salir»). Abierta a dos
 * carillas: tapa → [ES 1 | ES 2] → [EN 1 | EN 2] → contratapa: la última vuelta
 * da todo el bloque de hojas en blanco que le da cuerpo, y la revista queda
 * cerrada del otro lado. De a una carilla, la contratapa es la última página.
 * Las tapas son apenas más grandes que las hojas, como en una revista: los
 * cantos blancos no asoman por el borde oscuro.
 *
 * CÓMO SE DOBLA UNA HOJA. Cada hoja es un plano con el lomo en x = 0. El shader
 * la curva integrando un ángulo a lo largo del ancho (el papel no se estira) y
 * saca la normal por diferencias, así que la luz sigue cualquier forma. El
 * ángulo suma:
 *   · el giro sobre el lomo (0 a la derecha, π a la izquierda), con una torsión
 *     según de dónde se agarró la hoja (una esquina lleva la delantera);
 *   · el lomo: cerca del pliegue el papel sube y después se aplana, más en las
 *     hojas de arriba de cada pila; del otro lado, en espejo;
 *   · el atraso de la punta mientras gira;
 *   · en una sola carilla, el enrollado detrás del lomo al terminar.
 * El papel tiene grano, se transparenta apenas lo impreso del otro lado y la
 * tinta brilla un poco más que el papel.
 *
 * LA VUELTA. Un clic la da en algo más de un segundo, con una inclinación al
 * azar (ninguna vuelta es igual); arrastrando, la hoja sigue al puntero y al
 * soltarla termina o vuelve.
 */
import {
  CanvasTexture,
  DataTexture,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshDepthMaterial,
  MeshStandardMaterial,
  NoToneMapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  RGBADepthPacking,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  type IUniform,
} from "three";

/** La carilla: carta, en unidades de la escena. */
const W = 1;
const H = (W * 2530) / 1955;
/** Separación entre hojas de una pila. */
const HUECO = 0.0022;
/** Hojas en blanco al final: el cuerpo de la revista. */
const RELLENO = 10;
/** Cuánto sube el papel junto al lomo (en radianes, la hoja de arriba). */
const LOMO = 0.34;
const VUELTA_S = 1.15;
/** Lo que ocupan los controles: la ayuda arriba, la barra abajo y un margen a los costados. */
const ARRIBA_PX = 54;
const ABAJO_PX = 88;
const LADO_PX = 18;
export const ZOOM_MAXIMO = 3;

export interface EstadoLibro {
  paso: number;
  pasos: number;
  doble: boolean;
}

export interface Zona {
  cara: "tapa" | "contratapa";
  /** En fracciones de la carilla (0–1, desde arriba a la izquierda). */
  x: number;
  y: number;
  ancho: number;
  alto: number;
  accion: () => void;
}

export interface OpcionesLibro {
  tapa: HTMLCanvasElement;
  contratapa: HTMLCanvasElement;
  /** Las cuatro carillas del CV, en orden. */
  paginas: string[];
  /** Lo que se puede tocar en la tapa y en la contratapa. */
  zonas: Zona[];
  quieto: boolean;
  alCambiar: (estado: EstadoLibro) => void;
}

export interface Libro {
  siguiente: () => void;
  anterior: () => void;
  zoom: (z: number) => void;
  destruir: () => void;
}

const HOJA = /* glsl */ `
uniform float uTheta, uDoblez, uGiro, uLevanta, uRulo, uRadio, uZ;
uniform vec2 uDesp, uEsc;
varying float vS;
float alfa(float s, float y) {
  float p = s / ${W.toFixed(4)};
  float a = uTheta + uGiro * (y / ${H.toFixed(4)});
  float lado = cos(uTheta);
  a += uLevanta * lado * (exp(-s / 0.085) - 0.06 * smoothstep(0.25, 1.0, p));
  a -= uDoblez * p * p;
  a += uRulo * 3.14159265 * clamp(s / (3.14159265 * uRadio), 0.0, 1.0);
  return a;
}
vec3 hoja(float s, float y) {
  vec2 xz = vec2(0.0);
  const int N = 40;
  float ds = s / float(N);
  for (int i = 0; i < N; i++) {
    float a = alfa((float(i) + 0.5) * ds, y);
    xz += ds * vec2(cos(a), sin(a));
  }
  // El corrimiento de costado va hacia afuera de cada pila: a la derecha sin dar vuelta, a la izquierda dada.
  return vec3(xz.x + uDesp.x * cos(uTheta), y + uDesp.y, xz.y + uZ);
}
`;

const PAPEL_FRAGMENTO = /* glsl */ `
  vec2 uvD = vec2(1.0 - vMapUv.x, vMapUv.y);
  // Un poco más fino que el mip que toca: el texto queda nítido al achicarse.
  vec4 cara = gl_FrontFacing ? texture2D(map, vMapUv, -0.8) : texture2D(uDorso, uvD, -0.8);
  // Lo impreso del otro lado se transparenta apenas, difuso (de un mip chico): no ensucia las letras.
  vec3 atras = gl_FrontFacing ? texture2D(uDorso, uvD, 4.0).rgb : texture2D(map, vMapUv, 4.0).rgb;
  cara.rgb *= 1.0 - 0.025 * (1.0 - dot(atras, vec3(0.299, 0.587, 0.114)));
  // El grano del papel.
  float g = fract(sin(dot(floor(vMapUv * vec2(700.0, 906.0)), vec2(12.9898, 78.233))) * 43758.5453);
  cara.rgb *= 0.988 + 0.024 * g;
  diffuseColor *= cara;
  float tinta = clamp((1.0 - dot(cara.rgb, vec3(0.299, 0.587, 0.114))) * 1.5, 0.0, 1.0);
  // El pliegue: junto al lomo el papel se hunde y recibe menos luz.
  diffuseColor.rgb *= 1.0 - 0.16 * exp(-vS * 24.0);
`;

type Uniformes = Record<"uTheta" | "uDoblez" | "uGiro" | "uLevanta" | "uRulo" | "uRadio" | "uZ", IUniform<number>> & {
  uDesp: IUniform<Vector2>;
  uEsc: IUniform<Vector2>;
  uDorso: IUniform<Texture>;
};

function materiales(frente: Texture, dorso: Texture, u: Uniformes) {
  const papel = new MeshStandardMaterial({ map: frente, roughness: 0.8, metalness: 0, side: DoubleSide });
  papel.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    s.vertexShader = s.vertexShader
      .replace("#include <common>", `#include <common>\n${HOJA}`)
      .replace(
        "#include <beginnormal_vertex>",
        /* glsl */ `
        vec2 q = position.xy * uEsc;
        vec3 hp = hoja(q.x, q.y);
        vec3 hx = hoja(q.x + 0.01, q.y);
        vec3 hy = hoja(q.x, q.y + 0.01);
        vec3 objectNormal = normalize(cross(hx - hp, hy - hp));
        vS = position.x / ${W.toFixed(4)};
        `,
      )
      .replace("#include <begin_vertex>", "vec3 transformed = hp;");
    s.fragmentShader = s.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D uDorso;\nvarying float vS;")
      .replace("#include <map_fragment>", PAPEL_FRAGMENTO)
      // La tinta brilla un poco más que el papel.
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix(roughnessFactor, 0.45, tinta);");
  };
  const sombra = new MeshDepthMaterial({ depthPacking: RGBADepthPacking, side: DoubleSide });
  sombra.onBeforeCompile = (s) => {
    Object.assign(s.uniforms, u);
    s.vertexShader = s.vertexShader
      .replace("#include <common>", `#include <common>\n${HOJA}`)
      .replace("#include <begin_vertex>", "vec3 transformed = hoja(position.x * uEsc.x, position.y * uEsc.y); vS = 0.0;");
  };
  return { papel, sombra };
}

interface Hoja {
  malla: Mesh;
  u: Uniformes;
  gira: boolean;
  t: number;
  desde: number;
  hasta: number;
  inicio: number;
  dur: number;
  sentido: number;
  /** Inclinación de esta vuelta: la del agarre o una al azar. */
  giro: number;
  arrastrada: boolean;
  meta: number;
  /** Cuánto asoma el canto de costado (las hojas en blanco), y si es una tapa (que no se corre). */
  asoma: number;
  tapa: boolean;
}

const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const vaiven = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export function crearLibro(contenedor: HTMLElement, o: OpcionesLibro): Libro {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  // Sin mapeo de tonos: el blanco del papel es blanco y la tinta, negra. Es lo que se lee.
  renderer.toneMapping = NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  const lienzo = renderer.domElement;
  lienzo.style.cssText = "position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab";
  contenedor.appendChild(lienzo);

  const escena = new Scene();
  const libro = new Group();
  escena.add(libro);
  libro.add(new HemisphereLight("#ffffff", "#a3acaf", 1.55));
  // La luz entra desde la izquierda y arriba: la carilla izquierda se oscurece hacia el lomo y la derecha lo agarra.
  const sol = new DirectionalLight("#ffffff", 1.9);
  sol.position.set(-1.4, 1.1, 2.6);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -1.6, right: 1.6, top: 1.2, bottom: -1.2, near: 0.5, far: 8 });
  sol.shadow.bias = -0.0006;
  sol.shadow.normalBias = 0.01;
  sol.shadow.radius = 5;
  sol.shadow.intensity = 0.5;
  libro.add(sol, sol.target);

  // El apoyo: sólo recibe la sombra de la revista.
  const piso = new Mesh(new PlaneGeometry(12, 12), new ShadowMaterial({ opacity: 0.38 }));
  piso.position.z = -(RELLENO + 6) * HUECO - 0.004;
  piso.receiveShadow = true;
  libro.add(piso);

  // ── Las texturas: cada una se carga una sola vez ──
  const anisotropia = renderer.capabilities.getMaxAnisotropy();
  const blanco = new DataTexture(new Uint8Array([250, 249, 245, 255]), 1, 1);
  blanco.colorSpace = SRGBColorSpace;
  blanco.needsUpdate = true;
  const tapa = new CanvasTexture(o.tapa);
  tapa.colorSpace = SRGBColorSpace;
  tapa.anisotropy = anisotropia;
  const cargador = new TextureLoader();
  const paginas = o.paginas.map((url) => {
    const t = cargador.load(url, () => pedir());
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = anisotropia;
    return t;
  });
  const [es1, es2, en1, en2] = paginas as [Texture, Texture, Texture, Texture];
  const contra = new CanvasTexture(o.contratapa);
  contra.colorSpace = SRGBColorSpace;
  contra.anisotropy = anisotropia;

  const geometria = new PlaneGeometry(W, H, 72, 20);
  geometria.translate(W / 2, 0, 0);

  // ── Las hojas, según cómo se mira ──
  let doble = true;
  let hojas: Hoja[] = [];
  /** Cuántas vueltas tiene la revista; abierta, la última da el bloque entero. */
  let giran = 0;
  let dadas = 0;
  /** Las hojas que da la vuelta número k. */
  const grupo = (k: number) => (doble && k === giran - 1 ? hojas.slice(k) : hojas.slice(k, k + 1));
  /** En qué vuelta se da la hoja i. */
  const vueltaDe = (i: number) => (doble ? Math.min(i, giran - 1) : i);
  const azar = (i: number) => {
    const x = Math.sin(i * 91.7 + 13.1) * 43758.5453;
    return x - Math.floor(x);
  };

  const armar = (pagina: number) => {
    for (const h of hojas) {
      libro.remove(h.malla);
      (h.malla.material as MeshStandardMaterial).dispose();
      h.malla.customDepthMaterial?.dispose();
    }
    // Abierta: cada hoja lleva una carilla de cada lado. Cerrada a una carilla: una por hoja.
    // Abierta, la contratapa es el dorso de la última hoja; de a una, la última página.
    const caras: [Texture, Texture][] = doble
      ? [[tapa, es1], [es2, en1], [en2, blanco]]
      : [[tapa, blanco], [es1, blanco], [es2, blanco], [en1, blanco], [en2, blanco], [contra, blanco]];
    giran = doble ? 3 : 5;
    const llenas = caras.length;
    for (let i = 0; i < RELLENO; i++) caras.push([blanco, blanco]);
    if (doble) caras[caras.length - 1] = [blanco, contra];
    const tapas = doble ? [0, caras.length - 1] : [0, 5];
    dadas = Math.min(giran, doble ? Math.ceil(pagina / 2) : pagina);
    hojas = caras.map(([frente, dorso], i) => {
      const esTapa = tapas.includes(i);
      const relleno = i >= llenas && !esTapa;
      const u: Uniformes = {
        uTheta: { value: 0 },
        uDoblez: { value: 0 },
        uGiro: { value: 0 },
        uLevanta: { value: 0 },
        uRulo: { value: 0 },
        uRadio: { value: 0.06 + (giran - i) * HUECO * 1.5 },
        uZ: { value: 0 },
        // Los cantos no coinciden del todo: se ven las hojas.
        uDesp: { value: new Vector2(0, relleno ? (azar(i + 7) - 0.5) * 0.003 : 0) },
        // Las tapas, apenas más grandes: tapan los cantos de las hojas.
        uEsc: { value: esTapa ? new Vector2(1.004, 1.003) : new Vector2(1, 1) },
        uDorso: { value: dorso },
      };
      const { papel, sombra } = materiales(frente, dorso, u);
      const malla = new Mesh(geometria, papel);
      malla.customDepthMaterial = sombra;
      malla.castShadow = malla.receiveShadow = true;
      malla.frustumCulled = false;
      libro.add(malla);
      const t = vueltaDe(i) < dadas ? 1 : 0;
      return {
        malla,
        u,
        gira: doble || i < giran,
        t,
        desde: t,
        hasta: t,
        inicio: 0,
        dur: 0,
        sentido: 1,
        giro: 0,
        arrastrada: false,
        meta: t,
        asoma: relleno ? azar(i) * 0.0015 : 0,
        tapa: esTapa,
      };
    });
    avisar();
    pedir();
  };

  const pagina = () => (doble ? (dadas === 0 ? 0 : dadas * 2 - 1) : dadas);
  const avisar = () => o.alCambiar({ paso: dadas, pasos: giran + 1, doble });

  // ── La vuelta: una hoja, de un lado al otro, con su tiempo y su inclinación ──
  const girar = (k: number, hasta: number, dur = VUELTA_S * (0.95 + azar(performance.now()) * 0.13), giro = (Math.random() - 0.5) * 0.28) => {
    for (const h of grupo(k)) {
      h.arrastrada = false;
      h.desde = h.t;
      h.hasta = hasta;
      h.sentido = hasta > h.t ? 1 : -1;
      h.inicio = performance.now();
      h.dur = o.quieto ? 0 : dur * Math.max(0.35, Math.abs(hasta - h.t));
      h.giro = giro;
    }
    pedir();
  };
  const siguiente = () => {
    if (dadas >= giran) return;
    girar(dadas, 1);
    dadas++;
    avisar();
  };
  const anterior = () => {
    if (dadas <= 0) return;
    dadas--;
    girar(dadas, 0);
    avisar();
  };

  // ── La cámara: de frente; la revista cerrada se centra en la tapa, abierta en el lomo ──
  const camara = new PerspectiveCamera(26, 1, 0.1, 40);
  let distancia = 5;
  let zoom = 1;
  const paneo = new Vector2();
  let centroX = W / 2;
  let subir = 0;
  /** Qué parte del alto de la pantalla queda libre para la revista (el resto es de los controles). */
  let parteLibre = 1;
  /** Cuánto mundo es un píxel de pantalla, con el zoom de ahora. */
  const mundoPorPixel = () => (2 * (distancia / zoom) * Math.tan((camara.fov * Math.PI) / 360)) / Math.max(1, contenedor.clientHeight);
  /** Con zoom, hasta dónde se puede bajar o subir: que se vea la carilla entera, ni más. */
  const limiteVertical = () => {
    const medioVisible = (distancia / zoom) * Math.tan((camara.fov * Math.PI) / 360) * parteLibre;
    return Math.max(0, H / 2 + 0.02 - medioVisible);
  };
  const desplazar = (y: number) => {
    const l = limiteVertical();
    paneo.set(0, Math.max(-l, Math.min(l, y)));
    pedir();
  };

  const encuadrar = () => {
    const { clientWidth: ancho, clientHeight: alto } = contenedor;
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
    const quiereDoble = ancho >= 860 && ancho / alto >= 1.1;
    if (quiereDoble !== doble || hojas.length === 0) {
      const p = hojas.length ? pagina() : 0;
      doble = quiereDoble;
      armar(p);
    }
    // Lo más grande que entre: el alto, entre la ayuda de arriba y la barra de abajo; el ancho, con un
    // margen chico (abierta, las dos carillas; cerrada usa la misma escala para no saltar al abrirse).
    const tan = Math.tan((camara.fov * Math.PI) / 360);
    const libre = { alto: Math.max(120, alto - ARRIBA_PX - ABAJO_PX), ancho: Math.max(120, ancho - 2 * LADO_PX) };
    distancia = Math.max((H * alto) / (2 * tan * libre.alto), ((doble ? 2 * W : W) * alto) / (2 * tan * libre.ancho));
    // El centro del espacio libre queda arriba del centro de la pantalla: la revista sube eso.
    subir = (-(ABAJO_PX - ARRIBA_PX) / 2) * ((2 * distancia * tan) / alto);
    parteLibre = libre.alto / alto;
    desplazar(paneo.y);
  };

  // ── El puntero ──
  const rayo = new Raycaster();
  const plano = new Plane(new Vector3(0, 0, 1), 0);
  const punto = new Vector3();
  const enLibro = (e: PointerEvent) => {
    const r = lienzo.getBoundingClientRect();
    rayo.setFromCamera(new Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camara);
    return rayo.ray.intersectPlane(plano, punto) ? { x: punto.x, y: punto.y } : null;
  };
  // Lo que hay para tocar bajo el puntero, con la revista quieta en la tapa o en la contratapa.
  const zonaEn = (e: PointerEvent) => {
    let cara: Zona["cara"];
    let desde = 0;
    if (dadas === 0 && (hojas[0]?.t ?? 1) < 0.02) cara = "tapa";
    else if (dadas === giran && (hojas[doble ? hojas.length - 1 : giran - 1]?.t ?? 0) > 0.98) {
      cara = "contratapa";
      // Abierta, la contratapa es un dorso: queda a la izquierda del lomo.
      if (doble) desde = -W;
    } else return undefined;
    const p = enLibro(e);
    if (!p) return undefined;
    const x = (p.x - desde) / W;
    const y = (H / 2 - p.y) / H;
    return o.zonas.find((l) => l.cara === cara && x >= l.x && x <= l.x + l.ancho && y >= l.y && y <= l.y + l.alto);
  };

  // Arrastrar: de costado pasa la hoja (también con zoom); con zoom, hacia arriba o abajo mueve el documento.
  let agarre: { id: number; x: number; y: number; px: number; hoja: number; movio: boolean; vertical: boolean; paneoY: number } | null = null;
  const alBajar = (e: PointerEvent) => {
    const p = enLibro(e);
    lienzo.setPointerCapture(e.pointerId);
    agarre = { id: e.pointerId, x: e.clientX, y: e.clientY, px: p?.x ?? 0, hoja: -1, movio: false, vertical: false, paneoY: paneo.y };
    if (!p) return;
    // Del lado derecho se agarra la hoja de arriba de la pila derecha; del izquierdo, la última que pasó.
    const adelante = doble ? p.x > 0 : p.x > W * 0.35;
    const i = adelante ? (dadas < giran ? dadas : -1) : dadas > 0 ? dadas - 1 : -1;
    if (i < 0) return;
    agarre.hoja = i;
    // Agarrada de una esquina, esa esquina lleva la delantera.
    for (const h of grupo(i)) h.giro = Math.max(-1, Math.min(1, p.y / (H / 2))) * 0.42 * (adelante ? -1 : 1);
  };
  const alMover = (e: PointerEvent) => {
    if (!agarre || agarre.id !== e.pointerId) {
      lienzo.style.cursor = zonaEn(e) ? "pointer" : "grab";
      return;
    }
    const dx = e.clientX - agarre.x;
    const dy = e.clientY - agarre.y;
    if (!agarre.movio) {
      if (Math.hypot(dx, dy) < 5) return;
      agarre.movio = true;
      // La dirección se decide al empezar: así un arrastre vertical no mueve la hoja, ni al revés.
      agarre.vertical = zoom > 1 && Math.abs(dy) > Math.abs(dx);
      if (agarre.vertical) agarre.hoja = -1;
    }
    lienzo.style.cursor = "grabbing";
    if (agarre.vertical) {
      desplazar(agarre.paneoY + dy * mundoPorPixel());
      return;
    }
    const p = enLibro(e);
    if (agarre.hoja < 0 || !p) return;
    const adelante = agarre.hoja === dadas;
    const recorrido = doble ? 2 * W : 1.4 * W;
    const avance = (agarre.px - p.x) / recorrido;
    for (const h of grupo(agarre.hoja)) {
      h.arrastrada = true;
      h.sentido = adelante ? 1 : -1;
      h.meta = adelante ? Math.min(1, Math.max(0, avance)) : 1 - Math.min(1, Math.max(0, -avance));
    }
    pedir();
  };
  const alSoltar = (e: PointerEvent) => {
    if (!agarre || agarre.id !== e.pointerId) return;
    const a = agarre;
    agarre = null;
    lienzo.style.cursor = "grab";
    const h = a.hoja >= 0 ? grupo(a.hoja)[0] : undefined;
    if (a.movio && h) {
      const adelante = a.hoja === dadas;
      // Alcanza con un empujón: si se movió un poco, termina; si apenas, vuelve. Cuenta hasta dónde
      // llegó el puntero, no la hoja: un arrastre rápido termina antes de que la hoja lo alcance.
      const llego = h.arrastrada ? h.meta : h.t;
      if (adelante && llego > 0.12) {
        dadas++;
        girar(a.hoja, 1, VUELTA_S * 0.9, h.giro);
        avisar();
      } else if (!adelante && llego < 0.88) {
        dadas--;
        girar(a.hoja, 0, VUELTA_S * 0.9, h.giro);
        avisar();
      } else girar(a.hoja, adelante ? 0 : 1, VUELTA_S * 0.6, h.giro);
      return;
    }
    if (a.movio) return;
    const zona = zonaEn(e);
    if (zona) {
      zona.accion();
      return;
    }
    const p = enLibro(e);
    if (!p) return;
    if (doble ? p.x > 0 : p.x > W * 0.35) siguiente();
    else anterior();
  };
  lienzo.addEventListener("pointerdown", alBajar);
  lienzo.addEventListener("pointermove", alMover);
  lienzo.addEventListener("pointerup", alSoltar);
  lienzo.addEventListener("pointercancel", alSoltar);
  // La rueda, con zoom, baja y sube por el documento.
  const alRodar = (e: WheelEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    desplazar(paneo.y - e.deltaY * mundoPorPixel());
  };
  lienzo.addEventListener("wheel", alRodar, { passive: false });

  // ── El cuadro ──
  let pedido = 0;
  let antes = 0;
  const cuadro = (ahora: number) => {
    pedido = 0;
    const dt = Math.min(1 / 30, antes ? (ahora - antes) / 1000 : 1 / 60);
    antes = ahora;
    let moviendo = !!agarre;

    for (const h of hojas) {
      if (!h.gira) continue;
      if (h.arrastrada) {
        h.t += (h.meta - h.t) * (1 - Math.exp(-dt / 0.07));
        if (Math.abs(h.meta - h.t) > 0.0005) moviendo = true;
      } else if (h.t !== h.hasta) {
        const x = h.dur ? Math.min(1, (ahora - h.inicio) / (h.dur * 1000)) : 1;
        h.t = h.desde + (h.hasta - h.desde) * vaiven(x);
        if (x < 1) moviendo = true;
        else h.t = h.hasta;
      }
    }

    // Cerrada, las hojas se corren apenas hacia afuera: junto al lomo de la tapa no asoma el blanco.
    // Abierta a dos carillas, se juntan en el lomo.
    const cerrada = doble ? Math.min(1, Math.abs(centroX) / (W / 2)) : 1;
    for (const h of hojas) h.u.uDesp.value.x = h.asoma + (h.tapa ? 0 : 0.002 * cerrada);

    // Las pilas: cada hoja se apoya sobre las que tiene debajo de su lado.
    hojas.forEach((h, i) => {
      let derecha = 0;
      let izquierda = 0;
      hojas.forEach((otra, j) => {
        if (j < i) derecha += 1 - otra.t;
        if (j > i) izquierda += otra.t;
      });
      const lado = suave(0.15, 0.85, h.t);
      const hondo = derecha + (izquierda - derecha) * lado;
      const tt = Math.min(1, Math.max(0, h.t));
      const enVuelo = Math.sin(Math.PI * tt);
      h.u.uTheta.value = Math.PI * h.t;
      h.u.uDoblez.value = 0.95 * enVuelo * h.sentido;
      h.u.uGiro.value = h.giro * enVuelo;
      // Arriba de la pila el papel sube más junto al lomo; en vuelo, nada.
      h.u.uLevanta.value = (LOMO / (1 + hondo * 0.45)) * (1 - enVuelo) * (doble ? 1 : 1 - tt);
      h.u.uRulo.value = doble ? 0 : suave(0.55, 1, h.t);
      h.u.uZ.value = -hondo * HUECO;
    });

    // La cámara se corre al lomo cuando la revista se abre, y a la contratapa cuando se cierra del otro lado.
    const objetivoX = !doble || dadas === 0 ? W / 2 : dadas === giran ? -W / 2 : 0;
    centroX += (objetivoX - centroX) * (1 - Math.exp(-dt / 0.28));
    if (Math.abs(objetivoX - centroX) > 0.0005) moviendo = true;
    const d = distancia / zoom;
    camara.position.set(centroX + paneo.x, paneo.y + subir, d);
    camara.lookAt(centroX + paneo.x, paneo.y + subir, 0);
    sol.target.position.set(centroX, 0, 0);

    renderer.render(escena, camara);
    if (moviendo) pedir();
    else antes = 0;
  };
  function pedir() {
    if (!pedido) pedido = requestAnimationFrame(cuadro);
  }

  const observador = new ResizeObserver(encuadrar);
  observador.observe(contenedor);
  encuadrar();

  return {
    siguiente,
    anterior,
    zoom: (z) => {
      zoom = Math.max(1, Math.min(ZOOM_MAXIMO, z));
      desplazar(paneo.y);
    },
    destruir: () => {
      cancelAnimationFrame(pedido);
      observador.disconnect();
      lienzo.removeEventListener("pointerdown", alBajar);
      lienzo.removeEventListener("pointermove", alMover);
      lienzo.removeEventListener("pointerup", alSoltar);
      lienzo.removeEventListener("pointercancel", alSoltar);
      lienzo.removeEventListener("wheel", alRodar);
      for (const h of hojas) {
        (h.malla.material as MeshStandardMaterial).dispose();
        h.malla.customDepthMaterial?.dispose();
      }
      [...paginas, tapa, contra, blanco].forEach((t) => t.dispose());
      geometria.dispose();
      piso.geometry.dispose();
      (piso.material as ShadowMaterial).dispose();
      renderer.dispose();
      lienzo.remove();
    },
  };
}
