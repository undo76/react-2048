import { default as React, useReducer, useCallback } from 'react';
import ReactDOM from 'react-dom';

import './styles.less';

import { Board } from './Board';
import { Game, Direction } from './game';
import { useKeyDown } from './useKeyDown';
import { useHammer } from './useHammer';

function App() {
  const [state, dispatch] = useReducer(
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

  const commandCallback = useCallback(
    key => {
      switch (key) {
        case 'ArrowUp':
        case 'swipeup':
          dispatch(Direction.UP);
          break;
        case 'ArrowDown':
        case 'swipedown':
          dispatch(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'swipeleft':
          dispatch(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'swiperight':
          dispatch(Direction.RIGHT);
          break;
        default:
          dispatch(key);
          break;
      }
    },
    [dispatch],
  );

  useKeyDown(commandCallback);
  useHammer(commandCallback);

  return (
    <div className="game">
      <Board game={state.game} />
      <div className="score">Score: {state.game.score}</div>
      {state.game.over && <div className="game-over">Game over</div>}
      <button onClick={() => commandCallback('NEW')}>New Game</button>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
