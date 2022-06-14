import { Effect } from '../effectMiddleware';
import { shuffleEffect } from './shuffleEffect';
import { TimerData, timerEffect } from './timerEffect';
import { RetryData, retryEffect } from './retryEffect';
import { trickEffect } from './trickEffect';

export type EffectData = TimerData | RetryData;
export type EffectRegistry = Record<string, Effect<EffectData>>;
// @ts-ignore
export const effectRegistry: EffectRegistry = {
  [shuffleEffect.effectId]: shuffleEffect,
  [timerEffect.effectId]: timerEffect,
  [retryEffect.effectId]: retryEffect,
  [trickEffect.effectId]: trickEffect,
};
export type EffectList = Effect<EffectData>[];
export const effectList: EffectList = Object.values(effectRegistry);
