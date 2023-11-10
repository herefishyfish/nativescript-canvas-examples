import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { routes } from './routes';
import { NgFor } from '@angular/common';
import { NativeScriptRouterModule } from '@nativescript/angular';

@Component({
  selector: 'ns-home',
  template: `
    <StackLayout>
      <Button *ngFor="let route of routes" [nsRouterLink]="'/' + route.path">
        {{ route.path }}
      </Button>
    </StackLayout>
  `,
  standalone: true,
  imports: [NgFor, NativeScriptRouterModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HomeComponent {
  routes = routes.filter((route) => route.path !== '');
}