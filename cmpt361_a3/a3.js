import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE
function lerpColor([r1, g1, b1], [r2, g2, b2], t) {
  return [r1 * (1 - t) + r2 * t, g1 * (1 - t) + g2 * t, b1 * (1 - t) + b2 * t];
}
////////////////////////////////////////////////////////////////////////////////
// TODO: Implement functions drawLine(v1, v2) and drawTriangle(v1, v2, v3) below.
////////////////////////////////////////////////////////////////////////////////

// take two vertices defining line and rasterize to framebuffer
Rasterizer.prototype.drawLine = function (v1, v2) {
  const absDeltaX = Math.abs(v1[0] - v2[0]);
  const absDeltaY = Math.abs(v1[1] - v2[1]);

  if ((absDeltaX === 0) && (absDeltaY === 0)) {
    this.setPixel(Math.floor(v1[0]), Math.floor(v1[1]), v1[2]);
    return;
  }

  const stepX = absDeltaX >= absDeltaY;

  if (stepX) {
    if (v1[0] > v2[0]) {
      [v1, v2] = [v2, v1];
    }
  } else {
    if (v1[1] > v2[1]) {
      [v1, v2] = [v2, v1];
    }
  }
  const [x1, y1] = v1;
  const [x2, y2] = v2;

  const deltaY = y2 - y1;
  const deltaX = x2 - x1;

  if (stepX) {
    for (let x = Math.floor(x1); x <= Math.floor(x2); ++x) {
      const y = y1 + (deltaY * (x - x1)) / deltaX;
      const t = (x - x1) / deltaX;
      this.setPixel(x, Math.floor(y), lerpColor(v1[2], v2[2], t));
    }
  } else {
    for (let y = Math.floor(y1); y <= Math.floor(y2); ++y) {
      const x = x1 + (deltaX * (y - y1)) / deltaY;
      const t = (y - y1) / deltaY;
      this.setPixel(Math.floor(x), y, lerpColor(v1[2], v2[2], t));
    }
  }
};

// take 3 vertices defining a solid triangle and rasterize to framebuffer
Rasterizer.prototype.drawTriangle = function (v1, v2, v3) {
  const [x1, y1, [r1, g1, b1]] = v1;
  const [x2, y2, [r2, g2, b2]] = v2;
  const [x3, y3, [r3, g3, b3]] = v3;
  // TODO/HINT: use this.setPixel(x, y, color) in this function to draw triangle
  this.setPixel(Math.floor(x1), Math.floor(y1), [r1, g1, b1]);
  this.setPixel(Math.floor(x2), Math.floor(y2), [r2, g2, b2]);
  this.setPixel(Math.floor(x3), Math.floor(y3), [r3, g3, b3]);
};

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "v,10,10,1.0,0.0,0.0;",
  "v,52,52,0.0,1.0,0.0;",
  "v,52,10,0.0,0.0,1.0;",
  "v,10,52,1.0,1.0,1.0;",
  "t,0,1,2;",
  "t,0,3,1;",
  "v,10,10,1.0,1.0,1.0;",
  "v,10,52,0.0,0.0,0.0;",
  "v,52,52,1.0,1.0,1.0;",
  "v,52,10,0.0,0.0,0.0;",
  "l,4,5;",
  "l,5,6;",
  "l,6,7;",
  "l,7,4;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Rasterizer, Framebuffer, DEF_INPUT };
