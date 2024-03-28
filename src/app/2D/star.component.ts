import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Canvas, CanvasRenderingContext2D } from "@nativescript/canvas";
import { LoadEventData } from "@nativescript/core";
import { registerElement } from "@nativescript/angular";
registerElement("Canvas", () => Canvas);

@Component({
  selector: "ns-star",
  template: `
    <GridLayout>
      <Canvas (ready)="onCanvasReady($event)"></Canvas>
    </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class StarComponent {
  d = [
    [100, 68],
    [109.40456403667957, 87.05572809000084],
    [130.43380852144492, 90.11145618000168],
    [115.21690426072246, 104.94427190999916],
    [118.80912807335915, 125.88854381999832],
    [100, 116],
    [81.19087192664087, 125.88854381999832],
    [84.78309573927754, 104.94427190999916],
    [69.56619147855508, 90.1114561800017],
    [90.59543596332043, 87.05572809000084],
  ];

  onCanvasReady(args: LoadEventData) {
    const canvas = args.object as Canvas;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (!ctx) {
      return;
    }

    console.log(canvas.height, canvas.width);

    ctx.fillStyle = "red";
    this.drawStar(ctx, { x: 180, y: 100, scalar: 4 });

    ctx.fillStyle = "blue";
    this.drawStarWithCoords(ctx);

    ctx.fillStyle = "green";
    this.drawStarPath(ctx, { x: 260, y: 100, scalar: 4 });
  }

  drawStarWithCoords(ctx) {
    ctx.beginPath();
    ctx.moveTo(this.d[0][0], this.d[0][1]);
    for (let i = 1; i < this.d.length; i++) {
      ctx.lineTo(this.d[i][0], this.d[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  drawStar(ctx, fetti: { x: number; y: number; scalar: number }) {
    var rot = (Math.PI / 2) * 3;
    var innerRadius = 4 * fetti.scalar;
    var outerRadius = 8 * fetti.scalar;
    var x = fetti.x;
    var y = fetti.y;
    var spikes = 5;
    var step = Math.PI / spikes;

    ctx.beginPath();
    
    while (spikes--) {
      x = fetti.x + Math.cos(rot) * outerRadius;
      y = fetti.y + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;
      
      x = fetti.x + Math.cos(rot) * innerRadius;
      y = fetti.y + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.closePath();
    ctx.fill();
  }

  drawStarPath(ctx, fetti: { x: number; y: number; scalar: number }) {
    var rot = (Math.PI / 2) * 3;
    var innerRadius = 4 * fetti.scalar;
    var outerRadius = 8 * fetti.scalar;
    var x = fetti.x;
    var y = fetti.y;
    var spikes = 5;
    var step = Math.PI / spikes;

    const path = new Path2D();

    while (spikes--) {
      x = fetti.x + Math.cos(rot) * outerRadius;
      y = fetti.y + Math.sin(rot) * outerRadius;
      path.lineTo(x, y);
      rot += step;

      x = fetti.x + Math.cos(rot) * innerRadius;
      y = fetti.y + Math.sin(rot) * innerRadius;
      path.lineTo(x, y);
      rot += step;
    }

    path.closePath();
    const g = (path as any).__toSVG();
    console.log(g);

    ctx.fill(path);

  }
}
