import React from 'react';
import { Header } from './components/Header';
import { Board, BoardProps } from './components/Board';

const cards: BoardProps['cards'] = [
  {
    type: 'hidden',
  },
  {
    type: 'matched',
    text: 'Hello',
    language: 'en',
  },
  {
    type: 'revealed',
    text: '英会',
    language: 'ja',
  },
  {
    type: 'effect',
    effect: 'trick',
  },
  {
    type: 'hidden',
  },
  {
    type: 'matched',
    text: 'Dog',
    language: 'en',
  },
  {
    type: 'hidden',
  },
  {
    type: 'effect',
    effect: 'trick',
  },
  {
    type: 'hidden',
  },
  {
    type: 'effect',
    effect: 'trick',
  },
  {
    type: 'matched',
    text: '英会',
    language: 'ja',
  },
  {
    type: 'matched',
    text: '会',
    language: 'ja',
  },
  {
    type: 'hidden',
  },
  {
    type: 'hidden',
  },
  {
    type: 'hidden',
  },
  {
    type: 'effect',
    effect: 'trick',
  },
];

function App() {
  return (
    <>
      <Header></Header>
      <Board cards={cards}></Board>
    </>
  );
}

export default App;
