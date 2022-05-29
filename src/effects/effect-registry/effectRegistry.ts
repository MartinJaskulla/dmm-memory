import { Effect } from '../effects';
import { timerEffect } from './timerEffect';

type EffectRegistry = Effect[];

export const effectRegistry: EffectRegistry = [timerEffect];
