import { shuffleEffect } from './effects/shuffleEffect';
import { timerEffect } from './effects/timerEffect';
import { retryEffect } from './effects/retryEffect';
import { trickEffect } from './effects/trickEffect';

export const effectRegistry = [shuffleEffect, timerEffect, retryEffect, trickEffect];

export const effectLookup = effectRegistry.reduce((registry: Record<string, typeof effectRegistry[0]>, effect) => {
  registry[effect.effectId] = effect;
  return registry;
}, {});
