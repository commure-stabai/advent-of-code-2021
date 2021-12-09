import { lineParser, product, solve, sum } from "./helpers.ts";

await solve({
  baseFileName: 'day9',

  parser: lineParser({
    parseFn: line => line.split('').map(Number),
  }),

  expectedTestResults: {
    part1: 15,
    part2: 1134,
  },

  part1: inputs => {
    const lowPoints: number[] = [];
    for (let y = 0; y < inputs.parsed.length; y++) {
      const line = inputs.parsed[y];
      for (let x = 0; x < line.length; x++) {
        const value = line[x];
        let lowerNeighbor = false;
        lowerNeighbor = lowerNeighbor || (y > 0 && inputs.parsed[y - 1][x] <= value);
        lowerNeighbor = lowerNeighbor || (y < inputs.parsed.length - 1 && inputs.parsed[y + 1][x] <= value);
        lowerNeighbor = lowerNeighbor || (x > 0 && line[x - 1] <= value);
        lowerNeighbor = lowerNeighbor || (x < line.length - 1 && line[x + 1] <= value);
        if (!lowerNeighbor) {
          lowPoints.push(value);
        }
      }
    }
    const risks = lowPoints.map(p => p + 1);
    return sum(risks);
  },

  part2: inputs => {
    const basinSizes: number[] = [];
    const basinIndices: string[] = [];
    for (let y = 0; y < inputs.parsed.length; y++) {
      const line = inputs.parsed[y];
      for (let x = 0; x < line.length; x++) {
        const basinSize = indexBasin(inputs.parsed, basinIndices, x, y);
        if (basinSize > 0) {
          basinSizes.push(basinSize);
        }
      }
    }
    const sortedBasinSizes = basinSizes.sort((a, b) => b - a);  // descending
    return product(sortedBasinSizes.slice(0, 3));
  },
});

function indexBasin(data: number[][], basinIndices: string[], x: number, y: number): number {
  if (data[y][x] === 9 || basinIndices.includes(JSON.stringify({x, y}))) {
    return 0;
  }
  let count = 1;  // this cell
  basinIndices.push(JSON.stringify({x, y}));
  if (x > 0) {
    count += indexBasin(data, basinIndices, x - 1, y);
  }
  if (x < data[y].length - 1) {
    count += indexBasin(data, basinIndices, x + 1, y);
  }
  if (y > 0) {
    count += indexBasin(data, basinIndices, x, y - 1);
  }
  if (y < data.length - 1) {
    count += indexBasin(data, basinIndices, x, y + 1);
  }
  return count;
}
