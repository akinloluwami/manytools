import nearestColor from "nearest-color";
//@ts-ignore
import { colornames } from "color-name-list";

export function convertHexColorCode(hex: string) {
  // Ensure the hex code is valid
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
    throw new Error("Invalid hex color code");
  }

  // Normalize 3-digit hex to 6-digit
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }

  // Extract RGB values
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Convert to HSL
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)) * 60;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / delta + 2) * 60;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / delta + 4) * 60;
        break;
    }
  }

  // Convert to CMYK
  const k = 1 - max;
  const c = k < 1 ? (1 - rNorm - k) / (1 - k) : 0;
  const m = k < 1 ? (1 - gNorm - k) / (1 - k) : 0;
  const y = k < 1 ? (1 - bNorm - k) / (1 - k) : 0;

  const colors = colornames.reduce(
    //@ts-ignore
    (o, { name, hex }) => Object.assign(o, { [name]: hex }),
    {}
  );

  const nearest = nearestColor.from(colors);

  const name = nearest(hex) as { name: string } | null;

  console.log(name);

  return {
    name: `~ ${name?.name}`,
    hex: hex.replace("#", ""),
    rgb: `${r}, ${g}, ${b}`,
    cmyk: `${(c * 100).toFixed(0)}, ${(m * 100).toFixed(0)}, ${(y * 100).toFixed(0)}, ${(k * 100).toFixed(0)}`,
    hsl: `${h.toFixed(0)}, ${(s * 100).toFixed(0)}, ${(l * 100).toFixed(0)}`,
  };
}
