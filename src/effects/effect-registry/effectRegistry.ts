import { TimerData, timerEffect } from './timerEffect';
import { Effect } from '../effectMiddleware';
import { shuffleEffect } from './shuffleEffect';

export type EffectData = TimerData; // | OtherData
export type EffectRegistry = Record<string, Effect<EffectData>>;
export const effectRegistry: EffectRegistry = {
  [timerEffect.effectId]: timerEffect,
  [shuffleEffect.effectId]: shuffleEffect,
};
export type EffectList = Effect<TimerData>[];
export const effectList: EffectList = Object.values(effectRegistry);
