import { solver } from "./solver.ts";

const {inputData} = await solver(input => input.tokenizeLines(), {
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
