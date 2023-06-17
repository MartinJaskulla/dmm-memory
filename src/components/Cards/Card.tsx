import React, { ReactNode } from 'react';
import { useSpring, animated } from 'react-spring';

/*
React spring animations are interruptible. For example:
- Flip card 1
- Flip non-matching card 2
- Flip card 3. Card 1 and 2 are un-flipped. If the animation of card 2 has not finished,
it will stop in-place and smoothly transition to the reverse un-flipping animation.
 */

interface CardArgs {
  front: ReactNode;
  back: ReactNode;
  flipped: boolean;
}

export function Card({ front, back, flipped }: CardArgs) {
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(3000px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <animated.div
        style={{
          backfaceVisibility: 'hidden',
          willChange: 'opacity',
          opacity: opacity.interpolate((o) => 1 - o),
          transform,
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        {front}
      </animated.div>
      <animated.div
        style={{
          backfaceVisibility: 'hidden',
          willChange: 'opacity',
          opacity,
          transform: transform.interpolate((t) => `${t} rotateY(180deg)`),
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        {back}
      </animated.div>
    </div>
  );
}
