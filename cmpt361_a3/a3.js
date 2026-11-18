import { Framebuffer } from './framebuffer.js';
import { Rasterizer } from './rasterizer.js';
// DO NOT CHANGE ANYTHING ABOVE HERE
function lerpColor([r1, g1, b1], [r2, g2, b2], t) {
  return [r1 * (1 - t) + r2 * t, g1 * (1 - t) + g2 * t, b1 * (1 - t) + b2 * t];
}

function edgeFunction(v0, v1, p) {
  const [x0, y0] = v0;
  const [x1, y1] = v1;
  const [x, y] = p;

  const a = y1 - y0;
  const b = x0 - x1;
  const c = x1 * y0 - x0 * y1;

  return a * x + b * y + c;
}

function pointIsInsideTriangle(v1, v2, v3, p) {
  const e1 = edgeFunction(v1, v2, p);
  const e2 = edgeFunction(v2, v3, p);
  const e3 = edgeFunction(v3, v1, p);

  const pass1 = (e1 > 0) || (e1 === 0 && isTopLeft(v1, v2));
  const pass2 = (e2 > 0) || (e2 === 0 && isTopLeft(v2, v3));
  const pass3 = (e3 > 0) || (e3 === 0 && isTopLeft(v3, v1));

  return pass1 && pass2 && pass3;
}

function isTopLeft(v0, v1) {
  const [xStart, yStart] = v0;
  const [xEnd, yEnd] = v1;

  const isLeftEdge = (yEnd > yStart);
  const isTopEdge = (yEnd === yStart) && (xEnd < xStart);

  return isLeftEdge || isTopEdge;
}

function barycentricCoordinates(v1, v2, v3, p) {
  const e1 = edgeFunction(v1, v2, p);
  const e2 = edgeFunction(v2, v3, p);
  const e3 = edgeFunction(v3, v1, p);
  const sum = e1 + e2 + e3;

  const w1 = e2 / sum;
  const w2 = e3 / sum;
  const w3 = e1 / sum;

  return [w1, w2, w3];
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

  const xMin = Math.max(Math.ceil(Math.min(x1, x2, x3)), 0);
  const xMax = Math.min(Math.ceil(Math.max(x1, x2, x3)), this.framebuffer.pixelsWide - 1);
  const yMin = Math.max(Math.ceil(Math.min(y1, y2, y3)), 0);
  const yMax = Math.min(Math.ceil(Math.max(y1, y2, y3)), this.framebuffer.pixelsWide - 1);

  for (let y = yMin; y <= yMax; ++y) {
    for (let x = xMin; x <= xMax; ++x) {
      if (pointIsInsideTriangle(v1, v2, v3, [x, y])) {
        const [w1, w2, w3] = barycentricCoordinates(v1, v2, v3, [x, y]);
        const r = w1 * r1 + w2 * r2 + w3 * r3;
        const g = w1 * g1 + w2 * g2 + w3 * g3;
        const b = w1 * b1 + w2 * b2 + w3 * b3;
        this.setPixel(x, y, [r, g, b]);
      }
    }
  }
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
