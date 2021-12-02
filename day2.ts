import { getInput, sum } from "./helpers.ts";

const input = await getInput('day2');
const inputLines = input.split('\n');

function part1(): number {
  const position = {
    depth: 0,
    horizontal: 0,
  };
  for (const line of inputLines) {
    const [direction, magnitudeStr] = line.split(' ');
    const magnitude = Number(magnitudeStr);
    switch (direction) {
      case 'forward':
        position.horizontal += magnitude;
        break;
      case 'down':
        position.depth += magnitude;
        break;
      case 'up':
        position.depth -= magnitude;
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
  for (const line of inputLines) {
    const [direction, magnitudeStr] = line.split(' ');
    const magnitude = Number(magnitudeStr);
    switch (direction) {
      case 'forward':
        position.horizontal += magnitude;
        position.depth += position.aim * magnitude;
        break;
      case 'down':
        position.aim += magnitude;
        break;
      case 'up':
        position.aim -= magnitude;
        break;
    }
  }
  return position.depth * position.horizontal;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
