import { TimerData, timerEffect } from './timerEffect';
import { shuffleEffect } from './shuffleEffect';
import { Effect } from '../effectMiddleware';

export type EffectRegistry = Array<Effect<TimerData> | Effect<OtherData>>;
export const effectRegistry: EffectRegistry = [timerEffect, shuffleEffect];

type OtherData = {
  o: number;
};
