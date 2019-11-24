import { default as React, useReducer } from 'react';
import ReactDOM from 'react-dom';

import './styles.css';
import { Board } from './Board';
import { Game } from './game';

function App() {
  const [game, turn] = useReducer(
    (game, direction) => {
      game.turn(direction);
      return game;
    },
    4,
    size => new Game(4).start(),
  );
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <Board game={game} />
      <button onClick={() => turn('DOWN')}>down</button>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
