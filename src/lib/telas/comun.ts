/**
 * LO COMUN DE LAS PANTALLAS DE TELA: las medidas, el recorrido del hilo y el
 * shader con el que se pinta cada tela. La física (Bullet, vía Ammo.js) está
 * en `motor.ts`.
 */
import { Color, SRGBColorSpace } from "three";

export interface TelaDatos {
  slug: string;
  poster: string;
  video: string;
  /** Cualquier color CSS (los acentos del sitio están en oklch). */
  acento: string;
}

export interface OpcionesTelas {
  contenedor: HTMLElement;
  telas: TelaDatos[];
  alCambiar: (i: number) => void;
  alListo: () => void;
}

export interface MotorTelas {
  ir: (i: number) => void;
  destruir: () => void;
}

/* ─── Medidas (en metros de mentira: la tela mide 1,6 × 0,9) ─── */

export const ANCHO = 1.6;
export const ALTO = 0.9;
export const HUECO = 0.44;
export const PASO_X = ANCHO + HUECO;
/** El hilo, apenas por encima del centro: la tela cuelga de ahí. */
export const HILO_Y = ALTO / 2 + 0.05;

/** Malla de 24 × 14: celdas casi cuadradas para una tela 16:9. */
export const MX = 24;
export const MY = 14;
/**
 * EL AIRE. Cuando el hilo se desliza, la tela no sólo se queda atrás: el aire
 * la infla. Es una fuerza en z proporcional a la velocidad del hilo, más
 * fuerte abajo (arriba la sostienen los broches) y con una ondulación a lo
 * ancho para que no se infle como una vela rígida.
 */
export const AIRE = 2.6;
/** El techo del aire: saltar tres telas de golpe no puede volverlas una bandera. */
export const AIRE_MAXIMO = 1.7;

/**
 * El resorte del recorrido: llega en algo menos de un segundo y se pasa apenas.
 * Con tope de velocidad: saltar de la primera a la última tarda más, pero el
 * hilo nunca va tan rápido como para que la tela se dé vuelta.
 */
export const RESORTE = 18;
export const FRENO = 2 * Math.sqrt(RESORTE) * 0.86;
export const VELOCIDAD_MAXIMA = 3.2;

/* ─── Shaders ─── */

export const VERTICE = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vVista;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vVista = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

export const FRAGMENTO = /* glsl */ `
  uniform sampler2D uMapa;
  uniform float uLuz;      // 1 = la tela elegida; 0 = apagada
  uniform float uListo;    // el video (o el póster) ya llegó
  uniform vec3 uAcento;
  uniform vec2 uMargen;    // el dobladillo, en uv

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vVista;

  void main() {
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(vVista);

    // Luz de arriba y un poco de la izquierda: los pliegues se ven por su sombra.
    vec3 l = normalize(vec3(-0.35, 0.55, 1.0));
    float difusa = clamp(dot(n, l), 0.0, 1.0);
    float pliegue = mix(0.55, 1.0, difusa);

    // Satén: un brillo angosto que corre por los pliegues cuando la tela se mueve.
    vec3 h = normalize(l + v);
    float saten = pow(max(dot(n, h), 0.0), 48.0) * 0.16;

    // El video ocupa la tela menos el dobladillo.
    vec2 uv = (vUv - uMargen) / (1.0 - 2.0 * uMargen);
    // EL BORDE, SUAVE. Un corte seco (dentro / fuera) escalona el borde en
    // píxeles: se veía dentado, sobre todo en los videos blancos. fwidth dice
    // cuánto uv entra en un píxel, y el video se funde en píxel y medio.
    vec2 paso = fwidth(uv) * 1.5;
    vec2 borde = smoothstep(vec2(0.0), paso, uv) * smoothstep(vec2(0.0), paso, 1.0 - uv);
    float dentro = borde.x * borde.y;

    vec3 tela = vec3(0.009);
    // Medio por ciento hacia adentro: la última fila de los mp4 trae un borde verde de codificación.
    vec3 imagen = texture2D(uMapa, mix(vec2(0.005), vec2(0.995), clamp(uv, 0.0, 1.0))).rgb;
    // Apagada: más oscura y menos saturada, como una pantalla en reposo.
    float gris = dot(imagen, vec3(0.2126, 0.7152, 0.0722));
    imagen = mix(vec3(gris), imagen, mix(0.25, 1.0, uLuz)) * mix(0.09, 1.0, uLuz);
    imagen = mix(tela, imagen, uListo);

    vec3 color = mix(tela + uAcento * 0.02 * uLuz, imagen, dentro);
    color = color * pliegue + saten;

    // El revés de la tela: el mismo paño, sin imagen.
    if (!gl_FrontFacing) color = vec3(0.006) * pliegue + saten * 0.3;

    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Un color CSS cualquiera (oklch incluido) a RGB lineal, pasando por un canvas. */
export function rgbDe(css: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const x = c.getContext("2d");
  if (!x) return new Color(1, 1, 1);
  x.fillStyle = css;
  x.fillRect(0, 0, 1, 1);
  const [r, g, b] = x.getImageData(0, 0, 1, 1).data;
  return new Color().setRGB(r! / 255, g! / 255, b! / 255, SRGBColorSpace);
}

export const modulo = (a: number, n: number) => ((a % n) + n) % n;
