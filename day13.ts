import { Input, solver } from "./solver.ts";
import { ObjectSet } from "./types.ts";

interface Point {
  x: number;
  y: number;
}

interface Fold {
  along: 'x'|'y';
  at: number;
}

interface Paper {
  width: number;
  height: number;
  points: ObjectSet<Point>;
  dots: boolean[][];
}

function inputParser(input: Input) {
  const points = new ObjectSet<Point>();
  const folds: Fold[] = [];
  for (const line of input.lines()) {
    const point = /([0-9]+),([0-9]+)/.exec(line);
    if (point != null) {
      points.add({x: Number(point[1]), y: Number(point[2])});
      continue;
    }
    const fold = /fold along ([xy])=([0-9]+)/.exec(line);
    if (fold != null) {
      folds.push({along: fold[1] as 'x'|'y', at: Number(fold[2])});
    }
  }
  return {points, folds};
}

await solver(inputParser, {
  expectedTestResults: {
    part1: 17,
    part2: undefined,
  },

  part1: input => {
    const paper = makePaper(input.parsed.points);
    const fold1 = fold(paper, input.parsed.folds[0]);
    return fold1.points.size;
  },

  part2: input => {
    let paper = makePaper(input.parsed.points);
    for (const f of input.parsed.folds) {
      paper = fold(paper, f);
    }
    console.log(paper.dots.map(a => a.map(b => b ? '#' : ' ').join('')).join('\n'));
  },
});

function initPaper(points: ObjectSet<Point>): Paper {
  const actualWidth = Math.max(...points.toArray().map(p => p.x));
  const actualHeight = Math.max(...points.toArray().map(p => p.y));
  const dots = makeDots(actualWidth, actualHeight);
  return {width: actualWidth, height: actualHeight, points, dots};
}

function makeDots(width: number, height: number): boolean[][] {
  const dots: boolean[][] = [];
  for (let i = 0; i <= height; i++) {
    const row: boolean[] = [];
    for (let j = 0; j <= width; j++) {
      row.push(false);
    }
    dots.push(row);
  }
  return dots;
}

function makePaper(points: ObjectSet<Point>): Paper {
  const paper = initPaper(points);
  for (const point of points) {
    paper.dots[point.y][point.x] = true;
  }
  return paper;
}

function fold(paper: Paper, fold: Fold) {
  const alongX = fold.along === 'x';
  const alongY = fold.along === 'y';
  const points = new ObjectSet<Point>();
  for (const point of paper.points) {
    if (point[fold.along] === fold.at) {
      continue;
    }
    const x = (alongY || point.x < fold.at) ? point.x : 2 * fold.at - point.x;
    const y = (alongX || point.y < fold.at) ? point.y : 2 * fold.at - point.y;
    points.add({x, y});
  }
  return makePaper(points);
}
