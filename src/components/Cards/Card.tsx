import React, {ReactNode} from 'react';
import {useState} from 'react';
import {useSpring, animated} from 'react-spring';

// TODO Remove ts-ignore

interface CardArgs {
    front: ReactNode;
    back: ReactNode;
}
// TODO Issue is the hover effect. it is only applied of the card is interactive e.g. effect card cannot be turned back.

// React spring animations are interruptible, which is nice if you flip 3rd card 2nd animations stops
export function Card({front, back}: CardArgs) {
    // flipped as input
    const [flipped, set] = useState(false);
    const {transform, opacity} = useSpring({
        opacity: flipped ? 1 : 0,
        transform: `perspective(3000px) rotateY(${flipped ? 180 : 0}deg)`,
        config: {mass: 5, tension: 500, friction: 80},
    });
    return (
        <div
            onClick={() => set((state) => !state)}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            {/* @ts-ignore */}
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