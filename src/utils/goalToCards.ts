import { GETGoal } from './getGoal';
import { shuffle } from './shuffle';
import { EffectCardProps } from '../components/Cards/EffectCard';

// TODO Maybe we change <BoardProps["cards"]> to just two types and add state revealed?
// For now put it in context with one property being boardsCards and one property gameCards
interface GameCardMatchable {
  type: 'matchable';
  id: number;
  text: string;
  language: 'en' | 'ja';
}

type GameCardEffect = EffectCardProps;

export type GameCard = GameCardMatchable | GameCardEffect;

export function goalToCards(goal: GETGoal): GameCard[] {
  const cards: GameCard[] = [
    { type: 'effect', effect: 'shuffle' },
    { type: 'effect', effect: 'retry' },
    { type: 'effect', effect: 'timer' },
    { type: 'effect', effect: 'trick' },
  ];
  const goalItems: GETGoal['goal_items'] = structuredClone(goal.goal_items);
  shuffle(goalItems);
  const randomGoalItems = goalItems.slice(0, 6);
  randomGoalItems.forEach((item) => {
    cards.push({
      type: 'matchable',
      id: item.item.id,
      text: item.item.cue.text,
      language: item.item.cue.language,
    });
    cards.push({
      type: 'matchable',
      id: item.item.id,
      text: item.item.response.text,
      language: item.item.response.language,
    });
  });
  shuffle(cards);
  return cards;
}

// Another function that maps cards to game state of hidden
// each effect once. get 12 cards
