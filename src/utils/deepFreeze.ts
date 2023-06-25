const isObject = (value: unknown): value is object =>
  (value !== null && typeof value === 'object') || typeof value === 'function';

export function deepFreeze<T extends object>(object: T): T {
  for (const [, value] of Object.entries(object)) {
    if (isObject(value) && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
