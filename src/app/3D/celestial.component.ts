import { Component, NO_ERRORS_SCHEMA, NgZone, inject } from "@angular/core";
import { registerElement } from "@nativescript/angular";
import { Canvas, WebGL2RenderingContext } from "@nativescript/canvas";
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  TextureLoader,
  ExtrudeGeometry,
  MeshPhysicalMaterial,
  Mesh,
  Fog,
  AmbientLight,
  HemisphereLight,
  Shape,
  Vector3,
  RepeatWrapping,
  BufferGeometry,
  SphereGeometry,
  Color as ThreeColor,
  CatmullRomCurve3,
  DirectionalLight,
  PointLight,
  Object3D,
  FogExp2,
} from "three";
import { ModifierStack, Taper, Twist } from "three.modifiers";
import { Page } from "@nativescript/core";
import { Noise } from "noisejs";

var noise = new Noise(Math.random());
registerElement("Canvas", () => Canvas);

const lights = [
  {
    light: null,
    type: "directional",
    color: 0xffffff,
    intensity: 0.5,
    distance: 1000,
    position: { x: 4, y: 4, z: 5 },
    target: { x: 3, y: 2, z: 5 },
  },
  {
    light: null,
    type: "directional",
    color: 0xffffff,
    intensity: 3,
    distance: 1000,
    position: { x: 0, y: 2, z: 0 },
    target: { x: 0, y: -4, z: 5 },
  },
];

const circles = [
  {
    delta: null,
    mesh: null,
    speed: 0.021,
    radius: 0.8,
    color: 0xff6622,
    position: { x: 4, y: 2, z: 9 },
  },
  {
    delta: null,
    mesh: null,
    speed: 0.015,
    radius: 0.5,
    color: 0xff9900,
    position: { x: 4, y: 2, z: 10.5 },
  },
  {
    delta: null,
    mesh: null,
    speed: 0.022,
    radius: 0.7,
    color: 0xff7700,
    position: { x: 2, y: -1, z: 3.5 },
  },
  {
    delta: null,
    mesh: null,
    speed: 0.02,
    radius: 0.8,
    color: 0xee5522,
    position: { x: 2, y: 4, z: 4 },
  },
  {
    delta: null,
    mesh: null,
    speed: 0.005,
    radius: 2.5,
    color: 0x33eeff,
    position: { x: -2, y: 2, z: 9 },
  },
  {
    delta: null,
    mesh: null,
    speed: 0.01,
    radius: 0.8,
    color: 0x5a00ff,
    position: { x: 5, y: -1, z: 9 },
  },
];

@Component({
  selector: "ns-celestial",
  template: `
    <GridLayout class="container" backgroundColor="black">
      <Canvas (ready)="onCanvasReady($event)"></Canvas>
    </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class CelestialComponent {
  canvas: Canvas;
  ctx: WebGL2RenderingContext;
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  delta = 0;
  mstack: any;
  cube: Mesh;

  _page = inject(Page);
  _zone = inject(NgZone);

  constructor() {
    this._page.actionBarHidden = true;
  }

  onCanvasReady(args) {
    this.canvas = args?.object as Canvas;
    this.ctx = this.canvas?.getContext("webgl2") as WebGL2RenderingContext;

    const width = this.ctx.drawingBufferWidth;
    const height = this.ctx.drawingBufferHeight;

    this.scene = new Scene();
    this.scene.fog = new Fog(0x142641, 10, 31);

    // Setup camera
    this.camera = new PerspectiveCamera(35, width / height, 0.1, 1000);
    this.camera.position.x = 22;
    this.camera.position.z = -5;

    // Setup renderer
    this.renderer = new WebGLRenderer({
      context: this.ctx as any,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;

    const ambientLight = new AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    const skyLight = new HemisphereLight(0xffffff, 0x000000, 1);
    skyLight.position.set(0, -1, 4);
    this.scene.add(skyLight);

    const skyLight2 = new HemisphereLight(0xffffff, 0xff0000, 1.2);
    skyLight2.position.set(0, -1, 4);
    this.scene.add(skyLight2);

    const shape = new Shape();
    let r = 1;
    let num = 80;
    for (let i = 0; i < num; i++) {
      r = i % 2 === 0 ? 1 : 0.5;
      const angle = (i * 2 * Math.PI) / num;
      const x = r * Math.cos(angle) * r;
      const y = r * Math.sin(angle) * r;
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }

    const extrudeSettings = {
      steps: 160,
      depth: 20,
      bevelEnabled: false,
      bevelThickness: 1,
      bevelSize: 1,
      bevelSegments: 1,
      extrudePath: new CatmullRomCurve3([
        new Vector3(0, 0, 0),
        new Vector3(0, 1, 5),
        new Vector3(0, -1, 7),
        new Vector3(0, 0, 15),
        new Vector3(0, 0, 20),
      ]),
    };

    // const texture = TextureLoader().load("textures/texture.jpg");
    // texture.wrapS = RepeatWrapping;
    // texture.wrapT = RepeatWrapping;
    // texture.repeat.set(0.1, 0.1);

    const geometry = new ExtrudeGeometry(shape, extrudeSettings);
    // this.saveOriginalPositions(geometry);
    const material = new MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: -2,
      roughness: 0,
      clearcoat: 0,
      reflectivity: 0,
      // map: texture,
    });
    this.cube = new Mesh(geometry, material);
    this.cube.castShadow = true;
    this.cube.receiveShadow = true;

    this.scene.add(this.cube);

    const target = this.cube.position.clone();
    target.z += 10;
    this.camera.lookAt(target);
    this.camera.rotation.z = 135 * (Math.PI / 180);

    this.updateLights();
    this.updateCircles();

    this.renderer.render(this.scene, this.camera);

    this.mstack = new ModifierStack(this.cube);
    console.log('?')

    // console.log("this.cube");
    // this.mstack = new ModifierStack(this.cube);
    // console.log("this.mstack");
    // const taper = new Taper(-1);
    // taper.power = 3;

    // console.log("taper");
    // const taper2 = new Taper(1);
    // taper2.power = 0.1;

    // const twist = new Twist();
    // twist.angle = 120 * (Math.PI / 180);
    // twist.vector = Vector3.Z();
    // // const noise = new MOD3.CPerlin(0.4, generate_noise2d(100, 100), true);

    // this.mstack.addModifier(taper);
    // this.mstack.addModifier(taper2);
    // this.mstack.addModifier(twist);
    // // this.mstack.addModifier(noise);
    // this.mstack.apply();

    // ... setting up THREE.js objects like lights, textures, geometry, materials ...

    // Animate
    this._zone.runOutsideAngular(() => {
      this.renderAnimation();
    });
  }

  originalPositions: Float32Array | null = null;

  // saveOriginalPositions(geometry: BufferGeometry): void {
  //   // Clone the original positions to ensure they don't get modified
  //   geometry.setAttribute(
  //     "originalPosition",
  //     geometry.attributes.position
  //   );
  // }

  // applyNoiseAndTaper(
  //   geometry: BufferGeometry,
  //   noiseIntensity: number,
  //   taperIntensity: number
  // ): void {
  //   const positions = geometry.attributes.position.array as Float32Array;
  //   const originalPositions = geometry.attributes.originalPosition
  //     .array as Float32Array;

  //   for (let i = 0; i < positions.length; i += 3) {
  //     const x = originalPositions[i];
  //     const y = originalPositions[i + 1];
  //     const z = originalPositions[i + 2];

  //     // Apply Noise
  //     const noiseValue = noise.simplex3(x + this.delta, y + this.delta, z);
  //     positions[i + 2] = z + noiseValue * noiseIntensity;

  //     // Apply Taper
  //     const taperFactor = (positions[i + 2] + 10) / 20; // Assuming range is -10 to 10 for z
  //     positions[i] = x * (1 + taperFactor * taperIntensity);
  //     positions[i + 1] = y * (1 + taperFactor * taperIntensity);
  //   }
  // }

  // applyModifications(
  //   geometry: BufferGeometry,
  //   noiseIntensity: number,
  //   taperIntensity: number,
  //   twistAngle: number
  // ): void {
  //   const positions = geometry.attributes.
  //   const originalPositions = geometry.attributes.originalPosition
  //     .array as Float32Array;

  //   for (let i = 0; i < positions.length; i += 3) {
  //     const x = originalPositions[i];
  //     const y = originalPositions[i + 1];
  //     const z = originalPositions[i + 2];

  //     // Apply Taper
  //     const taperFactor = (positions[i + 2] + 10) / 20; // Assuming range is -10 to 10 for z
  //     positions[i] = x * (1 + taperFactor * taperIntensity);
  //     positions[i + 1] = y * (1 + taperFactor * taperIntensity);

  //     // Apply Noise to X
  //     const noiseValue = noise.simplex3(x + this.delta, y + this.delta, z);
  //     // const noiseValue = noise.simplex3(x + this.delta, y, z);
  //     //positions[i] = positions[i] + (noiseValue * noiseIntensity);

  //     // Apply Twist
  //     const twistAmount = z / 20; // Assuming the object has a height of 20 units along the z-axis.
  //     const theta = twistAmount * twistAngle; // Calculating rotation angle for the vertex

  //     // Rotate around Z-axis
  //     const twistedX =
  //       positions[i] * Math.cos(theta) - positions[i + 1] * Math.sin(theta);
  //     const twistedY =
  //       positions[i] * Math.sin(theta) + positions[i + 1] * Math.cos(theta);

  //     positions[i] = twistedX;
  //     positions[i + 1] = twistedY;
  //   }
  // }

  updateLights() {
    for (let i = 0; i < lights.length; i++) {
      let light;
      if (!lights[i].light) {
        if (lights[i].type === "directional") {
          light = new DirectionalLight(lights[i].color, lights[i].intensity);
          light.castShadow = true;
          light.shadow.mapSize.width = 1024;
          light.shadow.mapSize.height = 1024;
          lights[i].light = light;
          this.scene.add(light);

          let target = new Object3D();
          target.position.set(
            lights[i].target.x,
            lights[i].target.y,
            lights[i].target.z
          );
          this.scene.add(target);
          light.target = target;
        } else {
          light = new PointLight(lights[i].color, 1, 100);
          lights[i].light = light;
          this.scene.add(light);
        }

        // if (showHelpers) {
        //   let lightHelper;

        //   if (lights[i].type === "directional") {
        //     lightHelper = new THREE.DirectionalLightHelper(light, 1);
        //   } else {
        //     lightHelper = new THREE.PointLightHelper(light, 1);
        //   }

        //   scene.add(lightHelper);
        //   lights[i].lightHelper = lightHelper;
        // }
      } else {
        light = lights[i].light;
      }

      light.intensity = lights[i].intensity;
      light.color.set(lights[i].color);

      light.position.set(
        lights[i].position.x,
        lights[i].position.y,
        lights[i].position.z
      );

      if (light.target) {
        light.target.position.set(
          lights[i].target.x,
          lights[i].target.y,
          lights[i].target.z
        );
      }
    }
  }

  updateCircles() {
    for (let i = 0; i < circles.length; i++) {
      let mesh;
      if (!circles[i].mesh) {
        const circle = new SphereGeometry(1, 32, 32);
        const material = new MeshPhysicalMaterial({
          color: circles[i].color,
          roughness: 1,
          metalness: 0,
        });
        mesh = new Mesh(circle, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        circles[i].mesh = mesh;
        this.scene.add(mesh);
        circles[i].delta = Math.random() * 10;
      } else {
        mesh = circles[i].mesh;
      }

      circles[i].delta += circles[i].speed;
      mesh.material.color = new ThreeColor(circles[i].color);
      mesh.scale.set(circles[i].radius, circles[i].radius, circles[i].radius);
      mesh.position.set(
        circles[i].position.x + Math.sin(circles[i].delta) * 0.3,
        circles[i].position.y + Math.cos(circles[i].delta) * 0.3,
        circles[i].position.z + Math.cos(circles[i].delta) * 0.3
      );
    }
  }

  applyTwist(vertices, angle, axis = "z") {
    for (let i = 0; i < vertices.length; i += 3) {
      let x = vertices[i];
      let y = vertices[i + 1];
      let z = vertices[i + 2];

      // Calculate the twist based on position along the given axis.
      let twistAmount = 0;
      if (axis === "z") {
        twistAmount = z;
      } else if (axis === "y") {
        twistAmount = y;
      } else if (axis === "x") {
        twistAmount = x;
      }

      // Calculate rotation angle for the vertex.
      let theta = twistAmount * angle;

      // Rotate around the axis.
      if (axis === "z") {
        let twistedX = x * Math.cos(theta) - y * Math.sin(theta);
        let twistedY = x * Math.sin(theta) + y * Math.cos(theta);
        vertices[i] = twistedX;
        vertices[i + 1] = twistedY;
      } else if (axis === "y") {
        let twistedX = x * Math.cos(theta) - z * Math.sin(theta);
        let twistedZ = x * Math.sin(theta) + z * Math.cos(theta);
        vertices[i] = twistedX;
        vertices[i + 2] = twistedZ;
      } else if (axis === "x") {
        let twistedY = y * Math.cos(theta) - z * Math.sin(theta);
        let twistedZ = y * Math.sin(theta) + z * Math.cos(theta);
        vertices[i + 1] = twistedY;
        vertices[i + 2] = twistedZ;
      }
    }
  }

  applyTaper(vertices, factor, maxScale, axis = "z") {
    for (let i = 0; i < vertices.length; i += 3) {
      let x = vertices[i];
      let y = vertices[i + 1];
      let z = vertices[i + 2];

      let scaleAmount = 1;
      if (axis === "z") {
        scaleAmount = 1 + factor * z;
      } else if (axis === "y") {
        scaleAmount = 1 + factor * y;
      } else if (axis === "x") {
        scaleAmount = 1 + factor * x;
      }

      scaleAmount = Math.max(Math.min(scaleAmount, maxScale), 1 / maxScale);

      vertices[i] *= scaleAmount;
      vertices[i + 1] *= scaleAmount;
      vertices[i + 2] *= scaleAmount;
    }
  }

  reverse = false;
  private renderAnimation = () => {
    if (this.delta > 3) this.reverse = true;
    if (this.delta < 0) this.reverse = false;
    if (this.reverse) this.delta -= 0.002;
    else {
      this.delta += 0.002;
    }

    //   texture.offset.set(delta, delta / 2);
    // this.mstack.apply();
    // this.applyNoiseAndTaper(this.cube.geometry, 1.1, 0.02);
    //   .array as Float32Array;
    // const vertices = this.cube.geometry.attributes.

    // this.applyTaper(vertices, -1, 3);
    // this.applyTaper(vertices, 1, 0.1);
    // this.applyTwist(vertices, 120 * (Math.PI / 180), 'z');

    const twistIntensity = 120 * (Math.PI / 180) * this.delta;
    // this.applyModifications(this.cube.geometry, 1.6, 0.2, twistIntensity);
    this.cube.geometry.attributes.position.needsUpdate = true;

    this.updateCircles();
    this.updateLights();

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.renderAnimation);
  };
}
