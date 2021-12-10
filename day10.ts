import { solve, lineParser } from "./helpers.ts";

await solve({
  baseFileName: 'day10',

  parser: lineParser({
    parseFn: line => line.split(''),
  }),

  expectedTestResults: {
    part1: 26397,
    part2: 288957,
  },

  part1: inputs => {
    let score = 0;
    for (const line of inputs.parsed) {
      const state = [];
      for (const char of line) {
        if (isOpener(char)) {
          state.push(char);
          continue;
        }
        const lastOpener = state.pop() ?? '';
        if (!matchesOpener(lastOpener, char)) {
          score += getScore(char);
          break;
        }
      }
    }
    return score;
  },

  part2: inputs => {
    const scores: number[] = [];
    for (const line of inputs.parsed) {
      const state = [];
      let score = 0;
      for (const char of line) {
        if (isOpener(char)) {
          state.push(char);
          continue;
        }
        const lastOpener = state.pop() ?? '';
        if (!matchesOpener(lastOpener, char)) {
          state.splice(0);
          break;
        }
      }
      while (state.length > 0) {
        score *= 5;
        switch (state.pop()) {
          case '(':
            score += 1;
            break;
          case '[':
            score += 2;
            break;
          case '{':
            score += 3;
            break;
          case '<':
            score += 4;
            break;
        }
      }
      if (score > 0) {
        scores.push(score);
      }
    }
    const sortedScores = scores.sort((a, b) => a - b);
    return sortedScores[Math.floor(sortedScores.length / 2)];
  },
});

function isOpener(char: string) {
  switch (char) {
    case '(':
    case '[':
    case '{':
    case '<':
      return true;
    default:
      return false;
  }
}

function matchesOpener(opener: string, closer: string) {
  switch (opener) {
    case '(':
      return closer === ')';
    case '[':
      return closer === ']';
    case '{':
      return closer === '}';
    case '<':
      return closer === '>';
    default:
      return false;
  }
}

function getScore(char: string) {
  switch (char) {
    case ')':
      return 3;
    case ']':
      return 57;
    case '}':
      return 1197;
    case '>':
      return 25137;
    default:
      return 0;
  }
}
