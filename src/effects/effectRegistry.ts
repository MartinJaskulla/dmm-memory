import { shuffleEffect } from 'src/effects/effects/shuffleEffect';
import { timerEffect } from 'src/effects/effects/timerEffect';
import { retryEffect } from 'src/effects/effects/retryEffect';
import { trickEffect } from 'src/effects/effects/trickEffect';

export const effectList = [shuffleEffect, timerEffect, retryEffect, trickEffect];

export const effectLookup = effectList.reduce((registry: Record<string, typeof effectList[0]>, effect) => {
  registry[effect.effectId] = effect;
  return registry;
}, {});
