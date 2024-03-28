import { Component, NO_ERRORS_SCHEMA, inject, NgZone } from '@angular/core';
import { Application, Page } from '@nativescript/core';
import { Canvas, CanvasRenderingContext2D } from '@nativescript/canvas';
import { registerElement } from '@nativescript/angular';
registerElement('Canvas', () => Canvas);

const easeInOutCubic = (t) => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};
const easeInCubic = (t) => t * t * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const mix = (progress, start, end) => start * (1 - progress) + end * progress;
const polarToCanvas = (theta, radius) => ({
  x: radius * Math.cos(theta),
  y: radius * Math.sin(theta),
});

class Circle {
  index: any;
  size: any;
  theta: number;
  color: string;
  constructor(index, size) {
    this.index = index;
    this.size = size;
    this.theta = (index * (2 * Math.PI)) / 6;
    this.color = ['#62BFA1', '#529CA0'][index % 2];
  }

  draw(ctx, progress, rotation) {
    const scale = mix(progress, 0.15, 1);
    const radius = this.size / 2;
    const opacity = mix(clamp(progress, 0.5, 1), 0, 1);
    const { x, y } = polarToCanvas(
      this.theta + rotation,
      (this.size * scale) / 2
    );
    const canvasX = ctx.canvas.width / 2 + x;
    const canvasY = ctx.canvas.height / 2 + y;

    let gradient = ctx.createRadialGradient(
      canvasX,
      canvasY,
      0,
      canvasX,
      canvasY,
      radius
    );
    gradient.addColorStop(0, '#62BFA1');
    gradient.addColorStop(1, '#529CA0');

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();
  }
}

class BreatheAnimation {
  ctx: any;
  size: any;
  speed: number;
  progress: number;
  goesDown: boolean;
  rotation: number;
  circles: Circle[];

  constructor(ctx, size, speed) {
    this.ctx = ctx;
    this.size = size;
    this.speed = speed;
    this.progress = 0;
    this.goesDown = false;
    this.rotation = 0;
    this.circles = [];

    for (let i = 0; i < 6; i++) {
      this.circles.push(new Circle(i, this.size));
    }
  }

  update() {
    const startScale = 0.15;
    const endScale = 1;
    const fullRotation = Math.PI * 1;
    
    if (this.goesDown) {
      this.progress -= this.speed;
      if (this.progress <= 0) {
        this.progress = 0;
        this.goesDown = false;
      }
    } else {
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.progress = 1;
        this.goesDown = true;
      }
    }
  
    const easedProgress = easeOutCubic(this.progress);
  
    const scale = mix(easedProgress, startScale, endScale);
    this.rotation = fullRotation * scale;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    // this.ctx.globalCompositeOperation = 'lighter';
    this.ctx.globalCompositeOperation = 'screen';

    const easedProgress = easeInOutCubic(this.progress);

    this.circles.forEach((circle) => {
      circle.draw(this.ctx, easedProgress, this.rotation);
    });

    this.update();
  }
}

@Component({
  selector: 'ns-canvas',
  template: `
  <GridLayout>
    <Canvas backgroundColor="#242a38" (ready)="onCanvasReady($event)"></Canvas>
  </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class BreatheComponent {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  _page: Page = inject(Page);
  _zone: NgZone = inject(NgZone);
  private animation!: BreatheAnimation;
  private requestId!: number;

  constructor() {
    this._page.actionBarHidden = true;
  }

  onCanvasReady(args) {
    this.canvas = args?.object as Canvas;
    this.ctx = this.canvas?.getContext('2d') as CanvasRenderingContext2D;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const size = Math.min(width, height) / 2.5;
    const speed = 0.0055;

    this.animation = new BreatheAnimation(this.ctx, size, speed);
    this.draw();
  }

  draw() {
    this.animation.draw();
    this.requestId = requestAnimationFrame(() => this.draw());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.requestId);
  }
}
