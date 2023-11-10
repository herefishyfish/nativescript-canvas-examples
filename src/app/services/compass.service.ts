import { Injectable } from '@angular/core';
import { isAndroid, isIOS, Application, fromObject } from '@nativescript/core';
import { OrientationChangedEventData } from '@nativescript/core/application/application-interfaces';

declare const android: any;
declare const CLLocationManager: any;

@Injectable({
  providedIn: 'root',
})
export class CompassService {
  public sensorUpdate: any;
  private sensorManager: any;
  public curRotation = fromObject({ rotation: 0 });
  private curOrientationOffset = 0;

  constructor() {
    if (isAndroid) {
      // public String getRotation(Context context) {
      //     final int rotation = ((WindowManager) context.getSystemService(Context.WINDOW_SERVICE)).getDefaultDisplay().getOrientation();
      //     switch (rotation) {
      //         case Surface.ROTATION_0:
      //             return "portrait";
      //         case Surface.ROTATION_90:
      //             return "landscape";
      //         case Surface.ROTATION_180:
      //             return "reverse portrait";
      //         default:
      //             return "reverse landscape";
      //     }
      // }
      // if( isAndroid ) {
      //     // Only triggered when going from portrait to landscape... :/
      //     // console.log( android.content.pm.ActivityInfo.sreenOrientation );
      //     // console.log( android.view.WindowManager.screenOrientation );
      //     // console.log( android)
      // }
    }

    if (isIOS) {
      // Get initial orientation.
      this.curOrientationOffset = this.getOrientation(
        UIDevice.currentDevice.orientation
      );
      // TODO: Get this method working? A way to do it without editing the NS/Application/ios.js files
      // Currently this method only returns Portrait/Landscape unless you alter the core package to return all four states.
      // Android by default only returns two states. Need to listen to OnRotate events.

      Application.on(
        Application.orientationChangedEvent,
        (event: OrientationChangedEventData) => {
          this.curOrientationOffset = this.getOrientation(
            UIDevice.currentDevice.orientation
          );
        }
      );
    }
  }

  getOrientation(orientation) {
    switch (orientation) {
      case 3 /* LandscapeRight */:
        return 90;
      case 4 /* LandscapeLeft */:
        return 270;
      case 2 /* PortraitUpsideDown */:
        return 180;
      case 1 /* Portrait */:
        return 0;
      case 0 /* Unknown */:
        return 0;
    }
  }

  startUpdatingHeading() {
    if (this.sensorManager || this.sensorUpdate) {
      return; // avoiding multiple launches
    }

    if (isIOS) {
      this.sensorManager = CLLocationManager.alloc().init();

      if (this.sensorManager.headingAvailable) {
        this.sensorManager.startUpdatingHeading();

        this.sensorUpdate = setInterval(() => {
          // Here is the result we need for iOS platform
          this.curRotation.setProperty(
            'rotation',
            this.sensorManager.heading.trueHeading + this.curOrientationOffset
          );
        }, 1000 / 60); // 60 Ticks~
      } else {
        console.log('Heading not available.');
      }

      return;
    }

    if (isAndroid) {
      this.sensorManager =
        Application.android.foregroundActivity.getSystemService(
          android.content.Context.SENSOR_SERVICE
        );

      this.sensorUpdate = new android.hardware.SensorEventListener({
        onAccuracyChanged: (sensor: any, accuracy: any) => {},
        onSensorChanged: (event: any) => {
          // Here is the result we need for Android platform
          this.curRotation.set('rotation', event.values[0]);
        },
      });

      const orientationSensor = this.sensorManager.getDefaultSensor(
        android.hardware.Sensor.TYPE_ORIENTATION
      );
      this.sensorManager.registerListener(
        this.sensorUpdate,
        orientationSensor,
        android.hardware.SensorManager.SENSOR_DELAY_FASTEST // 60FPS //** Skips need for animation between ticks */
      );
    }
  }

  stopUpdatingHeading() {
    if (!this.sensorManager || !this.sensorUpdate) {
      return;
    }

    if (isIOS) {
      this.sensorManager.stopUpdatingHeading();
      clearInterval(this.sensorUpdate);
    }

    if (isAndroid) {
      this.sensorManager.unregisterListener(this.sensorUpdate);
    }

    this.sensorUpdate = null;
    this.sensorManager = null;
  }
}
