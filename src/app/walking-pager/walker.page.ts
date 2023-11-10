import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { WalkingComponent } from "./canvas/Walking.component";

@Component({
  template: `
    <GridLayout>
      <app-walking [position]="0" />
    </GridLayout>
  `,
  standalone: true,
  imports: [
    WalkingComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ],
})
export class WalkerPage {
}