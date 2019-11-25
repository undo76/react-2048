import * as React from 'react';
import { CellType, Game, Direction } from './game';

const Cell = ({ cell }: { cell: CellType }) => (
  <div className={`cell cell-${+cell}`}>{+cell}</div>
);

export const Board = ({ game }: { game: Game }) => {
  return (
    <div className="game-board">
      {game.board.map((row, i) => (
        <div key={i}>
          {row.map((cell, j) => (
            <Cell key={j} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};
