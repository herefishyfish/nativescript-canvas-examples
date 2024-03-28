import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/smoke",
    pathMatch: "full",
  },
  {
    path: 'star',
    loadComponent: () => import('./2D/star.component').then((m) => m.StarComponent),
  },
  {
    path: "home",
    loadComponent: () =>
      import("./home.component").then((m) => m.HomeComponent),
  },
  {
    path: "glass",
    loadComponent: () =>
      import("./2D/glass.component").then((m) => m.GlassComponent),
  },
  {
    path: "smoke",
    loadComponent: () =>
      import("./3D/smoke.component").then((m) => m.SmokeComponent),
  },
  {
    path: "starfield",
    loadComponent: () =>
      import("./2D/starfield.component").then((m) => m.StarfieldComponent),
  },
  {
    path: "adev",
    loadComponent: () =>
      import("./2D/adev/adev.component").then((m) => m.AngularDevCanvasComponent),
  },
  {
    path: "blob",
    loadComponent: () =>
      import("./3D/blob.component").then((m) => m.BlobComponent),
  },
  {
    path: "rect",
    loadComponent: () =>
      import("./3D/rect-nav.component").then((m) => m.RectNavComponent),
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
