import { green,red,bold,blue,underline,yellow } from "https://deno.land/std@0.117.0/fmt/colors.ts";
import { detectBaseFileName, getInput, tokenizeAll } from "./helpers.ts";

export class Input {
  private inputLines: string[]|undefined;

  constructor(public readonly raw: string) {}

  lines(): string[] {
    const array = this.inputLines ?? (this.inputLines = this.raw.split('\n'));
    return [...array];
  }

  tokenizeLines(nontokenPattern?: RegExp): string[][] {
    return tokenizeAll(this.lines(), nontokenPattern);
  }

  regexLines(regex: RegExp): RegExpExecArray[] {
    const results = this.lines().map(line => regex.exec(line));
    return results.filter(value => value != null) as RegExpExecArray[];
  }
}

export interface ParsedInput<T> {
  raw: string;
  lines: string[];
  parsed: T;
}

export type Parser<T> = (input: Input) => T;

export const unparsedInput: Parser<undefined> = () => undefined;

export interface SolverOptions<P> {
  expectedTestResults?: {part1: unknown, part2: unknown};
  part1: (input: ParsedInput<P>) => unknown;
  part2: (input: ParsedInput<P>) => unknown;
}

async function prepareInput<T>(parser?: Parser<T>, forTest = false): Promise<ParsedInput<T>> {
  const baseFileName = detectBaseFileName();
  const fileName = forTest ? `testdata/${baseFileName}` : baseFileName;
  const raw = await getInput(fileName);
  const inputHelper = new Input(raw);
  const prepared = {raw, lines: inputHelper.lines()}
  if (parser != null) {
    return {...prepared, parsed: parser(inputHelper)};
  } else {
    return {...prepared, parsed: raw as unknown as T};
  }
}

export interface Solved<I> {
  inputData: ParsedInput<I>;
}

export async function solver<I>(parser: Parser<I>, options: SolverOptions<I>): Promise<Solved<I>> {
  let part1Passed = true;
  let part2Passed = true;
  let inputData = {} as ParsedInput<I>;
  if (options.expectedTestResults != null) {
    inputData = await prepareInput(parser, true);
    const part1 = await options.part1(inputData);
    const part2 = await options.part2(inputData);
    const part1ActualText = JSON.stringify(part1) ?? 'undefined';
    const part2ActualText = JSON.stringify(part2) ?? 'undefined';
    const part1ExpectedText = JSON.stringify(options.expectedTestResults.part1) ?? 'undefined';
    const part2ExpectedText = JSON.stringify(options.expectedTestResults.part2) ?? 'undefined';
    part1Passed = part1ActualText === part1ExpectedText;
    part2Passed = part2ActualText === part2ExpectedText;
    const part1PassStr = part1Passed ? green('PASS') : `${red('FAIL')} expected ${bold(blue(part1ExpectedText))}, got ${bold(red(part1ActualText))}`;
    const part2PassStr = part2Passed ? green('PASS') : `${red('FAIL')} expected ${bold(blue(part2ExpectedText))}, got ${bold(red(part2ActualText))}`;
    console.log(bold(underline('Tests:')));
    console.log('Output:', {part1, part2});
    console.log(`Part 1 status: ${part1PassStr}`);
    console.log(`Part 2 status: ${part2PassStr}`);
    console.log();
  }
  if (!part1Passed || !part2Passed) {
    console.log(yellow('Actual run suppressed because test failed.'));
  }
  if (!part1Passed && !part2Passed) {
    return {inputData};
  }
  inputData = await prepareInput(parser, false);
  const results: {part1?: unknown, part2?: unknown} = {};
  if (part1Passed) {
    results.part1 = await options.part1(inputData);
  }
  if (part2Passed) {
    results.part2 = await options.part2(inputData);
  }
  console.log(bold(underline('Results:')));
  console.log(results);
  return {inputData};
}
