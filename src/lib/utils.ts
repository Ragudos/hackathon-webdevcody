import { RGB } from "@/consts";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const strToHex = (c: string | number) => {
	const hex = c.toString(16);

	return hex.length === 1 ? "0" + hex : hex;
};

export const rgbToHex = (rgb: RGB | undefined) => (
	rgb ? `#${(1 << 24 | rgb[0] << 16 | rgb[1] << 8 | rgb[2]).toString(16).slice(1)}` : "#000000ff"
);

export const hexToRgb = (hex: string) => {
	const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(r, g, b) {
    return r + r + g + g + b + b;
  });
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};