import { getInput } from "./helpers.ts";

const input = await getInput('day3');
const inputLines = input.split('\n');

function part1() {
  const commonBits = [];
  for (let i = 0; i < inputLines[0].length; i++) {
    commonBits.push([0, 0]);
  }
  for (const line of inputLines) {
    for (let i = 0; i < line.length; i++) {
      const bit = Number(line[i]);
      commonBits[i][bit]++;
    }
  }
  let gamma = '';
  let epsilon = '';
  for (const bits of commonBits) {
    gamma += bits[0] > bits[1] ? 0 : 1;
    epsilon += bits[0] > bits[1] ? 1 : 0;
  }
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

function part2() {
  let oxygen = [...inputLines];
  for (let i = 0; i < inputLines[0].length; i++) {
    const digitOn = oxygen.filter(l => l[i] === '1').length;
    const digitOff = oxygen.filter(l => l[i] === '0').length;
    const commonDigit = digitOn >= digitOff ? '1' : '0';
    oxygen = oxygen.filter(l => l[i] === commonDigit);
    if (oxygen.length === 1) {
      break;
    }
  }
  let co2 = [...inputLines];
  for (let i = 0; i < inputLines[0].length; i++) {
    const digitOn = co2.filter(l => l[i] === '1').length;
    const digitOff = co2.filter(l => l[i] === '0').length;
    const commonDigit = digitOn >= digitOff ? '1' : '0';
    co2 = co2.filter(l => l[i] !== commonDigit);
    if (co2.length === 1) {
      break;
    }
  }
  const oxygenRating = parseInt(oxygen[0], 2);
  const co2Rating = parseInt(co2[0], 2);
  return oxygenRating * co2Rating;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
