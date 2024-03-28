import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { registerElement } from "@nativescript/angular";
import { Canvas, CanvasRenderingContext2D } from "@nativescript/canvas";
registerElement("Canvas", () => Canvas);


class Star {
  private x: number;
  private y: number;
  private z: number;
  private pz: number;
  private width: number;
  private height: number;
  private speed: number;

  constructor(width: number, height: number, speed: number) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.x = this.random(-width / 2, width / 2);
    this.y = this.random(-height / 2, height / 2);
    this.z = this.random(0, width);
    this.pz = this.z;
  }

  update(): void {
    this.z = this.z - this.speed;
    if (this.z < 1) {
      this.z = this.width;
      this.x = this.random(-this.width / 2, this.width / 2);
      this.y = this.random(-this.height / 2, this.height / 2);
      this.pz = this.z;
    }
  }

  show(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'white';

    let sx = this.map(this.x / this.z, 0, 1, this.width / 2, this.width);
    let sy = this.map(this.y / this.z, 0, 1, this.height / 2, this.height);

    let r = this.map(this.z, 0, this.width, 16, 0);
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, 2 * Math.PI);
    ctx.fill();
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private map(value: number, low1: number, high1: number, low2: number, high2: number): number {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }
}

@Component({
  selector: "ns-canvas",
  template: `
    <GridLayout>
      <Canvas
        (ready)="onCanvasReady($event)"
      ></Canvas>
    </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class StarfieldComponent {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;
  private width;
  private height;
  private stars: Star[] = [];
  private speed = 2;
  private numberOfStars = 1000;

  onCanvasReady(args) {
    this.canvas = args?.object as Canvas;
    this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    for (let i = 0; i < this.numberOfStars; i++) {
      const star = new Star(this.width, this.height, this.speed);
      this.stars.push(star);
    }

    this.animate();
  }

  private animate(): void {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);
    for (let star of this.stars) {
      star.update();
      star.show(this.ctx);
    }
    requestAnimationFrame(this.animate.bind(this));
  }
}
