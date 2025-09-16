const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const toHex = (n: number) => {
  const h = n.toString(16);
  return h.length === 1 ? "0" + h : h;
};

export const hsbToHex = (
  h: number,
  s: number,
  b: number,
  a?: number
): string => {
  const H = ((h % 360) + 360) % 360; // normalize hue
  const S = clamp(s / 100); // karena chakra kasih 0–100
  const V = clamp(b / 100);

  const C = V * S;
  const X = C * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = V - C;

  let r1 = 0,
    g1 = 0,
    b1 = 0;
  if (H < 60) {
    r1 = C;
    g1 = X;
    b1 = 0;
  } else if (H < 120) {
    r1 = X;
    g1 = C;
    b1 = 0;
  } else if (H < 180) {
    r1 = 0;
    g1 = C;
    b1 = X;
  } else if (H < 240) {
    r1 = 0;
    g1 = X;
    b1 = C;
  } else if (H < 300) {
    r1 = X;
    g1 = 0;
    b1 = C;
  } else {
    r1 = C;
    g1 = 0;
    b1 = X;
  }

  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const bb = Math.round((b1 + m) * 255);

  const base = `#${toHex(r)}${toHex(g)}${toHex(bb)}`;

  if (a === undefined || clamp(a) >= 1) return base;
  const alphaHex = toHex(Math.round(clamp(a) * 255));
  return base + alphaHex;
};

export const hslToHex = (
  h: number,
  s: number,
  l: number,
  a?: number
): string => {
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((b + m) * 255);

  const base = `#${toHex(R)}${toHex(G)}${toHex(B)}`;

  if (a === undefined || a >= 1) return base;
  return base + toHex(Math.round(a * 255));
};

export const rgbaToHex = (r: number, g: number, b: number, a: number) => {
  const toHex = (c: number) =>
    Math.round(Math.min(255, Math.max(0, c)))
      .toString(16)
      .padStart(2, "0");

  const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  if (a < 1) {
    const alphaValue = Math.round(Math.min(1, Math.max(0, a)) * 255);
    return `${hex}${toHex(alphaValue)}`;
  }
  return hex;
};
