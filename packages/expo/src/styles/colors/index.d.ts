type Colors = typeof import('./index.json');
// https://www.raygesualdo.com/posts/flattening-object-keys-with-typescript-types
type FlattenObjectKeys<T extends Record<string, unknown>, Key = keyof T, Join = '_'> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}${Join}${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

export type TailwindColor = `text-${FlattenObjectKeys<Colors, keyof Colors, '-'>}`;
declare const tailwindColors: Record<TailwindColor, string>;
declare const COLORS: Record<Capitalize<FlattenObjectKeys<Colors>>, string> & {
  tailwindMap: typeof tailwindColors;
};
export = COLORS;
