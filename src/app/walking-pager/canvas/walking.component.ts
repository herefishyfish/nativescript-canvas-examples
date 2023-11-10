import { Component, Input, NgZone, inject } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { Canvas, WebGL2RenderingContext } from '@nativescript/canvas';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from './DRACOLoader';

registerElement('Canvas', () => Canvas);

@Component({
  selector: 'app-walking',
  template: `
    <Canvas (ready)="onCanvasReady($event)"></Canvas>
  `,
  standalone: true,
  imports: [
  ],
})
export class WalkingComponent {
  private ngZone = inject(NgZone);
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private canvas: Canvas;

  /**
   * The position of the pager, a number between 0 and 3.
   * Each whole number represents a camera angle.
   */
  @Input() position: number;

  onCanvasReady(args: any) {
    console.log('onCanvasReady');
    
    this.canvas = args?.object as Canvas;
    const ctx = this.canvas?.getContext("webgl2") as WebGL2RenderingContext;

    this.initThreeJs(ctx);
  }

  private initThreeJs(ctx: WebGL2RenderingContext) {
    this.ngZone.runOutsideAngular(() => {
      this.renderer = new THREE.WebGLRenderer({
        context: ctx as any,
      });
      // this.renderer.setSize(window.innerWidth, window.innerHeight);
      console.log(window.innerHeight, window.innerWidth);

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 5;

      this.scene = new THREE.Scene();

      // 3d box
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

      const cube = new THREE.Mesh(geometry, material);
      // this.scene.add(cube);

      this.renderer.render(this.scene, this.camera);
      
      const loader = new GLTFLoader();
      loader.setDRACOLoader(new DRACOLoader());

      loader.load(
        './assets/walking3.glb',
        (gltf) => {
          this.scene.add(gltf.scene);
          this.animate();
        },
      );
    });
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}