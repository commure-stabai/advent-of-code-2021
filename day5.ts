import { analyzeInput } from "./helpers.ts";

interface Point {
  x: number;
  y: number;
}

interface Line {
  from: Point;
  to: Point;
}

const input = await analyzeInput({
  baseFileName: 'day5',
  parser: {
    mode: "lines",
    parseFn: t => {
      const matches = /([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/.exec(t)!;
      return {
        from: {x: Number(matches[1]), y: Number(matches[2])},
        to: {x: Number(matches[3]), y: Number(matches[4])},
      } as Line;
    },
  },
});

function createGrid() {
  const grid: Array<Array<number>> = [];
  const row: Array<number> = [];
  for (let i = 0; i < 1000; i++) {
    row.push(0);
  }
  for (let i = 0; i < 1000; i++) {
    grid.push([...row]);
  }
  return grid;
}

function part1() {
  const grid = createGrid();
  for (const line of input.parsed) {
    const yStep = Math.sign(line.to.y - line.from.y);
    const xStep = Math.sign(line.to.x - line.from.x);
    let y = line.from.y;
    let x = line.from.x;
    grid[y][x]++;
    while (y !== line.to.y || x !== line.to.x) {
      y += yStep;
      x += xStep;
      grid[y][x]++;
    }
  }
  let count = 0;
  grid.forEach(row => count += row.filter(num => num > 1).length);
  return {grid, count};
}

function part2() {
}

console.log({
  part1: part1(),
  part2: part2(),
});
