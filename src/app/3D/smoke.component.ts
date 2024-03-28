import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Canvas, WebGL2RenderingContext } from "@nativescript/canvas";
import { LoadEventData } from "@nativescript/core";
import { registerElement } from "@nativescript/angular";
import {
  BoxGeometry,
  DirectionalLight,
  ImageUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";

registerElement("Canvas", () => Canvas);

@Component({
  selector: "ns-smoke",
  template: `
    <GridLayout>
      <Canvas (ready)="onCanvasReady($event)"></Canvas>
    </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class SmokeComponent {
  private camera: PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private geometry: BoxGeometry;
  private material: MeshLambertMaterial;
  private mesh: Mesh;
  private smokeParticles: Mesh[] = [];
  cubeSineDriver: number;

  onCanvasReady(args: LoadEventData) {
    const canvas = args.object as Canvas;
    const ctx = canvas.getContext("webgl2") as WebGL2RenderingContext;
    if (!ctx) {
      return;
    }
    this.init(ctx);
  }

  init(ctx: WebGL2RenderingContext) {
    this.renderer = new WebGLRenderer({
      context: ctx as any,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.z = 1000;
    this.scene.add(this.camera);

    this.geometry = new BoxGeometry(200, 200, 200);
    this.material = new MeshLambertMaterial({
      color: 0xaa6666,
      wireframe: false,
    });
    this.mesh = new Mesh(this.geometry, this.material);
    //this.scene.add( mesh );
    this.cubeSineDriver = 0;

    const textGeo = new PlaneGeometry(300, 300);
    // ImageUtils.crossOrigin = ''; //Need this to pull in crossdomain images from AWS
    const textTexture = ImageUtils.loadTexture(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/quickText.png"
    );
    const textMaterial = new MeshLambertMaterial({
      color: 0x00ffff,
      opacity: 1,
      map: textTexture,
      transparent: true /*, blending: AdditiveBlending*/,
    });
    const text = new Mesh(textGeo, textMaterial);
    text.position.z = 800;
    this.scene.add(text);

    const light = new DirectionalLight(0xffffff, 0.5);
    light.position.set(-1, 0, 1);
    this.scene.add(light);

    const smokeTexture = ImageUtils.loadTexture(
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png"
    );
    const smokeMaterial = new MeshLambertMaterial({
      color: 0x00dddd,
      map: smokeTexture,
      transparent: true,
    });
    const smokeGeo = new PlaneGeometry(300, 300);
    this.smokeParticles = [];

    for (let p = 0; p < 150; p++) {
      var particle = new Mesh(smokeGeo, smokeMaterial);
      particle.position.set(
        Math.random() * 500 - 250,
        Math.random() * 500 - 250,
        Math.random() * 1000 - 100
      );
      particle.rotation.z = Math.random() * 360;
      this.scene.add(particle);
      this.smokeParticles.push(particle);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.evolveSmoke();
    this.render();
  }

  evolveSmoke() {
    var sp = this.smokeParticles.length;
    while (sp--) {
      this.smokeParticles[sp].rotation.z += 1 * 0.2;
    }
  }

  render() {
    this.mesh.rotation.x += 0.005;
    this.mesh.rotation.y += 0.01;
    this.cubeSineDriver += 0.01;
    this.mesh.position.z = 100 + Math.sin(this.cubeSineDriver) * 500;
    this.renderer.render(this.scene, this.camera);
  }
}
