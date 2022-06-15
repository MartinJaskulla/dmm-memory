import { shuffleEffect } from './shuffleEffect';
import { timerEffect } from './timerEffect';
import { retryEffect } from './retryEffect';
import { trickEffect } from './trickEffect';

export const effectRegistry = [shuffleEffect, timerEffect, retryEffect, trickEffect];

export const effectLookup = effectRegistry.reduce((registry: Record<string, typeof effectRegistry[0]>, effect) => {
  registry[effect.effectId] = effect;
  return registry;
}, {});
