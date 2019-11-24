import { default as React, useReducer, useCallback } from 'react';
import ReactDOM from 'react-dom';

import './styles.less';

import { Board } from './Board';
import { Game, Direction } from './game';
import { useKeyDown } from './useKeyDown';

function App() {
  const [state, turn] = useReducer(
    (state, action) => {
      switch (action) {
        case 'NEW':
          state.game.start();
          break;
        default:
          state.game.turn(action);
          break;
      }
      return { ...state };
    },
    4,
    size => ({
      game: new Game(size).start(),
    }),
  );

  useKeyDown(
    useCallback(
      key => {
        switch (key) {
          case 'ArrowUp':
            turn(Direction.UP);
            break;
          case 'ArrowDown':
            turn(Direction.DOWN);
            break;
          case 'ArrowLeft':
            turn(Direction.LEFT);
            break;
          case 'ArrowRight':
            turn(Direction.RIGHT);
            break;
        }
      },
      [turn],
    ),
  );

  return (
    <div className="game">
      <Board game={state.game} />
      <div className="score">Score: {state.game.score}</div>
      {state.game.over && <div className="game-over">Game over</div>}
      <button onClick={() => turn('NEW')}>New Game</button>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
