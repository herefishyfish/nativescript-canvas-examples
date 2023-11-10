import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  inject,
  NO_ERRORS_SCHEMA,
  PipeTransform,
  Pipe,
} from '@angular/core';
import { NativeScriptCommonModule, registerElement } from '@nativescript/angular';
import { Canvas } from '@nativescript/canvas';
import { CanvasModule } from '@nativescript/canvas/angular';
import { Image, Page } from '@nativescript/core';
import { CompassService } from '../services/compass.service';
import { BehaviorSubject, sampleTime } from 'rxjs';

registerElement('Canvas', () => Canvas);

@Pipe({name: 'heading', standalone: true})
export class DegreesToHeadingPipe implements PipeTransform {
    transform(value: number): string {
        // return Heading based on degrees value
        if (value >= 0 && value < 22.5) {
            return 'N';
        }
        if (value >= 22.5 && value < 67.5) {
            return 'NE';
        }
        if (value >= 67.5 && value < 112.5) {
            return 'E';
        }
        if (value >= 112.5 && value < 157.5) {
            return 'SE';
        }
        if (value >= 157.5 && value < 202.5) {
            return 'S';
        }
        if (value >= 202.5 && value < 247.5) {
            return 'SW';
        }
        if (value >= 247.5 && value < 292.5) {
            return 'W';
        }
        if (value >= 292.5 && value < 337.5) {
            return 'NW';
        }
        if (value >= 337.5 && value < 360) {
            return 'N';
        }

        return 'N';
    }
}

@Component({
  standalone: true,
  selector: 'app-compass',
  template: `
    <GridLayout rows="40* 20* 40*" columns="40* 20* 40*" backgroundColor="#000">
      <Canvas  rowSpan="3" colSpan="3" (ready)="onReady($event)"></Canvas>
      <StackLayout class="content">
        <Label class="h1 text-white text-center" color="white">{{rotation | number:'1.0-0'}}°</Label>
        <Label class="h2 text-white text-center" color="#73adf0">{{rotation | heading }}</Label>
      </StackLayout>
    </GridLayout>
  `,
  styles: [
    `
    .content {
      row: 1;
      col: 1;
      width: 100%;
      height: 100%;
      vertical-alignment: center;
      horizontal-alignment: center;
    }
  `,
  ],
  imports: [CanvasModule, NativeScriptCommonModule, DegreesToHeadingPipe],
  providers: [CompassService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CompassComponent implements OnInit, AfterViewInit, OnDestroy {
  #compassService = inject(CompassService);
  #page = inject(Page);
  timer = new BehaviorSubject<number>(0);
  canvas: any = null;
  ctx: any = null;
  rotation = 0;
  lastRotation = 0;

  ngOnInit() {
    this.#page.actionBarHidden = true;
    this.timer.pipe(sampleTime(8)).subscribe((rotation: number) => {
      this.drawCompass2(rotation);
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.#compassService.startUpdatingHeading();
      this.#compassService.curRotation.on('propertyChange', (p) => {
        if (this.ctx && p?.object?.['rotation']) {
          this.rotation = p.object['rotation'];
          this.timer.next(-p.object['rotation'])
        }
      });
    }, 0);
  }

  onReady(args: any) {
    setTimeout(() => {
      console.log('Canvas loaded');
      this.canvas = args?.object;
      this.ctx = this.canvas?.getContext('2d');

      this.drawCompass2(0);
    }, 0);
  }

  drawCompass2(rotation = 0) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.rotate((Math.PI / 180) * (rotation - this.lastRotation));
    this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    
    this.lastRotation = rotation;

    this.ctx.beginPath();
    this.ctx.fillStyle = '#73adf0';
    this.ctx.arc(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width / 3.6,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    // // inner inner inner circle
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.arc(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width / 5,
      0,
      2 * Math.PI
    );
    this.ctx.fill();

    const getPoint = (angle, radius) => {
      return {
        x: this.canvas.width / 2 + radius * Math.cos((Math.PI / 180) * angle),
        y: this.canvas.height / 2 + radius * Math.sin((Math.PI / 180) * angle),
      };
    };

    for (let i = 15; i < 360; i += 30) {
      const point = getPoint(i, this.canvas.width / 3.2);
      const point2 = getPoint(i, this.canvas.width / 3.25);
      this.ctx.beginPath();
      this.ctx.lineWidth = 8;
      this.ctx.moveTo(point.x, point.y);
      this.ctx.lineTo(point2.x, point2.y);
      this.ctx.stroke();

      // ?????
      // this.ctx.beginPath();
      // this.ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI, true);
      // this.ctx.fill();
    }

    for (let i = -90; i < 270; i += 30) {
      const point = getPoint(i, this.canvas.width / 3.4);
      const point2 = getPoint(i, this.canvas.width / 3.55);
      this.ctx.beginPath();
      this.ctx.strokeStyle = 'gray';
      this.ctx.lineWidth = 8;
      this.ctx.moveTo(point.x, point.y);
      this.ctx.lineTo(point2.x, point2.y);
      this.ctx.stroke();

      const point3 = getPoint(i, this.canvas.width / 3.35);
      this.ctx.save();
      this.ctx.translate(point3.x, point3.y);
      this.ctx.rotate((Math.PI / 180) * i + Math.PI / 2);
      this.ctx.translate(-point3.x, -point3.y);
      this.ctx.font = 'bold 40px Arial';
      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(i + 90, point3.x, point3.y);
      this.ctx.restore();
    }

    for (let i = 0; i < 360; i += 10) {
      const point = getPoint(i, this.canvas.width / 2.8);
      if(i % 90 !== 0) {
        const point2 = getPoint(i, this.canvas.width / 2.5);

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = 4;
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.stroke();
      } else {
        
        const point2 = getPoint(i, this.canvas.width / 2.6);
        this.ctx.save();
        this.ctx.translate(point2.x, point2.y);
        this.ctx.rotate((Math.PI / 180) * (-rotation));


        this.ctx.translate(-point2.x, -point2.y);
        this.ctx.font = 'bold 70px Arial';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(i === 0 ? 'E' : i === 90 ? 'S' : i === 180 ? 'W' : 'N', point2.x, point2.y + 15);
        this.ctx.restore();
      }
    }
  }
  
  ngOnDestroy() {
    this.#compassService.stopUpdatingHeading();
  }
}
