export type RecursiveDotNotation<T, P extends string = ''> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? RecursiveDotNotation<T[K], P extends '' ? `${K & string}` : `${P}.${K & string}`>
        : T[K] extends string
        ? P extends ''
          ? `${K & string}`
          : `${P}.${K & string}`
        : never;
    }[keyof T]
  : P;
