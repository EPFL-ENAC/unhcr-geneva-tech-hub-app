export function applyMap<T extends Record<keyof T, number>>(
  t: T,
  fn: (value: number) => number
): T {
  return Object.fromEntries<number>(
    Object.entries<number>(t).map(([key, value]) => [key, fn(value)])
  ) as T;
}

export function applyReduce<T extends Record<keyof T, number>>(
  ts: T[],
  fn: (a: number, b: number) => number,
  initial?: T
): T {
  const callbackFn = (a: T, b: T) =>
    Object.fromEntries<number>(
      (Object.keys(a) as (keyof T)[]).map((key) => [key, fn(a[key], b[key])])
    ) as T;
  if (initial) {
    return ts.reduce(callbackFn, initial);
  } else {
    return ts.reduce(callbackFn);
  }
}
