import { Component, NO_ERRORS_SCHEMA, inject, NgZone } from "@angular/core";
import { Application, Page } from "@nativescript/core";
import { Canvas, CanvasRenderingContext2D } from "@nativescript/canvas";
import { registerElement } from "@nativescript/angular";
registerElement("Canvas", () => Canvas);

@Component({
  selector: "ns-canvas",
  template: `
    <GridLayout>
      <Canvas
        backgroundColor="#242a38"
        (ready)="onCanvasReady($event)"
      ></Canvas>
    </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class GlassComponent {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  _page: Page = inject(Page);
  _zone: NgZone = inject(NgZone);
  private requestId!: number;
  img;

  constructor() {
    this._page.actionBarHidden = true;
  }

  onCanvasReady(args) {
    this.canvas = args?.object as Canvas;
    this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Draw a background image in the canvas
    this.img = new Image();
    this.img.src = "~/assets/8rmMZ3.jpg";
    this.img.onload = () => {
      this.ctx.drawImage(this.img, 0, 0, width, height);
      this.drawCard();
    };
  }

  draw() {
    // this.animation.draw();
    this.requestId = requestAnimationFrame(() => this.draw());
  }

  drawCard() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cardWidth = width * 0.8;
    const cardHeight = height * 0.4;
    const cardX = (width - cardWidth) / 2;
    const cardY = (height - cardHeight) / 2;
    const cornerRadius = 20;

    // Draw the background image
    // Assuming the background image is already loaded and named `this.img`
    this.ctx.drawImage(this.img, 0, 0, width, height);

    // Create an offscreen canvas
    var offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    var offCtx = offscreenCanvas.getContext('2d');

    // Apply blur to the offscreen canvas
    offCtx.filter = 'blur(10px)'; // Adjust the blur radius as needed
    offCtx.drawImage(this.img, 0, 0, width, height);

    // Draw the blurred region onto the main canvas
    this.ctx.drawImage(offscreenCanvas, cardX, cardY, cardWidth, cardHeight, cardX, cardY, cardWidth, cardHeight);

    // Draw the card
    this.ctx.save();
    this.ctx.shadowColor = "rgba(0,0,0,0.3)";
    this.ctx.shadowBlur = 40;
    this.ctx.shadowOffsetY = 20;

    // Here, you might want to use fillRect() or another method to actually draw the card
    // For example, this code would draw a semi-transparent white rectangle:
    this.ctx.fillStyle = "rgba(255,255,255,0.4)";
    this.ctx.fillRect(cardX, cardY, cardWidth, cardHeight);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.requestId);
  }
}
