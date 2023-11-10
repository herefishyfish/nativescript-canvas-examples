import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule, NativeScriptRouterModule } from '@nativescript/angular';
import { CanvasModule } from '@nativescript/canvas/angular';

import { AppComponent } from './app.component';
import { routes } from './routes';

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, CanvasModule, NativeScriptRouterModule.forRoot(
    routes
  )],
  declarations: [AppComponent],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
