import { default as React, useReducer, useCallback } from 'react';
import ReactDOM from 'react-dom';

import './styles.less';

import { Board } from './Board';
import { Game, Direction } from './game';
import { useKeyDown } from './useKeyDown';
import { useHammer } from './useHammer';

const reducer = (state: { game: Game }, action: Direction | 'NEW') => {
  switch (action) {
    case 'NEW':
      state.game.start();
      break;
    default:
      state.game.turn(action);
      break;
  }
  return { ...state };
};

function App() {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    game: new Game(4).start(),
  }));

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
      }
    },
    [dispatch],
  );

  useKeyDown(commandCallback);
  useHammer(commandCallback);

  return (
    <div className="game">
      <header className="header">
        <h1 className="title">2048</h1>
        <div className="score">
          <h4>Score</h4>
          {state.game.score}
        </div>
      </header>
      <Board game={state.game} />
      <footer className="footer">Made with love by @undo76</footer>
      <button onClick={() => dispatch('NEW')}>New Game</button>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
