/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {Color, Mesh, OGLRenderingContext, Plane} from 'ogl';

import {View} from './view';
import {GlyphProgram} from '../programs/glyph-program';

import {toRadians} from '../../utils/math';
import {loadTexture} from '../../utils/ogl';

/**
 * An OGL `Transform` used for the animation of the "Build for everyone" heading.
 *
 * The `userData` object is used for the GSAP animation, and the `override update(): void` method
 * applies the values to the `Transform`.
 */
export class BuildText extends View {
  private viewWidth = 433;
  private viewHeight = 58;
  private aspect = this.viewWidth / this.viewHeight;
  private mesh!: Mesh;

  /**
   * Create the build text.
   */
  constructor(private readonly gl: OGLRenderingContext, private readonly document: Document) {
    super();

    this.userData['x'] = 0;
    this.userData['y'] = 0;
    this.userData['rotation'] = 0;
    this.userData['scale'] = 1;
    this.userData['opacity'] = 1;
  }

  /**
   * Initialize child views.
   */
  override async init(): Promise<void> {
    // const texture = await loadTexture(this.gl, 'assets/textures/build-msdf.png');
    // texture.minFilter = this.gl.LINEAR;
    // texture.generateMipmaps = false;

    const geometry = new Plane(this.gl);

    const program = new GlyphProgram(this.gl, null, new Color(1, 1, 1));

    const mesh = new Mesh(this.gl, {geometry, program});
    mesh.frustumCulled = false;
    this.addChild(mesh);

    this.mesh = mesh;
  }

  /**
   * Update size and position of the view, based on the CSS heading.
   */
  override resize(width: number, height: number, dpr: number, scale: number): void {
    // const heading = this.document.querySelector('.adev-build-webgl-text h2')!;
    // const bounds = heading.getBoundingClientRect();
    let textHeight;

    if (width < 1000) {
      // Mobile fixed size (in px)
      textHeight = 48;
    } else {
      // Desktop calculation (in px)
      // textHeight = bounds.height * 20;
    }

    this.userData['width'] = textHeight * this.aspect;
    this.userData['height'] = textHeight;

    // Positioned relative to the CSS heading, vertical offset from the center, Y flipped
    let y = 1 - (height - height) / 2;

    // Vertical offset adjustment (in px)
    if (width < 1000) {
      y -= 4;
    } else {
      y -= 6 * scale;
    }

    console.log('y', y);
    // this.mesh.position.set(0, y, 0);
    // this.mesh.scale.set(this.userData['width'], this.userData['height'], 1);
  }

  /**
   * Update position, rotation and scale of the view, and alpha uniform of the program.
   */
  override update(): void {
    this.position.x = this.userData['x'];
    this.position.y = -this.userData['y']; // Y flipped

    this.rotation.z = -toRadians(this.userData['rotation']);

    this.scale.set(this.userData['scale']);

    this.mesh.program.uniforms['uAlpha'].value =
      this.userData['opacity'] * this.parent!.userData['opacity'];
  }

  /**
   * Promise for the child views when they're ready.
   */
  override ready(): Promise<void> {
    return this.init();
  }
}
