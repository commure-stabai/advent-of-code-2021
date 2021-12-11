import { countRecursive, lineParser, solve } from "./helpers.ts";

await solve({
  baseFileName: 'day11',

  parser: lineParser({
    parseFn: line => line.split('').map(Number),
  }),

  expectedTestResults: {
    part1: 1656,
    part2: 195,
  },

  part1: inputs => {
    const octopi = inputs.parsed;
    let flashes = 0;
    for (let i = 0; i < 100; i++) {
      flashes += step(octopi);
    }
    return flashes;
  },

  part2: inputs => {
    const octopi = inputs.parsed;
    const targetFlashes = countRecursive(octopi);
    let flashes = 0;
    let stepCount = 0;
    while (flashes < targetFlashes) {
      stepCount++;
      flashes = step(octopi);
    }
    return stepCount;
  },
});

function step(octopi: number[][]): number {
  const flashed: string[] = [];
  for (let y = 0; y < octopi.length; y++) {
    for (let x = 0; x < octopi[y].length; x++) {
      charge(octopi, flashed, x, y);
    }
  }
  return flashed.length;
}

function charge(octopi: number[][], flashed: string[], x: number, y: number) {
  const key = JSON.stringify({x, y});
  if (flashed.includes(key)) {
    return;
  }

  const energy = octopi[y][x] + 1;
  if (energy <= 9) {
    octopi[y][x] = energy;
  } else {
    flashed.push(key);
    octopi[y][x] = 0;
    for (let flashY = Math.max(0, y - 1); flashY <= Math.min(octopi.length - 1, y + 1); flashY++) {
      for (let flashX = Math.max(0, x - 1); flashX <= Math.min(octopi[flashY].length - 1, x + 1); flashX++) {
        charge(octopi, flashed, flashX, flashY);
      }
    }
  }
}
