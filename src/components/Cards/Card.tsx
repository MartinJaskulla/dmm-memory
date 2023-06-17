import React, { ReactNode, useRef } from 'react';
import { useState } from 'react';
import { useSpring, animated } from 'react-spring';

// TODO Remove ts-ignore

interface CardArgs {
  front: ReactNode;
  back: ReactNode;
}

export function CardWithoutHover({ front, back }: CardArgs) {
  const [flipped, set] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(3000px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });
  return (
    <div onClick={() => set((state) => !state)}>
      {/* @ts-ignore */}
      <animated.div
        style={{
          backfaceVisibility: 'hidden',
          willChange: 'opacity',
          opacity: opacity.interpolate((o) => 1 - o),
          transform,
          position: 'absolute',
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
        }}
      >
        {back}
      </animated.div>
    </div>
  );
}

export function Card({ front, back }: CardArgs) {
  const ref = useRef<HTMLDivElement>(null);
  const [props, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40 } }));
  const calc = (x: number, y: number) => {
    if (!ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const xCenter = (box.left + box.right) / 2;
    const yCenter = (box.top + box.bottom) / 2;
    const grow = 1.1;
    // Smaller -> more tilt
    const tilt = 10;
    const r = [-(y - yCenter) / tilt, (x - xCenter) / tilt, grow];
    return r;
  };
  const trans = (x: number, y: number, s: number) =>
    `perspective(3000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
  return (
    <div ref={ref} style={{ width: '150px', height: '300px' }}>
      <animated.div
        onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
        onMouseLeave={() => set({ xys: [0, 0, 1] })}
        // @ts-ignore
        style={{ transform: props.xys.interpolate(trans), willChange: 'transform' }}
      >
        <CardWithoutHover front={front} back={back}></CardWithoutHover>
      </animated.div>
    </div>
  );
}
