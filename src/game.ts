export type CellType = Number & { properties?: any; n: number };

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

enum Traversal {
  Forward,
  Backwards,
}

enum Axis {
  Horizontal,
  Vertical,
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Game {
  over = true;
  score = 0;
  board!: CellType[][];

  constructor(public size: number = 4) {
    this.clearBoard();
  }

  forEachCell(fn: (i: number, j: number) => any) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        fn(i, j);
      }
    }
  }

  get rows() {
    return this.board;
  }

  clearBoard() {
    this.over = false;
    this.score = 0;
    this.board = new Array(this.size);
    for (var i = 0; i < this.size; i++) {
      this.board[i] = new Array(this.size);
      for (var j = 0; j < this.size; j++) {
        this.setCell(i, j, 0);
      }
    }
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
    n.n = value;
    return (this.board[i][j] = n);
  };

  transposeFn = <T>(
    f: (first: number, second: number, ...rest: any[]) => T,
  ): typeof f => {
    return (first, second, ...rest) => {
      return f(second, first, ...rest);
    };
  };

  backwardsFn = <T>(
    f: (first: number, second: number, ...rest: any[]) => T,
  ): typeof f => {
    return (first, second, ...rest) => {
      return f(first, this.size - second - 1, ...rest);
    };
  };

  collapse = (i: number, g: any, s: any) => {
    let changed = false;
    let repeat: boolean;

    do {
      repeat = false;
      for (let j = 0; j < this.size - 1; j++) {
        if (+g(i, j) === 0 && +g(i, j + 1) !== 0) {
          s(i, j, +g(i, j + 1));
          s(i, j + 1, 0);
          repeat = true;
          changed = true;
        }
      }
    } while (repeat);
    return changed;
  };

  move = (axis: Axis, traversal: Traversal, test = false) => {
    let g = this.getCell;
    let s = this.setCell;

    if (axis === Axis.Vertical) {
      g = this.transposeFn(g);
      s = this.transposeFn(s);
    }

    if (traversal === Traversal.Backwards) {
      g = this.backwardsFn(g);
      s = this.backwardsFn(s);
    }

    let changed = false;
    for (let i = 0; i < this.size; i++) {
      changed = this.collapse(i, g, s) || changed;
      for (let j = 0; j < this.size - 1; j++) {
        if (+g(i, j) !== 0 && +g(i, j) === +g(i, j + 1)) {
          if (test) return true;
          this.score += +g(i, j) * 2;
          s(i, j, +g(i, j) * 2, { className: 'combined' });
          s(i, j + 1, 0);
          changed = true;
        }
      }
      if(!test) {
        changed = this.collapse(i, g, s) || changed;
      }
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
    this.forEachCell((i, j) => {
      const cell = this.getCell(i, j);
      if (+cell === 0) {
        idx--;
        if (idx === 0) {
          this.setCell(i, j, getRandomInt(1, 10) === 1 ? 4 : 2, {
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
      !(
        this.move(Axis.Vertical, Traversal.Forward, true) ||
        this.move(Axis.Horizontal, Traversal.Forward, true)
      )
    );
  }

  start() {
    this.clearBoard();
    this.createCell();
    return this;
  }

  turn(direction: Direction) {
    console.log(direction);
    let changed = false;

    switch (direction) {
      case Direction.UP:
        changed = this.move(Axis.Vertical, Traversal.Forward);
        break;
      case Direction.DOWN:
        changed = this.move(Axis.Vertical, Traversal.Backwards);
        break;
      case Direction.LEFT:
        changed = this.move(Axis.Horizontal, Traversal.Forward);
        break;
      case Direction.RIGHT:
        changed = this.move(Axis.Horizontal, Traversal.Backwards);
        break;
    }

    if (changed) {
      this.createCell();
    }
    this.print();
  }

  print() {
    console.log(
      this.rows
        .map(row => row.map(c => (+c + '').padStart(5, ' ')).join('  '))
        .join('\n'),
    );
  }
}
