import React, { useRef } from 'react';
import { CellType, Game } from './game';
import { useSpring, animated, config } from 'react-spring';

const Cell = ({ cell, x, y }: { cell: CellType; x: number; y: number }) => {
  const props = useSpring({
    from: {
      zIndex: 200,
      opacity: 0.3,
      transform: `translateX(${16 * x}vh) translateY(${16 * y}vh) scale(2) `,
      boxShadow: `0 1vh 1vh rgba(0,0,0,.1)`,
    },
    to: {
      zIndex: 100,
      opacity: 1,
      transform: `translateX(${16 * x}vh) translateY(${16 * y}vh) scale(1)`,
      boxShadow: `0 0.2vh 0.5vh rgba(0,0,0,.4)`,
    },
    config: {...config.stiff, mass: 0.7},
  });
  return (
    <>
      {cell && (
        <animated.div
          style={{
            position: 'absolute',
            ...props,
          }}
          className={`cell cell-${cell && cell.value}`}
        >
          {cell && cell.value}
        </animated.div>
      )}

      <div
        style={{
          zIndex: 0,
          position: 'absolute',
          transform: `scale(1) translateX(${16 * x}vh) translateY(${16 *
            y}vh)`,
        }}
        className="cell"
      />
    </>
  );
};

export const Board = ({ game }: { game: Game }) => {
  return (
    <div className={`game-board ${game.over && 'game-over'}`}>
      {game.cells.map((cell, i) => (
        <Cell
          key={cell ? cell.id : `null-${i}`}
          cell={cell}
          x={i % game.size}
          y={Math.floor(i / game.size)}
        />
      ))}
      {game.over && <div className="game-over-msg">Game over</div>}
    </div>
  );
};
