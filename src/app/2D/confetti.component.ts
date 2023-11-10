import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { LoadEventData } from '@nativescript/core';
import { Canvas } from '@nativescript/canvas';
import * as confetti from 'canvas-confetti';

import { registerElement } from '@nativescript/angular';
registerElement('Canvas', () => Canvas);

@Component({
  selector: 'ns-app',
  template: `
    <GridLayout class="container" backgroundColor="#00364f">
      <Canvas rowSpan="3" (ready)="onCanvasReady($event)"></Canvas>
      
      <StackLayout class="p-8">
        <Label class="h1 greeting text-white text-center">❤️ NativeScript</Label>

        <Button class="text-lg rounded-full bg-blue-400 text-white font-bold m-2" (tap)="basic()">Basic?</Button>
        <Button class="text-lg rounded-full bg-blue-400 text-white font-bold m-2" (tap)="basicBig()">Basic Big</Button>
        <Button class="text-lg rounded-full bg-blue-400 text-white font-bold m-2" (tap)="random()">Random</Button>
        <Button class="text-lg rounded-full bg-blue-400 text-white font-bold m-2" (tap)="realistic()">Realistic</Button>
        <Button class="text-lg rounded-full bg-blue-400 text-white font-bold m-2" (tap)="stars()">Stars</Button>
        <Button class="text-lg rounded-full bg-blue-400 text-white font-bold m-2" (tap)="fireworks()">Fireworks</Button>
        <Button class="text-lg rounded-full bg-blue-400 text-white font-bold m-2" (tap)="snow()">Snow</Button>
        <Button class="text-lg rounded-full bg-blue-400 text-white font-bold m-2" (tap)="team()">Team Pride</Button>
      </StackLayout>


    </GridLayout>
  `,
  styles: [
    `
      .container {
        rows: *;
      }
    `,
  ],
  standalone: true,
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppComponent {
  confetti;

  onCanvasReady(event: LoadEventData) {
    const canvas: Canvas = event?.object as Canvas;
    canvas.ignoreTouchEvents = true;
    canvas.ignoreTouchAnimation = true;
    this.confetti = confetti.create(canvas, {});
  }

  basic() {
    this.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  basicBig() {
    this.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  random() {
    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    this.confetti({
      angle: randomInRange(55, 125),
      spread: randomInRange(50, 70),
      particleCount: randomInRange(50, 100),
      origin: { y: 0.6 },
    });
  }

  realistic() {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    const fire = (particleRatio, opts) => {
      this.confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    };

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  stars() {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    };

    const shoot = () => {
      this.confetti({
        ...defaults,
        particleCount: 40,
        shapes: ['star'],
      });

      this.confetti({
        ...defaults,
        particleCount: 10,
        shapes: ['circle'],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }

  fireworks() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      this.confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      this.confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }

  snow() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    let skew = 1;

    const randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    const render = () => {
      const timeLeft = animationEnd - Date.now();
      const ticks = Math.max(200, 500 * (timeLeft / duration));
      skew = Math.max(0.8, skew - 0.001);

      this.confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          // since particles fall down, skew start toward the top
          y: Math.random() * skew - 0.2,
        },
        colors: ['#ffffff'],
        shapes: ['circle'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4),
      });

      if (timeLeft > 0) {
        requestAnimationFrame(render);
      }
    };

    render();
  }

  team() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    var colors = ['#bb0000', '#ffffff'];
    const render = () => {
      this.confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        scalar: 2,
        colors: colors,
      });
      this.confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        scalar: 2,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(render);
      }
    };
    render();
  }
}
