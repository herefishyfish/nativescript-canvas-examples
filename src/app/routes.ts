import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/breathe",
    pathMatch: "full",
  },
  {
    path: "home",
    loadComponent: () =>
      import("./home.component").then((m) => m.HomeComponent),
  },
  {
    path: "blob",
    loadComponent: () =>
      import("./3D/blob.component").then((m) => m.BlobComponent),
  },
  {
    path: "celes",
    loadComponent: () =>
      import("./3D/celestial.component").then((m) => m.CelestialComponent),
  },
  {
    path: "angular-three",
    loadComponent: () =>
      import("./ngt/angular-three.component").then((m) => m.AngularThreeComponent),
  },
  {
    path: 'breathe',
    loadComponent: () => import('./2D/breathe.component').then((m) => m.BreatheComponent),
  },
  {
    path: "circles",
    loadComponent: () =>
      import("./2D/circles.component").then((m) => m.CirclesComponent),
  },
  {
    path: "compass",
    loadComponent: () =>
      import("./2D/compass.component").then((m) => m.CompassComponent),
  },
  {
    path: "confetti",
    loadComponent: () =>
      import("./2D/confetti.component").then((m) => m.AppComponent),
  },
  {
    path: "walker",
    loadComponent: () =>
      import("./walking-pager/walker.page").then((m) => m.WalkerPage),
  }
];
