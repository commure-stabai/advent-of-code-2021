import { allInputTokenParser, solve } from "./helpers.ts";

await solve({
  baseFileName: 'day7',

  parser: allInputTokenParser({
    parseFn: Number,
  }),

  expectedTestResults: {
    part1: 37,
    part2: 168,
  },

  part1: inputs => {
    const min = Math.min(...inputs.parsed);
    const max = Math.max(...inputs.parsed);
    let lowestCost: number|undefined;
    for (let i = min; i <= max; i++) {
      const cost = calculateFuelCostConstant(inputs.parsed, i);
      if (lowestCost == null || cost < lowestCost) {
        lowestCost = cost;
      }
    }
    return lowestCost;
  },

  part2: inputs => {
    const min = Math.min(...inputs.parsed);
    const max = Math.max(...inputs.parsed);
    let lowestCost: number|undefined;
    for (let i = min; i <= max; i++) {
      const cost = calculateFuelCostIncreasing(inputs.parsed, i);
      if (lowestCost == null || cost < lowestCost) {
        lowestCost = cost;
      }
    }
    return lowestCost;
  },
});

function calculateFuelCostConstant(positions: number[], alignedPosition: number) {
  let cost = 0;
  positions.forEach(n => cost += Math.abs(alignedPosition - n));
  return cost;
}
function calculateFuelCostIncreasing(positions: number[], alignedPosition: number) {
  let cost = 0;
  positions.forEach(n => cost += triangular(Math.abs(alignedPosition - n)));
  return cost;
}
function triangular(n: number) {
  // https://en.wikipedia.org/wiki/Triangular_number
  return n * (n + 1) / 2;
}
