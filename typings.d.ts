declare module 'guess-color' {
  import { Image } from 'image-js';

  type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

  type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

  export type TByte = IntRange<0, 255>
  export type TcolorName = string;
  export type TcolorArray = [TByte, TByte, TByte];
  export type TcolorObject = {r: TByte, g: TByte, b: TByte};
  export type TColor = Record<string, TcolorArray>;
  export type TColorGroupName = 'web' | 'wb';
  export type TDimensions = { width: number, height: number };

  export declare function guess(whatIsIt: string | TcolorArray | TcolorObject): TcolorName;
  export declare function guessByImage(path: string, dimensions: TDimensions): Array<Array<TcolorName, TcolorArray, number>>;
  export declare function imageByName(name: TcolorName, fileName?: string): Promise<Image | void>;
  export declare function setPalette(name: TColorGroupName): void;
  export declare function getPalette(): TColor;
  export declare function paletteNames(): TColorGroupName;
}
