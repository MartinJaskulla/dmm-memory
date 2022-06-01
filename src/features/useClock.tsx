import { useEffect, useRef, useState } from 'react';
import { interval } from '../utils/interval';

const INITIAL_SECONDS = 0;

export function useClock() {
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => () => abortControllerRef.current.abort(), []);

  // useEffect(() => {
  //   abortControllerRef.current = new AbortController();
  //   const msToNextSecond = 1000 - initialDate.getUTCMilliseconds();
  //   interval(msToNextSecond, abortControllerRef.current.signal, () => {
  //     console.count('Only once');
  //     abortControllerRef.current.abort();
  //     abortControllerRef.current = new AbortController();
  //     interval(1000, abortControllerRef.current.signal, () => setSeconds((seconds) => seconds + 1));
  //   });
  //   return () => abortControllerRef.current.abort();
  // }, [initialDate]);

  function restart(msToNextMove: number) {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    interval(msToNextMove, abortControllerRef.current.signal, () => {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      interval(1000, abortControllerRef.current.signal, () => setSeconds((seconds) => seconds + 1));
    });
  }

  // function stop() {
  //   abortControllerRef.current.abort();
  //   setSeconds(INITIAL_SECONDS);
  // }

  // TODO restart() stop() instead
  // TODO Stop clock on gameOver

  return { seconds, restart };
}

/*
   History:
   - Start game (no moves made)
   Mo, 23:22:41:100 00:00 ms-diff 0
   - Move 1 < 1s
   Mo, 23:22:41:800 00:00 ms-diff 700
   - Move 2
   Mo, 23:22:42:500 00:01 ms-diff 1400

   Loading the game the next day and going to move 1
   History:
   - Start game (no moves made)
   Mo, 23:22:41:100 00:00 ms-diff 0
   - Move 1 < 1s
   Mo, 23:22:41:800 00:00 ms-diff 700 (clock should turn to 00:01 after 300ms via setSeconds)
   - Making new move 2
   Mo, 14:13:32:200 ??:?? ms-diff ? (TODO Maybe I need to store 2 timestamps per move? no)

   Clock:
   - When game starts, update seconds every 1000ms independent of history
   - Maybe first update should be treated differently because of time travel
   - When traveling back, how to get the ms diff and how to do the same if you move back a second time?
   - When moving back to move 1, I can get the time diff by move1.time - move0.time = ms (700)  -> First clock update after 300ms (1000 - 700 % 1000)
   - When moving back to move 2, I can get the time diff by move2.time - move0.time = ms (1400) -> First clock update after 600ms (1000 - 1400 % 1000)
   - Is it a problem if I save the current date now, which could be months in the future? Maybe only store milliseconds played?
   - Every time I push I would need to store ms???
   - on newGame() save a ref with gameStart = new Date(), just used for the diff how long the move took?


   Consider moving back in time and that "now" does not work with old snapshot anymore
   I only ever need to get the difference from the first move?
    */
