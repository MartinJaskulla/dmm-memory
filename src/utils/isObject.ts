export function isObject(thing: unknown): thing is Record<string, unknown> {
  return typeof thing === 'object' && !Array.isArray(thing) && thing !== null;
}
