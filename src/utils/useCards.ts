import React, { useEffect, useState } from 'react';
import { goalToCards } from './goalToCards';
import { GameContextValue } from '../contexts/gameContext';

export interface Transliterations {
  Hira?: string;
  Hrkt?: string;
  Latn?: string;
  Jpan?: string;
}

export interface GETGoal {
  id: number;
  created_at: string;
  updated_at: string;
  published_at: string;
  is_community: boolean;
  title: string;
  description: string;
  difficulty_level: number;
  cue_language: string;
  response_language: string;
  icon: string;
  items_count: number;
  sentences_count: number;
  users_count: number;
  series: {
    id: number;
    name: string;
    short_description: string;
  };
  author: {
    username: string;
    name: string;
    image: string;
  };
  rights: {
    open: boolean;
    private: boolean;
  };
  goal_items: {
    item: {
      id: number;
      type: string;
      cue: {
        text: string;
        image?: string | null;
        language: 'en' | 'ja';
        part_of_speech: string;
        transcription: string;
        transliterations: Transliterations;
      };
      response: {
        text: string;
        language: 'en' | 'ja';
        transliterations: Transliterations;
      };
    };
    position: number;
    sound: string;
    sentences: {
      position: number;
      cue: {
        id: number;
        language: string;
        text: string;
      };
      response: {
        id: number;
        language: string;
        text: string;
        transliterations: Transliterations;
      };
      image: string;
      sound: string;
    }[];
    annotation: string;
    distractors: {
      cue: {
        text: string;
        language: string;
        transcription: string;
        transliterations: Transliterations;
      }[];
      response: {
        text: string;
        language: string;
        transliterations: Transliterations;
      }[];
    };
  }[];
}

type Cards = GameContextValue['cards'];

export function useCards(defaultValue: Cards): [Cards, React.Dispatch<React.SetStateAction<Cards>>] {
  const [cards, setCards] = useState<Cards>(defaultValue);
  useEffect(() => {
    const abortController = new AbortController();

    fetch('./goal.json', {
      signal: abortController.signal,
    })
      .then((response) => response.json())
      .then((json: GETGoal) => setCards(goalToCards(json)))
      .catch((error) => {
        // Ignore aborted requests, but rethrow real errors
        if (!abortController.signal.aborted) throw error;
      });

    // React 18 is rendering useEffect twice: https://www.youtube.com/watch?v=j8s01ThR7bQ
    // Instead of using a ref or global variable to check if a request was already made, use a proper cleanup function
    return function cancel() {
      abortController.abort();
    };
  }, []);
  return [cards, setCards];
}
