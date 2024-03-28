import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Canvas, CanvasRenderingContext2D } from "@nativescript/canvas";
import { LoadEventData } from "@nativescript/core";
import { registerElement } from "@nativescript/angular";
registerElement("Canvas", () => Canvas);

@Component({
  selector: "ns-mica",
  template: `
    <GridLayout>
      <Canvas (ready)="onCanvasReady($event)"></Canvas>
    </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
})
export class MicaComponent {
  onCanvasReady(args: LoadEventData) {
    const canvas = args.object as Canvas;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    if (!ctx) {
      return;
    }

  }
}
