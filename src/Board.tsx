import * as React from 'react';
import { CellType, Game } from './game';
import { useSpring, useTransition, animated } from 'react-spring';
import { usePrevious } from './usePrevious';

const Cell = ({ cell }: { cell: CellType }) => {
  const previous = usePrevious(cell);
  const props = useSpring({
    opacity: 1,
    transform: `scale(1)`,
    from: {
      opacity: 0,
      transform: `scale(0.1)`,
    },
    config: { duration: 50 },
  });
  return cell ? (
    <animated.div
      style={props}
      className={`cell cell-${cell && cell.value} ${previous != cell &&
        'combined'}`}
    >
      {cell && cell.value}
    </animated.div>
  ) : (
    <div className="cell" />
  );
};

const AnimatedCell = animated(Cell);

export const Board = ({ game }: { game: Game }) => {
  return (
    <div className="game-board">
      {game.cells.map((cell, i) => (
        <AnimatedCell key={cell ? cell.id : `null-${i}`} cell={cell} />
      ))}
    </div>
  );
};
