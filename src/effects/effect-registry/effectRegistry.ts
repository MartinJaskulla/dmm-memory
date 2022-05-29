import { Effect } from '../effects';
import { timerEffect } from './timerEffect';
import { shuffleEffect } from './shuffleEffect';

type EffectRegistry = Effect[];

export const effectRegistry: EffectRegistry = [timerEffect, shuffleEffect];
