export type Branded<T, B> = T & { __brand: B };

export type BrandedId<T extends string> = Branded<`${T}-${string}`, T>;
