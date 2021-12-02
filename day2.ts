import { getInput, parseInput } from "./helpers.ts";

const input = await getInput('day2');
const parsedInput = parseInput(input, tokens => ({direction: tokens[0], magnitude: Number(tokens[1])}));

function part1(): number {
  const position = {
    depth: 0,
    horizontal: 0,
  };
  for (const record of parsedInput) {
    switch (record.direction) {
      case 'forward':
        position.horizontal += record.magnitude;
        break;
      case 'down':
        position.depth += record.magnitude;
        break;
      case 'up':
        position.depth -= record.magnitude;
        break;
    }
  }
  return position.depth * position.horizontal;
}

function part2(): number {
  const position = {
    depth: 0,
    horizontal: 0,
    aim: 0,
  };
  for (const record of parsedInput) {
    switch (record.direction) {
      case 'forward':
        position.horizontal += record.magnitude;
        position.depth += position.aim * record.magnitude;
        break;
      case 'down':
        position.aim += record.magnitude;
        break;
      case 'up':
        position.aim -= record.magnitude;
        break;
    }
  }
  return position.depth * position.horizontal;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
