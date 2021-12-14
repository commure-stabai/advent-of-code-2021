import { Input, solver } from "./solver.ts";

function inputParser(input: Input) {
  const lines = input.lines();
  const template = lines[0];
  const mappings = new Map<string, string>();
  for (let i = 2; i < lines.length; i++) {
    const match = /([A-Z]{2}) -> ([A-Z])/.exec(lines[i]) ?? [];
    mappings.set(match[1], match[2]);
  }
  return {template, mappings};
}

await solver(inputParser, {
  expectedTestResults: {
    part1: 1588,
    part2: 2188189693529,
  },

  part1: input => {
    return expandPolymer(input.parsed.template, input.parsed.mappings, 10);
  },

  part2: input => {
    return expandPolymer(input.parsed.template, input.parsed.mappings, 40);
  },
});

function expandPolymer(formula: string, mappings: Map<string, string>, times: number) {
  const counts = countPairsRecursive(formula, mappings, times);
  const lowHigh = getLowAndHigh(counts);
  return lowHigh.high - lowHigh.low;
}

function countPairsRecursive(formula: string, mappings: Map<string, string>, times: number): Map<string, number> {
  const map = new Map<string, number>();
  const cache = new Map<string, string>();
  incrementCounterMap(map, formula[0]);
  for (let i = 1; i < formula.length; i++) {
    const last = formula[i - 1];
    const curr = formula[i];
    incrementCounterMap(map, curr);
    const record = countPairsRecursiveBranch(last + curr, mappings, times, cache);
    increaseCounterMapByRecord(map, record);
  }
  return map;
}

function countPairsRecursiveBranch(formula: string, mappings: Map<string, string>, times: number, cache: Map<string, string>): Record<string, number> {
  if (times <= 0) {
    return {};
  }
  const cacheKey = JSON.stringify({formula, times});
  const cachedString = cache.get(cacheKey);
  if (cachedString != null) {
    return JSON.parse(cachedString) as Record<string, number>;
  }
  const last = formula[0];
  const curr = formula[1];
  const newElement = mappings.get(last + curr) ?? '?';
  const counts = countPairsRecursiveBranch(last + newElement, mappings, times - 1, cache);
  const otherCounts = countPairsRecursiveBranch(newElement + curr, mappings, times - 1, cache);
  addCounterRecords(counts, otherCounts);
  const value = counts[newElement] ?? 0;
  counts[newElement] = value + 1;
  cache.set(cacheKey, JSON.stringify(counts));
  return counts;
}

// function insertPairs(formula: string, mappings: Map<string, string>) {
//   let newFormula = formula[0];
//   for (let i = 1; i < formula.length; i++) {
//     const pair = formula.substr(i - 1, 2);
//     const newElement = mappings.get(pair);
//     newFormula += newElement + formula[i];
//   }
//   return newFormula;
// }

function getLowAndHigh(map: Map<string,number>) {
  let low: number|undefined;
  let high: number|undefined;
  for (const qty of map.values()) {
    if (low == null || qty < low) {
      low = qty;
    }
    if (high == null || qty > high) {
      high = qty;
    }
  }
  return {low: low!, high: high!};
}

function incrementCounterMap(map: Map<string, number>, key: string, by = 1) {
  const value = map.get(key) ?? 0;
  map.set(key, value + by);
}

function increaseCounterMapByRecord(map: Map<string, number>, record: Record<string, number>) {
  for (const key in record) {
    incrementCounterMap(map, key, record[key]);
  }
}

function addCounterRecords(resultRecord: Record<string, number>, otherRecord: Record<string, number>) {
  for (const key in otherRecord) {
    const value = resultRecord[key] ?? 0;
    resultRecord[key] = value +otherRecord[key];
  }
}
