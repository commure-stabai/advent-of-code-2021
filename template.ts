import { solve } from "./helpers.ts";

await solve({
  baseFileName: '',

  // nontokenPattern: /\W+/,

  // parser: lineRegexCaptureParser({
  //   regex: /([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)/,
  //   parseFn: captures => ({
  //       from: {x: Number(captures[1]), y: Number(captures[2])},
  //       to: {x: Number(captures[3]), y: Number(captures[4])},
  //   }),
  // }),

  // parser: lineParser({
  //   parseFn: line => line.split(' => ').map(s => s.split(',').map(t => ({
  //     from: {x: Number(t[0][0]), y: Number(t[0][1])},
  //     to: {x: Number(t[1][0]), y: Number(t[1][1])},
  //   }))),
  // }),

  // parser: tokenParser({
  //   parseFn: tokens => ({
  //     from: {x: Number(tokens[0]), y: Number(tokens[1])},
  //     to: {x: Number(tokens[2]), y: Number(tokens[3])},
  //   }),
  // }),

  expectedTestResults: {
    part1: '',
    part2: '',
  },

  part1: inputs => {},
  part2: inputs => {},
});
