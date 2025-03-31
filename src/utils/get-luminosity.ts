export function getLuminosity(hexCode: string) {
  const hex = hexCode.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const adjust = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

  const rLum = adjust(r);
  const gLum = adjust(g);
  const bLum = adjust(b);

  return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
}
