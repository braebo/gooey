//#region src/shared/color/types/objects.d.ts
type ColorObject = HsvColor | HsvaColor | RgbColor | RgbaColor | HslColor | HslaColor | KelvinColor;
interface HsvColor {
  h: number;
  s: number;
  v: number;
}
interface HsvaColor extends HsvColor {
  a: number;
}
interface RgbColor {
  r: number;
  g: number;
  b: number;
}
interface RgbaColor extends RgbColor {
  a: number;
}
interface HslColor {
  h: number;
  s: number;
  l: number;
}
interface HslaColor extends HslColor {
  a: number;
}
interface KelvinColor {
  kelvin: number;
}
//#endregion
export { ColorObject, HslColor, HslaColor, HsvColor, HsvaColor, KelvinColor, RgbColor, RgbaColor };
//# sourceMappingURL=objects.d.ts.map