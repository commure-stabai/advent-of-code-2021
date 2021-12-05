import { analyzeInput, lineRegexCaptureParser } from "./helpers.ts";

const input = await analyzeInput({
  baseFileName: 'day5',
  parser: lineRegexCaptureParser({
    regex: /([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/,
    parseFn: captures => ({
        from: {x: Number(captures[1]), y: Number(captures[2])},
        to: {x: Number(captures[3]), y: Number(captures[4])},
      }
    ),
  }),
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
