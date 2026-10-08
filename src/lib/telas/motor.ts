/**
 * LAS PANTALLAS DE TELA: los proyectos colgados de un hilo, debajo del nombre.
 *
 * La escena (el hilo, los videos, el carrusel) es Three.js, con un shader
 * propio para pintar cada tela (`comun.ts`). La tela la resuelve Bullet:
 * Ammo.js es Bullet compilado a WebAssembly, el mismo motor que usa el ejemplo
 * oficial de Three (`physics_ammo_cloth`) y el plugin de arrival.space que
 * estudió el museo de Ask Leonardo. Pesa ~300 KB comprimidos y se baja aparte,
 * de `public/vendor/ammo/` (licencia zlib), después de que el hero ya se ve.
 * (Hubo una versión con un Verlet propio; Bullet se ve mucho mejor.)
 *
 * Lo que se suma, observado en portfolio.ui8.dev (Forge):
 * - BROCHES QUE SE SUELTAN. Cada broche es un nodo con masa cero; tocarlo le
 *   devuelve la masa y la tela cede de ese lado. Sueltos todos, se cae; cuando
 *   sale de la vista se vuelve a colgar.
 * - AGARRAR LA TELA. No un punto: una zona con caída suave, que sigue al
 *   puntero sobre un plano frente a la cámara, con tope y un poco hacia quien
 *   mira.
 * - EL ROCE DEL PUNTERO. Al pasar, el mouse empuja la tela hacia adentro.
 * - UNA BRISA, apenas: la tela respira, pero no distrae del video.
 *
 * Y lo que se sacó por demasiado movimiento: el avance automático, y los
 * videos de las telas de costado (quedan quietas; corre sólo el del centro).
 */
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Scene,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  TorusGeometry,
  Vector2,
  Vector3,
  VideoTexture,
  WebGLRenderer,
} from "three";
import {
  AIRE,
  AIRE_MAXIMO,
  ALTO,
  ANCHO,
  FRAGMENTO,
  FRENO,
  HILO_Y,
  modulo,
  MX,
  MY,
  PASO_X,
  RESORTE,
  rgbDe,
  VELOCIDAD_MAXIMA,
  VERTICE,
  type MotorTelas,
  type OpcionesTelas,
} from "./comun";

/* eslint-disable @typescript-eslint/no-explicit-any -- Ammo no trae tipos. */
type AmmoLib = any;

declare global {
  interface Window {
    Ammo?: (o: { locateFile: (f: string) => string }) => Promise<AmmoLib>;
  }
}

let cargando: Promise<AmmoLib> | null = null;
/** Ammo se carga una sola vez, con su `.wasm` al lado. */
function cargarAmmo(): Promise<AmmoLib> {
  cargando ??= new Promise((ok, mal) => {
    const s = document.createElement("script");
    s.src = "/vendor/ammo/ammo.wasm.js";
    s.async = true;
    s.onload = () => {
      if (!window.Ammo) return mal(new Error("Ammo no se definió"));
      window.Ammo({ locateFile: (f) => `/vendor/ammo/${f}` }).then(ok, mal);
    };
    s.onerror = () => mal(new Error("No cargó Ammo"));
    document.head.appendChild(s);
  });
  return cargando;
}

/* ─── La tela en Bullet ─── */

/**
 * TRES BROCHES, y el borde de arriba entero clavado: cada broche sostiene el
 * tramo más cercano. Con un nodo por broche el borde se combaba entre ellos y
 * la tela colgaba como una carpa, no como un rectángulo. Al soltar uno, cae su
 * tramo.
 *
 * Van al 10%, al medio y al 90% del ancho (en columnas de la malla, que pueden
 * caer entre dos nodos): en las puntas exactas, medio broche mordía el vacío.
 */
const COLUMNAS_BROCHE = [0.1, 0.5, 0.9].map((u) => u * (MX - 1));
const MASA_TOTAL = 0.32;
const DT = 1 / 60;
/** Bullet: no se estira (kLST), casi no se tuerce (kAST) y resiste doblarse en dos celdas. */
const RIGIDEZ_LINEAL = 0.98;
const RIGIDEZ_ANGULAR = 0.95;
const ITERACIONES = 12;
const AMORTIGUACION = 0.012;

/**
 * MEMORIA DE FORMA (el «recovery» de ui8, y la misma idea que el telón del
 * museo, D-164): cada paso, cada nodo se corre un 3,5% hacia su lugar en el
 * rectángulo perfecto. Sin esto, Bullet estira la tela con su propio peso y la
 * brisa la deforma: no colgaba rectangular. Se apaga mientras alguien la
 * agarra y mientras tiene un broche suelto, para que la caída sea libre.
 */
const RECUPERACION = 0.035;

/** Cuánto del movimiento del hilo se lleva la tela entera (ver `mover`). */
const ARRASTRE = 0.94;

/**
 * EL BROCHE CEDE. Si al tirar el punto agarrado se aleja de un broche más de
 * esto por encima de la distancia que los separaba, el broche suelta, como
 * una tela de verdad tironeada. Antes la tela se estiraba lejos del broche y
 * al soltarla volvía como un elástico.
 */
const TENSION = 0.4;

/** Un broche suelto se vuelve a enganchar solo si nadie toca la tela por un rato. */
const REENGANCHE_ESPERA = 8000;
const REENGANCHE_DURA = 0.8;

/** El brillo que recorre el hilo: cada cuánto pasa y cuánto tarda en cruzar. */
const DESTELLO_CADA = 6;
const DESTELLO_DURA = 2.4;

/** La brisa: aceleración en z (hacia quien mira), más fuerte abajo. */
/*
 * La brisa empuja PAREJO a todo el ancho: si variaba por columna (como antes),
 * las puntas se torcían distinto que el medio y, con la perspectiva, la tela se
 * veía trapezoidal en cada ráfaga. La ondulación por columna queda sólo para
 * el aire del recorrido, que dura lo que dura el deslizamiento.
 */
const BRISA = 0.07;
/** Cuánto del aire del recorrido llega a la tela: un balanceo hacia atrás, parejo. */
const AIRE_RECORRIDO = 0.25;
const RAFAGA = 0.08;

/** Agarrar: el radio de la zona, el tope del tirón y cuánto se acerca. */
const AGARRE_RADIO = 0.42;
const AGARRE_TOPE = 0.9;
const AGARRE_RIGIDEZ = 16;
/** El roce: radio y velocidad hacia adentro a puntero rápido. */
const ROCE_RADIO = 0.34;
const ROCE = 0.35;

interface PiezaBroche {
  grupo: Object3D;
  cuerpo: MeshStandardMaterial;
  halo: SpriteMaterial;
}

interface Broche extends PiezaBroche {
  /** La columna del borde donde muerde. */
  col: number;
  /** Los nodos del borde de arriba que sostiene: los más cerca de él. */
  nodos: number[];
  suelto: boolean;
  /** 0 a 1: cuánto se ilumina (el puntero encima, o el destello del hilo). */
  luz: number;
  /** 0 a 1: el reenganche en curso (1 = enganchado). */
  volviendo: number;
  /** Dónde estaban sus nodos cuando empezó a reengancharse. */
  desde: Float32Array;
}

class TelaAmmo {
  sb: any;
  nodos: any;
  n = MX * MY;
  masaNodo: number;
  reposo = new Float32Array(MX * MY * 3);
  local = new Float32Array(MX * MY * 3);
  geom = new BufferGeometry();
  grupo = new Group();
  broches: Broche[] = [];
  x = 0;
  /** Sueltos todos: cayendo, y desde cuándo está fuera de la vista. */
  fuera = 0;
  /** Si está en el mundo de Bullet. Las que no se ven salen y no cuestan nada. */
  activa = true;

  /** Cuándo se la tocó o se le soltó un broche por última vez. */
  tocada = 0;

  constructor(
    private A: AmmoLib,
    mundo: any,
    public material: ShaderMaterial,
    crearBroche: () => PiezaBroche,
    x: number,
  ) {
    this.x = x;
    const v = (px: number, py: number) => new A.btVector3(px, py, 0);
    const ayuda = new A.btSoftBodyHelpers();
    // Esquinas: arriba izquierda, arriba derecha, abajo izquierda, abajo derecha.
    // Nodo (columna, fila) = fila · MX + columna, igual que la malla de Three.
    this.sb = ayuda.CreatePatch(
      mundo.getWorldInfo(),
      v(x - ANCHO / 2, HILO_Y),
      v(x + ANCHO / 2, HILO_Y),
      v(x - ANCHO / 2, HILO_Y - ALTO),
      v(x + ANCHO / 2, HILO_Y - ALTO),
      MX,
      MY,
      0,
      true,
    );
    const cfg = this.sb.get_m_cfg();
    cfg.set_viterations(ITERACIONES);
    cfg.set_piterations(ITERACIONES);
    cfg.set_kDP(AMORTIGUACION);
    const mat = this.sb.get_m_materials().at(0);
    mat.set_m_kLST(RIGIDEZ_LINEAL);
    mat.set_m_kAST(RIGIDEZ_ANGULAR);
    this.sb.generateBendingConstraints(2, mat);
    this.sb.setTotalMass(MASA_TOTAL, false);
    this.masaNodo = MASA_TOTAL / this.n;
    A.castObject(this.sb, A.btCollisionObject).getCollisionShape().setMargin(0.01);
    this.sb.setActivationState(4); // no se duerme: la brisa no para
    mundo.addSoftBody(this.sb, 1, -1);
    this.nodos = this.sb.get_m_nodes();

    const dx = ANCHO / (MX - 1);
    for (const c of COLUMNAS_BROCHE) {
      const pieza = crearBroche();
      pieza.grupo.position.set(-ANCHO / 2 + c * dx, HILO_Y, 0.008);
      this.grupo.add(pieza.grupo);
      this.broches.push({ ...pieza, col: c, nodos: [], suelto: false, luz: 0, volviendo: 1, desde: new Float32Array(0) });
    }
    for (let c = 0; c < MX; c++) {
      let mejor = 0;
      COLUMNAS_BROCHE.forEach((cb, j) => {
        if (Math.abs(cb - c) < Math.abs(COLUMNAS_BROCHE[mejor]! - c)) mejor = j;
      });
      this.broches[mejor]!.nodos.push(c);
      this.sb.setMass(c, 0);
    }

    const uv = new Float32Array(this.n * 2);
    for (let y = 0; y < MY; y++)
      for (let c = 0; c < MX; c++) {
        const i = y * MX + c;
        uv[i * 2] = c / (MX - 1);
        uv[i * 2 + 1] = 1 - y / (MY - 1);
      }
    const indices: number[] = [];
    for (let y = 0; y < MY - 1; y++)
      for (let c = 0; c < MX - 1; c++) {
        const i = y * MX + c;
        indices.push(i, i + MX, i + 1, i + 1, i + MX, i + MX + 1);
      }
    this.geom.setAttribute("position", new BufferAttribute(this.local, 3));
    this.geom.setAttribute("uv", new BufferAttribute(uv, 2));
    this.geom.setIndex(indices);
    this.grupo.add(new Mesh(this.geom, material));
    this.grupo.position.x = x;
    // El reposo es el rectángulo perfecto, recién creado: es la forma a la que vuelve.
    this.guardarReposo();
  }

  /** Después de asentarse: lo que quedó es la forma de reposo (en coordenadas de la tela). */
  guardarReposo() {
    for (let i = 0; i < this.n; i++) {
      const p = this.nodos.at(i).get_m_x();
      this.reposo[i * 3] = p.x() - this.x;
      this.reposo[i * 3 + 1] = p.y();
      this.reposo[i * 3 + 2] = p.z();
    }
  }

  get todosSueltos() {
    return this.broches.every((b) => b.suelto);
  }

  get algunoSuelto() {
    return this.broches.some((b) => b.suelto || b.volviendo < 1);
  }

  /**
   * Fuera de la vista sale del mundo (como hace ui8: sólo se simula lo que se
   * ve). Al volver entra colgada y quieta, en su lugar sobre el hilo.
   */
  activar(si: boolean, mundo: any) {
    if (si === this.activa) return;
    this.activa = si;
    if (si) {
      this.recolgar();
      mundo.addSoftBody(this.sb, 1, -1);
    } else mundo.removeSoftBody(this.sb);
  }

  /** El hilo se movió: los broches van con él; la tela, por su cuenta. Un salto la lleva entera. */
  mover(x: number) {
    const d = x - this.x;
    this.x = x;
    this.grupo.position.x = x;
    if (!this.activa) return;
    /*
     * EL HILO LLEVA LA TELA ENTERA. Si sólo movía el borde de arriba, el resto
     * se quedaba atrás por inercia y la tela se torcía en un paralelogramo en
     * cada deslizamiento. Ahora el paño viaja con el hilo (posición y posición
     * previa juntas: no se le inventa velocidad) y sólo se queda atrás un
     * `1 − ARRASTRE`: lo justo para que se mezca. Un salto (la vuelta del
     * carrusel) la lleva entera.
     */
    const lleva = Math.abs(d) > PASO_X * 2 ? d : d * ARRASTRE;
    if (lleva !== 0) {
      for (let i = 0; i < this.n; i++) {
        const nd = this.nodos.at(i);
        const p = nd.get_m_x();
        p.setX(p.x() + lleva);
        const q = nd.get_m_q();
        q.setX(q.x() + lleva);
      }
    }
    for (const b of this.broches) {
      if (b.suelto) continue;
      // Reenganchándose: el tramo sube a su lugar en el broche, con una curva suave.
      let e = 1;
      if (b.volviendo < 1) {
        b.volviendo = Math.min(1, b.volviendo + DT / REENGANCHE_DURA);
        e = b.volviendo * b.volviendo * (3 - 2 * b.volviendo);
        b.grupo.rotation.z *= 0.85;
        b.grupo.rotation.x *= 0.85;
      }
      b.nodos.forEach((i, j) => {
        const k = i * 3;
        const nd = this.nodos.at(i);
        let px = this.reposo[k]! + x, py = this.reposo[k + 1]!, pz = this.reposo[k + 2]!;
        if (e < 1) {
          px = b.desde[j * 3]! + (px - b.desde[j * 3]!) * e;
          py = b.desde[j * 3 + 1]! + (py - b.desde[j * 3 + 1]!) * e;
          pz = b.desde[j * 3 + 2]! + (pz - b.desde[j * 3 + 2]!) * e;
        }
        nd.get_m_x().setValue(px, py, pz);
        nd.get_m_v().setValue(0, 0, 0);
      });
    }
  }

  /** Los broches sueltos vuelven a morder la tela: su tramo sube animado hasta ellos. */
  reenganchar() {
    for (const b of this.broches) {
      if (!b.suelto) continue;
      b.desde = new Float32Array(b.nodos.length * 3);
      b.nodos.forEach((i, j) => {
        const p = this.nodos.at(i).get_m_x();
        b.desde[j * 3] = p.x();
        b.desde[j * 3 + 1] = p.y();
        b.desde[j * 3 + 2] = p.z();
        this.sb.setMass(i, 0);
      });
      b.suelto = false;
      b.volviendo = 0;
    }
  }

  /** Memoria de forma: un paso hacia el rectángulo. Ver `RECUPERACION`. */
  recuperar() {
    if (this.algunoSuelto) return;
    for (let i = MX; i < this.n; i++) {
      const k = i * 3;
      const p = this.nodos.at(i).get_m_x();
      p.setValue(
        p.x() + (this.reposo[k]! + this.x - p.x()) * RECUPERACION,
        p.y() + (this.reposo[k + 1]! - p.y()) * RECUPERACION,
        p.z() + (this.reposo[k + 2]! - p.z()) * RECUPERACION,
      );
    }
  }

  soltar(k: number) {
    const b = this.broches[k];
    if (!b || b.suelto) return false;
    b.suelto = true;
    b.volviendo = 1;
    for (const i of b.nodos) this.sb.setMass(i, this.masaNodo);
    // Abierto y torcido en el hilo, como queda un broche que soltó.
    b.grupo.rotation.set(0.16, 0, k % 2 ? -0.22 : 0.22);
    this.tocada = performance.now();
    return true;
  }

  /** Vuelve a colgarla quieta, con todos sus broches. */
  recolgar() {
    for (let i = 0; i < this.n; i++) {
      const nd = this.nodos.at(i);
      const k = i * 3;
      nd.get_m_x().setValue(this.reposo[k]! + this.x, this.reposo[k + 1]!, this.reposo[k + 2]!);
      nd.get_m_q().setValue(this.reposo[k]! + this.x, this.reposo[k + 1]!, this.reposo[k + 2]!);
      nd.get_m_v().setValue(0, 0, 0);
    }
    for (const b of this.broches) {
      b.suelto = false;
      b.volviendo = 1;
      for (const i of b.nodos) this.sb.setMass(i, 0);
      b.grupo.rotation.set(0, 0, 0);
    }
    this.fuera = 0;
  }

  /** La brisa y el aire del recorrido, como fuerza por nodo (Bullet integra fuerza / masa). */
  soplar(t: number, aireZ: number, aireX: number, f: any) {
    const rafaga = Math.max(0, Math.sin(t * 0.43) * 0.6 + Math.sin(t * 0.9 + 2.1) * 0.4) ** 2;
    for (let i = MX; i < this.n; i++) {
      const fila = Math.floor(i / MX) / (MY - 1);
      const az = (BRISA * (0.6 + 0.4 * Math.sin(t * 0.8)) + RAFAGA * rafaga + aireZ * AIRE_RECORRIDO) * fila;
      f.setValue(aireX * fila * this.masaNodo, 0, az * this.masaNodo);
      this.sb.addForce(f, i);
    }
  }

  /** La mayor altura de la tela, para saber si ya cayó fuera de la vista. */
  techo() {
    let y = -Infinity;
    for (let i = 0; i < this.n; i += MX) y = Math.max(y, this.nodos.at(i).get_m_x().y());
    return y;
  }

  leer() {
    for (let i = 0; i < this.n; i++) {
      const p = this.nodos.at(i).get_m_x();
      this.local[i * 3] = p.x() - this.x;
      this.local[i * 3 + 1] = p.y();
      this.local[i * 3 + 2] = p.z();
    }
    this.geom.attributes.position!.needsUpdate = true;
    this.geom.computeVertexNormals();
  }
}


/* ─── La escena ─── */

export async function crearTelas(o: OpcionesTelas): Promise<MotorTelas> {
  const A = await cargarAmmo();
  const N = o.telas.length;
  const TOTAL = N * PASO_X;

  const config = new A.btSoftBodyRigidBodyCollisionConfiguration();
  const mundo = new A.btSoftRigidDynamicsWorld(
    new A.btCollisionDispatcher(config),
    new A.btDbvtBroadphase(),
    new A.btSequentialImpulseConstraintSolver(),
    config,
    new A.btDefaultSoftBodySolver(),
  );
  const g = new A.btVector3(0, -9.81, 0);
  mundo.setGravity(g);
  mundo.getWorldInfo().set_m_gravity(g);
  const fuerza = new A.btVector3(0, 0, 0);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  // Siempre a doble resolución, aunque la pantalla sea 1x: el navegador la
  // achica y los bordes casi horizontales dejan de escalonarse.
  renderer.setPixelRatio(2);
  const anisotropia = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  o.contenedor.appendChild(canvas);

  const escena = new Scene();
  const camara = new PerspectiveCamera(30, 1, 0.1, 50);
  const hilo = new Mesh(new BoxGeometry(60, 0.0035, 0.0035), new MeshBasicMaterial({ color: new Color(0.03, 0.03, 0.03) }));
  hilo.position.y = HILO_Y + 0.012;
  escena.add(hilo);
  // Las luces son sólo para los broches (las telas usan su propio shader).
  escena.add(new HemisphereLight(0xffffff, 0x1a1a1a, 1.5));
  const sol = new DirectionalLight(0xffffff, 2.4);
  sol.position.set(-1, 2, 3);
  escena.add(sol);

  /*
   * EL BROCHE: un clip de oficina visto de frente. Un cuerpo de metal oscuro
   * que muerde el borde de la tela, con un filo claro arriba, y dos asas de
   * alambre que rodean el hilo. Lleva un halo aditivo detrás, apagado salvo
   * cuando se ilumina.
   */
  const geoCuerpo = new BoxGeometry(0.056, 0.03, 0.014);
  const geoFilo = new BoxGeometry(0.056, 0.005, 0.016);
  const geoAsa = new TorusGeometry(0.008, 0.0016, 6, 18, Math.PI);
  const matFilo = new MeshStandardMaterial({ color: 0x9a9a9a, metalness: 0.3, roughness: 0.35 });
  const matAsa = new MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.35, roughness: 0.3 });
  const lienzoHalo = document.createElement("canvas");
  lienzoHalo.width = lienzoHalo.height = 64;
  const ctxHalo = lienzoHalo.getContext("2d")!;
  const gradiente = ctxHalo.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradiente.addColorStop(0, "rgba(255,255,255,0.9)");
  gradiente.addColorStop(0.35, "rgba(255,255,255,0.25)");
  gradiente.addColorStop(1, "rgba(255,255,255,0)");
  ctxHalo.fillStyle = gradiente;
  ctxHalo.fillRect(0, 0, 64, 64);
  const texturaHalo = new CanvasTexture(lienzoHalo);
  const crearBroche = (): PiezaBroche => {
    const grupo = new Group();
    const cuerpo = new MeshStandardMaterial({ color: 0x3c3c3c, metalness: 0.3, roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0 });
    const c = new Mesh(geoCuerpo, cuerpo);
    c.position.y = -0.013;
    const filo = new Mesh(geoFilo, matFilo);
    filo.position.y = 0.0005;
    grupo.add(c, filo);
    for (const lado of [-1, 1]) {
      const asa = new Mesh(geoAsa, matAsa);
      asa.position.set(lado * 0.014, 0.002, 0);
      grupo.add(asa);
    }
    const halo = new SpriteMaterial({ map: texturaHalo, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 });
    const s = new Sprite(halo);
    s.scale.setScalar(0.13);
    s.position.set(0, -0.008, 0.02);
    grupo.add(s);
    return { grupo, cuerpo, halo };
  };

  const cargador = new TextureLoader();
  const margen = new Vector2(0, 0);
  const posicion = (k: number, recorrido: number) => modulo(k * PASO_X - recorrido + TOTAL / 2, TOTAL) - TOTAL / 2;

  const telas = o.telas.map((d, k) => {
    const material = new ShaderMaterial({
      vertexShader: VERTICE,
      fragmentShader: FRAGMENTO,
      side: DoubleSide,
      uniforms: {
        uMapa: { value: new Texture() },
        uLuz: { value: 0 },
        uListo: { value: 0 },
        uAcento: { value: rgbDe(d.acento) },
        uMargen: { value: margen },
      },
    });
    const tela = new TelaAmmo(A, mundo, material, crearBroche, posicion(k, 0));
    escena.add(tela.grupo);
    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "none";
    let textura: VideoTexture | null = null;
    const estado = { tela, material, video, d, luz: 0, enMarcha: false, aparece: 1, cargado: false };
    video.addEventListener("playing", () => {
      if (!textura) {
        textura = new VideoTexture(video);
        textura.colorSpace = SRGBColorSpace;
        // Con mipmaps y anisotropía: achicado, el video no titila en las líneas finas.
        textura.minFilter = LinearMipmapLinearFilter;
        textura.generateMipmaps = true;
        textura.anisotropy = anisotropia;
      }
      material.uniforms.uMapa!.value = textura;
      estado.cargado = true;
    });
    cargador.load(d.poster, (t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = anisotropia;
      if (!textura) material.uniforms.uMapa!.value = t;
      estado.cargado = true;
    });
    return estado;
  });


  /* ─── Estado ─── */
  let recorrido = 0, velocidad = 0, destino = 0, actual = -1;
  let ancho = 1, alto = 1, mundoPorPixel = 0.003;
  const puntero = new Vector2();
  const mira = new Vector2();
  const rayo = new Raycaster();
  const plano = new Plane(new Vector3(0, 0, 1), 0);
  const punto = new Vector3();
  let ultimoGesto = performance.now();
  let visible = true;
  let cuadro = 0;
  let previo = performance.now();
  let acumulado = 0;
  let reloj = 0;
  let listo = false;

  /** Lo que hace el puntero apretado: deslizar el hilo, o agarrar una tela. */
  type Gesto =
    | { tipo: "deslizar"; x0: number; r0: number; ultimoX: number; ultimoT: number; v: number; movio: boolean; t0: number; tela: number }
    | {
        tipo: "agarrar";
        tela: number;
        /** Dónde estaba la tela al agarrarla: para medir la tensión con cada broche. */
        xTela: number;
        origen: Vector3;
        destino: Vector3;
        plano: Plane;
        nodos: number[];
        pesos: number[];
        offs: number[];
        x0: number;
        y0: number;
        movio: boolean;
        t0: number;
      };
  let gesto: Gesto | null = null;
  let roce: { tela: number; p: Vector3; fuerza: number } | null = null;
  let sobreBroche: [number, number] | null = null;
  let ultimoMovimiento = { x: 0, y: 0, t: performance.now() };

  const ajustar = () => {
    const r = o.contenedor.getBoundingClientRect();
    ancho = Math.max(1, r.width);
    alto = Math.max(1, r.height);
    renderer.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    const parte = ancho < 700 ? 0.72 : ancho < 1100 ? 0.5 : 0.34;
    const tan = Math.tan((camara.fov * Math.PI) / 360);
    const d = Math.max(ANCHO / parte / (2 * tan * camara.aspect), (ALTO + 0.24) / (2 * tan));
    camara.position.z = d;
    camara.updateProjectionMatrix();
    mundoPorPixel = (2 * d * tan) / alto;
  };
  ajustar();
  const ro = new ResizeObserver(ajustar);
  ro.observe(o.contenedor);

  const aNdc = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    puntero.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    rayo.setFromCamera(puntero, camara);
  };

  /** La tela bajo el puntero (sobre el plano del hilo) y el punto tocado. */
  const telaEn = (): number => {
    if (!rayo.ray.intersectPlane(plano, punto)) return -1;
    for (let k = 0; k < N; k++) {
      const t = telas[k]!.tela;
      if (t.todosSueltos) continue;
      if (Math.abs(punto.x - t.x) < ANCHO / 2 && punto.y < HILO_Y && punto.y > HILO_Y - ALTO) return k;
    }
    return -1;
  };

  /** El broche bajo el puntero: a menos de 18 px de su proyección en pantalla. */
  const brocheEn = (e: PointerEvent): [number, number] | null => {
    const r = canvas.getBoundingClientRect();
    const v = new Vector3();
    for (let k = 0; k < N; k++) {
      const t = telas[k]!.tela;
      if (Math.abs(t.x) > 3) continue;
      for (let j = 0; j < t.broches.length; j++) {
        const b = t.broches[j]!;
        if (b.suelto) continue;
        b.grupo.getWorldPosition(v).project(camara);
        const sx = r.left + ((v.x + 1) / 2) * r.width;
        const sy = r.top + ((1 - v.y) / 2) * r.height;
        if (Math.hypot(sx - e.clientX, sy - e.clientY) < 26) return [k, j];
      }
    }
    return null;
  };

  const empezarAgarre = (k: number, e: PointerEvent): Gesto | null => {
    const t = telas[k]!.tela;
    const nodos: number[] = [], pesos: number[] = [], offs: number[] = [];
    for (let i = 0; i < t.n; i++) {
      const p = t.nodos.at(i).get_m_x();
      const dx = p.x() - punto.x, dy = p.y() - punto.y, dz = p.z() - punto.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > AGARRE_RADIO) continue;
      const s = 1 - d / AGARRE_RADIO;
      nodos.push(i);
      pesos.push(s * s * (3 - 2 * s));
      offs.push(dx, dy, dz);
    }
    if (!nodos.length) return null;
    const normal = rayo.ray.direction.clone().negate();
    return {
      tipo: "agarrar",
      tela: k,
      xTela: t.x,
      origen: punto.clone(),
      destino: punto.clone(),
      plano: new Plane().setFromNormalAndCoplanarPoint(normal, punto),
      nodos,
      pesos,
      offs,
      x0: e.clientX,
      y0: e.clientY,
      movio: false,
      t0: performance.now(),
    };
  };

  const alBajar = (e: PointerEvent) => {
    if (e.button !== 0) return;
    ultimoGesto = performance.now();
    aNdc(e);
    canvas.setPointerCapture(e.pointerId);
    const b = brocheEn(e);
    if (b) {
      telas[b[0]]!.tela.soltar(b[1]);
      return;
    }
    const tocadaK = telaEn();
    if (tocadaK >= 0) telas[tocadaK]!.tela.tocada = performance.now();
    const k = telaEn();
    // Con el mouse, apretar sobre la tela la agarra; con el dedo, el gesto
    // horizontal sigue siendo deslizar (la tela ocupa casi todo el ancho).
    if (k >= 0 && e.pointerType === "mouse") gesto = empezarAgarre(k, e);
    gesto ??= { tipo: "deslizar", x0: e.clientX, r0: recorrido, ultimoX: e.clientX, ultimoT: performance.now(), v: 0, movio: false, t0: performance.now(), tela: k };
    canvas.style.cursor = "grabbing";
  };

  const alMover = (e: PointerEvent) => {
    ultimoGesto = performance.now();
    aNdc(e);
    const ahora = performance.now();
    const rapidez = Math.hypot(e.clientX - ultimoMovimiento.x, e.clientY - ultimoMovimiento.y) / Math.max(1, ahora - ultimoMovimiento.t);
    ultimoMovimiento = { x: e.clientX, y: e.clientY, t: ahora };

    if (gesto?.tipo === "agarrar") {
      if (Math.hypot(e.clientX - gesto.x0, e.clientY - gesto.y0) > 6) gesto.movio = true;
      const p = new Vector3();
      if (rayo.ray.intersectPlane(gesto.plano, p)) {
        // Tope suave: cuanto más lejos, menos sigue (tanh), y se acerca a quien mira.
        const d = p.sub(gesto.origen);
        const l = d.length();
        if (l > 1e-6) d.multiplyScalar((AGARRE_TOPE * Math.tanh(l / AGARRE_TOPE)) / l);
        d.add(gesto.origen);
        d.z += Math.min(0.4, l * 0.35);
        gesto.destino.copy(d);
      }
      return;
    }
    if (gesto?.tipo === "deslizar") {
      const dx = e.clientX - gesto.x0;
      if (Math.abs(dx) > 6) gesto.movio = true;
      recorrido = gesto.r0 - dx * mundoPorPixel;
      const dt = Math.max(1, ahora - gesto.ultimoT) / 1000;
      gesto.v = gesto.v * 0.6 + ((-(e.clientX - gesto.ultimoX) * mundoPorPixel) / dt) * 0.4;
      gesto.ultimoX = e.clientX;
      gesto.ultimoT = ahora;
      velocidad = gesto.v;
      return;
    }
    if (e.pointerType !== "mouse") return;
    sobreBroche = brocheEn(e);
    if (sobreBroche) {
      canvas.style.cursor = "pointer";
      roce = null;
      return;
    }
    const k = telaEn();
    canvas.style.cursor = k >= 0 ? "grab" : "ew-resize";
    roce = k >= 0 ? { tela: k, p: punto.clone(), fuerza: Math.min(1, rapidez / 1.2) } : null;
  };

  const alSoltar = (e: PointerEvent) => {
    canvas.releasePointerCapture?.(e.pointerId);
    const gs = gesto;
    gesto = null;
    canvas.style.cursor = "grab";
    if (!gs) return;
    const clic = !gs.movio && performance.now() - gs.t0 < 400;
    if (clic) {
      const k = gs.tela;
      // La tela del centro no abre el video al tocarla: es para jugar con
      // ella (el video se abre con el botón de abajo). Una de costado se trae.
      if (k >= 0 && modulo(k, N) !== actual) irA(k);
      return;
    }
    if (gs.tipo === "deslizar") {
      destino = Math.round((recorrido + gs.v * 0.28) / PASO_X) * PASO_X;
      velocidad = gs.v;
    }
  };

  const alSalir = () => {
    roce = null;
    sobreBroche = null;
  };

  /*
   * EL TRACKPAD: deslizar con dos dedos de costado mueve el hilo. El gesto
   * vertical se deja pasar (es el scroll de la página). Al terminar, se
   * acomoda en la tela más cercana.
   */
  let finRueda = 0;
  const alRueda = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 1) return;
    e.preventDefault();
    ultimoGesto = performance.now();
    destino += e.deltaX * mundoPorPixel;
    window.clearTimeout(finRueda);
    finRueda = window.setTimeout(() => {
      destino = Math.round(destino / PASO_X) * PASO_X;
    }, 140);
  };
  canvas.addEventListener("wheel", alRueda, { passive: false });

  canvas.addEventListener("pointerdown", alBajar);
  canvas.addEventListener("pointermove", alMover);
  canvas.addEventListener("pointerup", alSoltar);
  canvas.addEventListener("pointercancel", alSoltar);
  canvas.addEventListener("pointerleave", alSalir);
  canvas.style.touchAction = "pan-y";
  canvas.style.cursor = "grab";

  // Sin respuesta al scroll de la página (la versión Verlet la tiene): el
  // scroll llegaba justo cuando las telas aparecían, y las mostraba torcidas.

  const irA = (k: number) => {
    const base = Math.round(destino / PASO_X);
    let dif = modulo(k - modulo(base, N), N);
    if (dif > N / 2) dif -= N;
    destino = (base + dif) * PASO_X;
    ultimoGesto = performance.now();
  };

  /* ─── El bucle ─── */
  const io = new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting;
    if (visible) arrancar();
  });
  io.observe(o.contenedor);
  const alVisibilidad = () => {
    if (!document.hidden) arrancar();
  };
  document.addEventListener("visibilitychange", alVisibilidad);
  const arrancar = () => {
    if (cuadro) return;
    previo = performance.now();
    cuadro = requestAnimationFrame(bucle);
  };

  const bucle = (ahora: number) => {
    cuadro = 0;
    if (!visible || document.hidden) {
      for (const t of telas) if (t.enMarcha) (t.video.pause(), (t.enMarcha = false));
      return;
    }
    const dt = Math.min(0.05, (ahora - previo) / 1000);
    previo = ahora;
    acumulado += dt;

    let pasos = 0;
    while (acumulado >= DT && pasos < 3) {
      acumulado -= DT;
      pasos++;
      reloj += DT;
      if (gesto?.tipo !== "deslizar") {
        const a = RESORTE * (destino - recorrido) - FRENO * velocidad;
        velocidad = Math.max(-VELOCIDAD_MAXIMA, Math.min(VELOCIDAD_MAXIMA, velocidad + a * DT));
        recorrido += velocidad * DT;
      }
      const aireZ = Math.max(-AIRE_MAXIMO, Math.min(AIRE_MAXIMO, -velocidad * AIRE));

      const alcance = camara.position.z * Math.tan((camara.fov * Math.PI) / 360) * camara.aspect + ANCHO / 2 + 0.5;
      for (let k = 0; k < N; k++) {
        const t = telas[k]!.tela;
        const x = posicion(k, recorrido);
        t.activar(Math.abs(x) < alcance, mundo);
        t.mover(x);
        if (!t.activa) continue;
        t.soplar(reloj + k * 7.31, aireZ, -velocidad * 0.2, fuerza);
        if (!(gesto?.tipo === "agarrar" && gesto.tela === k)) t.recuperar();
      }

      // Agarrar: cada nodo de la zona va hacia el puntero, con su peso.
      if (gesto?.tipo === "agarrar") {
        const t = telas[gesto.tela]!.tela;
        t.tocada = performance.now();
        // La tensión: el broche que queda demasiado lejos del tirón, cede.
        const g = gesto;
        const dxCol = ANCHO / (MX - 1);
        t.broches.forEach((b, j) => {
          if (b.suelto) return;
          const bx = -ANCHO / 2 + b.col * dxCol;
          const reposo = Math.hypot(bx - (g.origen.x - g.xTela), HILO_Y - g.origen.y, g.origen.z);
          const ahoraD = Math.hypot(bx + t.x - g.destino.x, HILO_Y - g.destino.y, g.destino.z);
          if (ahoraD - reposo > TENSION) t.soltar(j);
        });
        for (let j = 0; j < gesto.nodos.length; j++) {
          const nd = t.nodos.at(gesto.nodos[j]!);
          const p = nd.get_m_x();
          const w = gesto.pesos[j]!;
          const tx = gesto.destino.x + gesto.offs[j * 3]!;
          const ty = gesto.destino.y + gesto.offs[j * 3 + 1]!;
          const tz = gesto.destino.z + gesto.offs[j * 3 + 2]!;
          const vel = nd.get_m_v();
          vel.setValue(
            vel.x() + ((tx - p.x()) * AGARRE_RIGIDEZ - vel.x()) * w,
            vel.y() + ((ty - p.y()) * AGARRE_RIGIDEZ - vel.y()) * w,
            vel.z() + ((tz - p.z()) * AGARRE_RIGIDEZ - vel.z()) * w,
          );
        }
      }

      // El roce: el puntero que pasa empuja la tela hacia adentro.
      if (roce && roce.fuerza > 0.02) {
        const t = telas[roce.tela]!.tela;
        for (let i = MX; i < t.n; i++) {
          const nd = t.nodos.at(i);
          const p = nd.get_m_x();
          const d = Math.hypot(p.x() - roce.p.x, p.y() - roce.p.y);
          if (d > ROCE_RADIO) continue;
          const s = 1 - d / ROCE_RADIO;
          const vel = nd.get_m_v();
          vel.setZ(vel.z() - ROCE * roce.fuerza * s * s);
        }
        roce.fuerza *= 0.8;
      }

      mundo.stepSimulation(DT, 1, DT);
    }
    if (acumulado > DT * 3) acumulado = 0;

    // Los broches sueltos de una tela que nadie toca hace rato vuelven a engancharse.
    for (const t of telas) {
      const tl = t.tela;
      const agarrada = gesto?.tipo === "agarrar" && telas[gesto.tela] === t;
      if (tl.activa && !agarrada && !tl.todosSueltos && tl.broches.some((b) => b.suelto) && ahora - tl.tocada > REENGANCHE_ESPERA) tl.reenganchar();
    }

    // Las caídas: fuera de la vista, se recuelga (y aparece de a poco).
    for (const t of telas) {
      if (t.tela.todosSueltos && t.tela.techo() < -2.2) {
        t.tela.fuera += dt;
        if (t.tela.fuera > 0.8) {
          t.tela.recolgar();
          t.aparece = 0;
        }
      }
      t.aparece = Math.min(1, t.aparece + dt * 1.6);
    }

    const elegida = modulo(Math.round((gesto?.tipo === "deslizar" ? recorrido : destino) / PASO_X), N);
    if (elegida !== actual) {
      actual = elegida;
      o.alCambiar(actual);
    }

    const mitad = camara.position.z * Math.tan((camara.fov * Math.PI) / 360) * camara.aspect + ANCHO / 2;
    for (let k = 0; k < N; k++) {
      const t = telas[k]!;
      t.luz += ((k === actual ? 1 : 0) - t.luz) * 0.08;
      t.material.uniforms.uLuz!.value = t.luz;
      t.material.uniforms.uListo!.value = t.cargado ? t.aparece : 0;
      const seVe = Math.abs(t.tela.x) < mitad;
      if (seVe && t.tela.activa) t.tela.leer();
      const corre = seVe && k === actual;
      if (corre && !t.enMarcha) {
        if (!t.video.src) t.video.src = t.d.video;
        t.video.play().catch(() => {});
        t.enMarcha = true;
      } else if (!corre && t.enMarcha) {
        t.video.pause();
        t.enMarcha = false;
      }
    }

    /*
     * LOS BROCHES LLAMAN LA ATENCION sin gritar: cada seis segundos un destello
     * recorre el hilo de izquierda a derecha y los va encendiendo al pasar. El
     * que está bajo el puntero se enciende del todo y crece.
     */
    const ciclo = reloj % DESTELLO_CADA;
    const anchoVisto = mitad - ANCHO / 2 + 0.6;
    const barrido = ciclo < DESTELLO_DURA ? -anchoVisto + (ciclo / DESTELLO_DURA) * anchoVisto * 2 : Infinity;
    for (let k = 0; k < N; k++) {
      const tl = telas[k]!.tela;
      tl.broches.forEach((b, j) => {
        const encima = sobreBroche && sobreBroche[0] === k && sobreBroche[1] === j ? 1 : 0;
        const xb = tl.x - ANCHO / 2 + (b.col * ANCHO) / (MX - 1);
        const destello = b.suelto ? 0 : 0.6 * Math.exp(-((xb - barrido) ** 2) / (2 * 0.32 * 0.32));
        const meta = b.suelto ? 0 : Math.max(encima, destello);
        b.luz += (meta - b.luz) * (meta > b.luz ? 0.35 : 0.12);
        b.cuerpo.emissiveIntensity = b.luz * 0.85;
        b.halo.opacity = b.luz * 0.6;
        b.grupo.scale.setScalar(1 + encima * b.luz * 0.3);
      });
    }

    mira.x += (puntero.x - mira.x) * 0.04;
    mira.y += (puntero.y - mira.y) * 0.04;
    camara.position.x = mira.x * 0.1;
    camara.position.y = 0.07 + mira.y * 0.05;
    camara.lookAt(0, 0.07, 0);

    renderer.render(escena, camara);
    if (!listo) {
      listo = true;
      o.alListo();
    }
    cuadro = requestAnimationFrame(bucle);
  };
  arrancar();

  return {
    ir: irA,
    destruir() {
      cancelAnimationFrame(cuadro);
      io.disconnect();
      ro.disconnect();
      window.clearTimeout(finRueda);
      document.removeEventListener("visibilitychange", alVisibilidad);
      for (const t of telas) {
        t.video.pause();
        t.video.removeAttribute("src");
        t.video.load();
        if (t.tela.activa) mundo.removeSoftBody(t.tela.sb);
        A.destroy(t.tela.sb);
        t.tela.geom.dispose();
        t.material.dispose();
        (t.material.uniforms.uMapa!.value as Texture).dispose();
      }
      renderer.dispose();
      canvas.remove();
    },
  };
}
