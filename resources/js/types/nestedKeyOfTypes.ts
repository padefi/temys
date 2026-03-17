/* type Primitive =
    | string
    | number
    | boolean
    | bigint
    | symbol
    | null
    | undefined
    | Date; */

export type NestedKeyOf<T> = T extends object
    ? {
          [K in keyof T & (string | number)]: T[K] extends object
              ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
              : `${K}`;
      }[keyof T & (string | number)]
    : never;

export type NestedKeyOfValue<
    T,
    P extends string,
> = P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
        ? NestedKeyOfValue<T[Key], Rest>
        : never
    : P extends keyof T
      ? T[P]
      : never;
