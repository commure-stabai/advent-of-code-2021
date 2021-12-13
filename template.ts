import { Input, solver } from "./solver.ts";

function inputParser(input: Input) {
  return input.tokenizeLines();
}

const {inputData} = await solver(inputParser, {
  expectedTestResults: {
    part1: '',
    part2: '',
  },

  part1: input => {
    console.log(input.parsed);
  },

  part2: input => {
  },
});
