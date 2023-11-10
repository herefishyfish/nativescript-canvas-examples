import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { registerElement } from "@nativescript/angular";
import { Canvas, WebGL2RenderingContext } from "@nativescript/canvas";
import {
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  PerspectiveCamera,
  SphereGeometry,
  MeshNormalMaterial,
  Mesh,
  Vector3,
} from "three";
import {Noise} from "noisejs";
import { Page } from "@nativescript/core";

declare var __time;

var noise = new Noise(Math.random());
registerElement("Canvas", () => Canvas);

declare const java: any;

@Component({
  selector: "ns-blob",
  template: `
    <ActionBar title="My Profile" class="bg-fleece text-zinc-800" flat="true">
      <ActionItem
        ios.systemIcon="20"
        ios.position="right"
        android.systemIcon="ic_menu"
        android.position="actionBar"
      ></ActionItem>
    </ActionBar>

    <GridLayout class="container bg-fleece">
      <Canvas (ready)="onCanvasReady($event)" rowSpan="3"></Canvas>

      <Label
        text="LABEL1"
        class="text-8xl text-center font-thin text-zinc-800"
        row="1"
        verticalAlignment="center"
        textWrap="true"
      ></Label>

      <Image
        row="2"
        width="100"
        horizontalAlignment="left"
        class="ml-16"
        src="https://uxwing.com/wp-content/themes/uxwing/download/arrow-direction/thin-long-arrow-right-icon.png"
      ></Image>
      <Label
        text="7  -  8"
        class="text-2xl rotate-90 font-light ml-20 text-zinc-800"
        row="2"
      ></Label>

      <StackLayout orientation="horizontal" class="ml-14">
        <StackLayout
          class="w-6 bg-zinc-800"
          height="2"
          verticalAlignment="center"
        ></StackLayout>
        <Label
          text="Illustration"
          class="text-base text-center font-light ml-1 text-zinc-800"
          verticalAlignment="center"
          row="1"
        ></Label>
      </StackLayout>
    </GridLayout>
  `,
  styles: [
    `
      .container {
        rows: 20*, 50*, 30*;
      }
    `,
  ],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class BlobComponent {
  canvas: Canvas;
  ctx: WebGL2RenderingContext;
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  size: number;
  width: number;
  height: number;
  sphere: Mesh<SphereGeometry, MeshNormalMaterial>;
  noise: Noise;
  vertex = new Vector3();
  vertexCount = 203;
  timeAg = 0.0005;

  constructor(private _page: Page) {
    this._page.actionBarHidden = true;
  }

  onWindowResize() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  onCanvasReady(args) {
    this.canvas = args?.object as Canvas;
    this.ctx = this.canvas?.getContext("webgl2") as WebGL2RenderingContext;

    this.width = this.ctx.drawingBufferWidth;
    this.height = this.ctx.drawingBufferHeight;

    this.scene = new Scene();

    this.renderer = new WebGLRenderer({
      context: this.ctx as any,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.outputEncoding = sRGBEncoding;

    this.camera = new PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    const sphere_geometry = new SphereGeometry(
      1,
      this.vertexCount,
      this.vertexCount
    );
    const material = new MeshNormalMaterial();

    this.sphere = new Mesh(sphere_geometry, material);
    this.scene.add(this.sphere);

    requestAnimationFrame(this.renderAnimation);

    // window.addEventListener("resize", this.onWindowResize);
  }

  renderAnimation = () => {
    this.sphere.rotation.y += 0.0005;
    this.sphere.rotation.x += 0.0001;

    const time = global.isAndroid
      ? __time() / 1000
      : performance.now() * this.timeAg;

    // change 'k' value for more spikes
    let k = 1.33;

    const positionAttribute: any =
      this.sphere.geometry.getAttribute("position");
    

    if (positionAttribute) {
      for (let i = 0; i < positionAttribute?.count; i++) {
        this.vertex.fromBufferAttribute(positionAttribute as any, i);
        this.vertex.normalize().multiplyScalar(
          0.6 + 0.3 * noise.perlin3(this.vertex.x * k + time, this.vertex.y * k, this.vertex.z * k)
        );

        positionAttribute.setXYZ(i, this.vertex.x, this.vertex.y, this.vertex.z);
      }
      positionAttribute.needsUpdate = true;
    }

    this.sphere.geometry.computeVertexNormals();

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.renderAnimation);
  };
}
