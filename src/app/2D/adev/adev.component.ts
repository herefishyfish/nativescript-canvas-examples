import { Component, NO_ERRORS_SCHEMA, inject, NgZone } from "@angular/core";
import { Application, Page } from '@nativescript/core';
import { Canvas, CanvasRenderingContext2D } from '@nativescript/canvas';
import { registerElement } from '@nativescript/angular';
import { HomeAnimation } from "./services/home-animation.service";
registerElement('Canvas', () => Canvas);

@Component({
  selector: 'ns-canvas',
  template: `
  <GridLayout>
    <Canvas backgroundColor="#242a38" (ready)="onCanvasReady($event)"></Canvas>
  </GridLayout>
  `,
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA],
  providers: [HomeAnimation]
})
export class AngularDevCanvasComponent {
  canvas: Canvas;
  ctx: CanvasRenderingContext2D;
  homeService = inject(HomeAnimation);

  constructor(private _page: Page) {
    this._page.actionBarHidden = true;
  }

  onCanvasReady(args) {
    this.canvas = args?.object as Canvas;
    // this.ctx = this.canvas?.getContext('we') as CanvasRenderingContext2D;

    this.homeService.init(this.canvas);
  }
}