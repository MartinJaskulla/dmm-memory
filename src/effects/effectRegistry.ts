import { shuffleEffect } from './effects/shuffleEffect';
import { timerEffect } from './effects/timerEffect';
import { retryEffect } from './effects/retryEffect';
import { trickEffect } from './effects/trickEffect';

export const effectList = [shuffleEffect, timerEffect, retryEffect, trickEffect];

export const effectLookup = effectList.reduce((registry: Record<string, typeof effectList[0]>, effect) => {
  registry[effect.effectId] = effect;
  return registry;
}, {});
