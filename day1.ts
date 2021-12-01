import { getInput, sum } from "./helpers.ts";

const input = await getInput('day1');
const inputLines = input.split('\n');
const inputNumbers = inputLines.map(l => Number(l));

function part1(): number {
  let last: number|undefined;
  let increaseCount = 0;
  for (const num of inputNumbers) {
    if (last != null && num > last) {
      increaseCount++;
    }
    last = num;
  }
  return increaseCount;
}

function part2(): number {
  const slidingWindow: number[] = [];
  let lastSum: number|undefined;
  let increaseCount = 0;
  for (const num of inputNumbers) {
    slidingWindow.push(num);
    if (slidingWindow.length < 3) {
      continue;
    }
    while (slidingWindow.length > 3) {
      slidingWindow.shift();
    }
    const newSum = sum(slidingWindow);
    if (lastSum != null && newSum > lastSum) {
      increaseCount++;
    }
    lastSum = newSum;
  }
  return increaseCount;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
