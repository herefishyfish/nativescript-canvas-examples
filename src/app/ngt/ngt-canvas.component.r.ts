import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { NgtCanvas, NgtStore, injectNgtStore } from 'angular-three';


@Component({
  standalone: true,
  selector: 'nsngt-canvas',
  template: `
    <Canvas #glCanvas></Canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    
  ],
  providers: [
    
    // provideObjectRef(NSgtCanvas, (canvas) => canvas.sceneRef),
    // provideSceneRef(NSgtCanvas, (canvas) => canvas.sceneRef),
    // provideCameraRef(NSgtCanvas, (canvas) => canvas.cameraRef),
  ],
})
export class NSNgtCanvas  {
  private store = injectNgtStore();
}
