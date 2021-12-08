import { lineParser, solve } from "./helpers.ts";

await solve({
  baseFileName: 'day8',

  nontokenPattern: /\s+/,

  parser: lineParser({
    parseFn: line => {
      const [allInput, allOutput] = line.split(' | ');
      const input = allInput.split(' ');
      const output = allOutput.split(' ');
      return {input, output};
    },
  }),

  expectedTestResults: {
    part1: 26,
    part2: 61229,
  },

  part1: inputs => {
    let targetCount = 0;
    for (const item of inputs.parsed) {
      for (const output of item.output) {
        switch (output.length) {
          case 2:
          case 3:
          case 4:
          case 7:
            targetCount++;
            break;
        }
      }
    }
    return targetCount;
  },
  part2: inputs => {
    let outputSum = 0;
    for (const item of inputs.parsed) {
      const segments: Record<string, string> = {a: 'abcdefg', b: 'abcdefg', c: 'abcdefg', d: 'abcdefg', e: 'abcdefg', f: 'abcdefg', g: 'abcdefg'};
      for (const digit of [...item.input, ...item.output]) {
        switch (digit.length) {
          case 2:
            makesDigit(digit, segments, 'abdeg', 'cf');
            break;
          case 3:
            makesDigit(digit, segments, 'bdeg', 'acf');
            break;
          case 4:
            makesDigit(digit, segments, 'aeg', 'bcdf');
            break;
        }
      }
      // "bd cf eg a cf"
      // item: "cefdb",
      // segments: { a: "eg", b: "cf", c: "bd", d: "a", e: "cf", f: "eg", g: "bd" }
      let output = '';
      for (const digit of item.output) {
        switch (digit.length) {
          case 2:
            output += 1;
            break;
          case 3:
            output += 7;
            break;
          case 4:
            output += 4;
            break;
          case 5: // 235
            output += guessFiveSegment(segments, digit);
            break;
          case 6: // 069
            output += guessSixSegment(segments, digit);
            break;
          case 7:
            output += 8;
            break;
        }
      }
      outputSum += Number(output);
    }
    return outputSum;
  },
});

function makesDigit(digit: string, segments: Record<string,string>, canNotBe: string, canBe: string) {
  for (const s in segments) {
    if (digit.includes(s)) {
      segments[s] = segments[s].replaceAll(new RegExp(`[${canNotBe}]`, 'g'), '');
    } else {
      segments[s] = segments[s].replaceAll(new RegExp(`[${canBe}]`, 'g'), '');
    }
  }
}

function guessFiveSegment(segments: Record<string,string>, item: string): string {
  let possibleValues = '235';
  let possibleSegments = '';
  let definiteSegments = '';
  const combos: Record<string, number> = {};
  for (const char of item) {
    const possibleForChar = segments[char];
    for (const p of possibleForChar) {
      if (!possibleSegments.includes(p)) {
        possibleSegments += p;
      }
    }
    if (possibleForChar.length === 1) {
      definiteSegments += possibleForChar;
    } else {
      const previousCombos = combos[possibleForChar] ?? 0;
      combos[possibleForChar] = previousCombos + 1;
      if (combos[possibleForChar] === possibleForChar.length) {
        definiteSegments += possibleForChar;
      }
    }
  }
  if (definiteSegments.includes('e')) {
    return '2';
  }
  if (definiteSegments.includes('b')) {
    possibleValues = possibleValues.replaceAll('2', '');
    possibleValues = possibleValues.replaceAll('3', '');
  }
  if (definiteSegments.includes('c')) {
    possibleValues = possibleValues.replaceAll('5', '');
  }
  if (definiteSegments.includes('f')) {
    possibleValues = possibleValues.replaceAll('2', '');
  }
  if (!possibleSegments.includes('c') && !possibleSegments.includes('e')) {
    return '5';
  } else if (!possibleSegments.includes('b') && !possibleSegments.includes('f')) {
    return '2';
  } else if (!possibleSegments.includes('b') && !possibleSegments.includes('e')) {
    return '3';
  }
  return possibleValues.length === 1 ? possibleValues : 'a';
}

function guessSixSegment(segments: Record<string,string>, item: string): string {
  let possibleValues = '069';
  let possibleSegments = '';
  let definiteSegments = '';
  const combos: Record<string, number> = {};
  for (const char of item) {
    const possibleForChar = segments[char];
    for (const p of possibleForChar) {
      if (!possibleSegments.includes(p)) {
        possibleSegments += p;
      }
    }
    if (possibleForChar.length === 1) {
      definiteSegments += possibleForChar;
    } else {
      const previousCombos = combos[possibleForChar] ?? 0;
      combos[possibleForChar] = previousCombos + 1;
      if (combos[possibleForChar] === possibleForChar.length) {
        definiteSegments += possibleForChar;
      }
    }
  }
  if (definiteSegments.includes('d')) {
    possibleValues = possibleValues.replaceAll('0', '');
  }
  if (definiteSegments.includes('c')) {
    possibleValues = possibleValues.replaceAll('6', '');
  }
  if (definiteSegments.includes('e')) {
    possibleValues = possibleValues.replaceAll('9', '');
  }
  return possibleValues.length === 1 ? possibleValues : 'b';}
