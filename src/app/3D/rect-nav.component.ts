import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { PagerModule } from "@nativescript-community/ui-pager/angular";
import { CanvasModule } from "@nativescript/canvas/angular";

@Component({
  standalone: true,
  template: `
    <GridLayout>
      <Canvas (ready)="onCanvasReady($event)"></Canvas>
      <Pager>
        <ng-template *pagerItem>
          <StackLayout>
            <Label text="Page 1"></Label>
          </StackLayout>
        </ng-template>
        <ng-template *pagerItem>
          <StackLayout>
            <Label text="Page 2"></Label>
          </StackLayout>
        </ng-template>
      </Pager>
    </GridLayout>
  `,
  schemas: [NO_ERRORS_SCHEMA],
  imports: [PagerModule, CanvasModule],
})
export class RectNavComponent {

  onCanvasReady(args: any) {
    console.log('onCanvasReady');
  }
}
