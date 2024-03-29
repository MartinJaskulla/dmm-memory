export function pickRandom<T>(array: T[]): T {
  const min = 0;
  const max = array.length - 1;
  const index = Math.floor(Math.random() * (max - min + 1) + min);
  return array[index];
}
