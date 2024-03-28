import { Component, NO_ERRORS_SCHEMA, inject, NgZone } from "@angular/core";
import { Application, Page } from "@nativescript/core";
import { Canvas, CanvasRenderingContext2D } from "@nativescript/canvas";
import { registerElement } from "@nativescript/angular";
import { time } from "@nativescript/core/profiling";
registerElement("Canvas", () => Canvas);

class Circle {
  x: number;
  y: number;
  radius: any;
  angle: number;
  firstColor: string;
  secondColor: string;

  constructor({ width, height, minRadius, maxRadius }) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * (maxRadius - minRadius) + minRadius;
    this.angle = Math.random() * 2 * Math.PI;
    this.firstColor = `hsla(${Math.random() * 220 + 140}, 70%, 60%, 1)`;
    this.secondColor = `hsla(${Math.random() * 220 + 140}, 70%, 60%, 0)`;

    // this.firstColor = `hsla(${
    //   Math.random() * 360
    // }, 100%, 50%, ${Math.random()})`;
    // this.secondColor = `hsla(${Math.random() * 360}, 100%, 50%, 0)`;
  }

  draw(context, speed) {
    this.angle += speed;

    const x = this.x + Math.cos(this.angle) * 200;
    const y = this.y + Math.sin(this.angle) * 200;

    // const gradient = context.createRadialGradient(x, y, 0, x, y, this.radius);
    // gradient.addColorStop(0, this.firstColor);
    // gradient.addColorStop(1, this.secondColor);
    // context.globalCompositeOperation = 'destination-over';

    context.fillStyle = this.firstColor;
    context.beginPath();
    context.arc(x, y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
}

@Component({
  selector: "ns-canvas",
  template: `
    <GridLayout>
      <Canvas backgroundColor="white" (ready)="onCanvasReady($event)"></Canvas>
    </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class CirclesComponent {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  _page: Page = inject(Page);
  _zone: NgZone = inject(NgZone);

  circles = [];
  circlesNum = 1200;
  minRadius = 100;
  maxRadius = 1200;
  speed = 0.01;

  constructor() {
    this._page.actionBarHidden = true;

    Application.on(Application.orientationChangedEvent, () => {
      this.circles.forEach((circle) => {
        if (this.canvas) {
          circle.width = Number(this.canvas.width);
          circle.height = Number(this.canvas.height);
        }
      });
    });
  }

  onCanvasReady(args) {
    this.canvas = args?.object as Canvas;
    this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;

    this.minRadius =
      Math.min(Number(this.canvas.width), Number(this.canvas.height)) * 0.05;
    this.maxRadius =
      Math.max(Number(this.canvas.width), Number(this.canvas.height)) * 0.1;

    for (let i = 0; i < this.circlesNum; i++) {
      this.circles.push(
        new Circle({
          width: Number(this.canvas.width),
          height: Number(this.canvas.height),
          minRadius: this.minRadius,
          maxRadius: this.maxRadius,
        })
      );
    }

    this.drawAnimation();
    // this._zone.runOutsideAngular(() => {
    //  this.drawAnimation();
    // });
  }

  drawAnimation() {
    this.ctx.clearRect(
      0,
      0,
      Number(this.canvas.width),
      Number(this.canvas.height)
    );
    
    this.circles.forEach((circle) => circle.draw(this.ctx, this.speed));

    requestAnimationFrame(() => this.drawAnimation());
  }
}
