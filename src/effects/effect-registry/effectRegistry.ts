import { Effect } from '../effectMiddleware';
import { TimerData, timerEffect } from './timerEffect';
import { RetryData, retryEffect } from './retryEffect';
import { shuffleEffect } from './shuffleEffect';

export type EffectData = TimerData | RetryData;
export type EffectRegistry = Record<string, Effect<EffectData>>;
// @ts-ignore
export const effectRegistry: EffectRegistry = {
  [timerEffect.effectId]: timerEffect,
  [retryEffect.effectId]: retryEffect,
  [shuffleEffect.effectId]: shuffleEffect,
};
export type EffectList = Effect<EffectData>[];
export const effectList: EffectList = Object.values(effectRegistry);
