export type CellType = Number & { properties: any };
enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Game {
  over = true;
  score = 0;
  board: CellType[][];

  constructor(public size: number = 4) {
    this.clearBoard();
  }

  forEachCell(fn: (i: number, j: number) => any) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; i < this.size; i++) {
        fn(i, j);
      }
    }
  }

  get rows() {
    return this.board;
  }

  clearBoard() {
    this.over = false;
    this.board = Array(this.size)
      .fill(0)
      .map(_ => Array(this.size).fill(new Number(0))); // eslint-disable-line
    console.debug(this.size, this.board);
  }

  getCell = (i: number, j: number) => {
    return this.board[i][j];
  };

  setCell = (
    i: number,
    j: number,
    value: number,
    properties?: any,
  ): CellType => {
    const n = new Number(value) as CellType; // eslint-disable-line
    n.properties = properties;
    return (this.board[i][j] = n);
  };

  transposeFn = <T>(
    f: (arg1: number, arg2: number, ...rest: any) => T,
  ): typeof f => {
    return (first: number, second: number, ...rest) => {
      return f(second, first, rest);
    };
  };

  collapse = (i: number, dir: number, g, s) => {
    const start = dir > 0 ? 0 : this.size - 1;
    const end = dir < 0 ? 0 : this.size - 1;
    let changed = false;
    let repeat: boolean;

    do {
      repeat = false;
      for (var j = start; j !== end; j += dir) {
        if (+g(i, j) === 0 && +g(i, j + dir) !== 0) {
          s(i, j, +g(i, j + dir));
          s(i, j + dir, 0);
          repeat = true;
          changed = true;
        }
      }
    } while (repeat);
    return changed;
  };

  move = (vertical: boolean, dir: number, test = false) => {
    const start = dir > 0 ? 0 : this.size - 1;
    const end = dir < 0 ? 0 : this.size - 1;
    const g = vertical ? this.transposeFn(this.getCell) : this.getCell;
    const s = vertical ? this.transposeFn(this.setCell) : this.setCell;
    let changed = false;

    for (let i = 0; i < this.size; i++) {
      changed = this.collapse(i, dir, g, s) || changed;

      for (var j = start; j !== end; j += dir) {
        if (+g(i, j) !== 0 && +g(i, j) === +g(i, j + dir)) {
          if (test) return true;
          this.score += 2 * +g(i, j);
          s(i, j, 2 * +g(i, j), { className: 'combined' });
          s(i, j + dir, 0);

          changed = true;
        }
      }

      changed = test || this.collapse(i, dir, g, s) || changed;
    }
    return !test && changed;
  };

  emptyCellsCount = () => {
    let count = 0;
    this.forEachCell((i, j) => {
      const cell = this.getCell(i, j);
      if (+cell === 0) {
        count++;
      }
    });
    return count;
  };

  createCell = () => {
    let count = this.emptyCellsCount();
    let idx = getRandomInt(1, count);
    console.debug(this.board);
    this.forEachCell(function(i, j) {
      const cell = this.getCell(i, j);
      if (+cell === 0) {
        idx--;
        if (idx === 0) {
          this.setCell(i, j, this.getRandomInt(1, 10) === 1 ? 4 : 2, {
            className: 'new',
          });
          count--;
        }
      }
    });

    if (this.gameOver(count)) {
      this.over = true;
    }
  };

  gameOver(emptyCells: number) {
    return (
      emptyCells === 0 &&
      !(this.move(true, 1, true) || this.move(false, 1, true))
    );
  }

  start() {
    this.clearBoard();
    this.createCell();
    return this;
  }

  turn(direction: Direction) {
    let changed = false;

    switch (direction) {
      case Direction.UP:
        changed = this.move(true, 1);
        break;
      case Direction.DOWN:
        changed = this.move(true, -1);
        break;
      case Direction.LEFT:
        changed = this.move(false, 1);
        break;
      case Direction.RIGHT:
        changed = this.move(false, -1);
        break;
    }

    if (changed) {
      this.createCell();
    }
  }

  print() {
    console.debug(this.board);
  }

  /*
  self.on(
    "ArrowUp ArrowDown ArrowRight ArrowLeft swipeup swipedown swipeleft swiperight",
    function(ev) {
      var changed;

      switch (ev) {
        case "ArrowUp":
        case "swipeup":
          changed = move(true, 1);
          break;
        case "ArrowDown":
        case "swipedown":
          changed = move(true, -1);
          break;
        case "ArrowLeft":
        case "swipeleft":
          changed = move(false, 1);
          break;
        case "ArrowRight":
        case "swiperight":
          changed = move(false, -1);
          break;
      }

      if (changed) {
        createCell();
      }
      self.trigger("updateGame");
    }
  );
  */
}
