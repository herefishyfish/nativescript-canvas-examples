import { Component } from "@angular/core";

@Component({
  selector: "ns-app",
  template: `
    <GridLayout>
      <page-router-outlet actionBarHidden="true" />
    </GridLayout>
  `,
})
export class AppComponent {}
