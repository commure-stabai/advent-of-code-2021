import {
  bold,
  underline,
  red,
  green,
} from "https://deno.land/std@0.117.0/fmt/colors.ts";

export type ParseFn<O, I = string> = (value: I, index?: number, array?: Array<I>) => O;

export const DEFAULT_NONTOKEN_PATTERN = /\W+/;

type InputParser<T> = AllInputParser<T>|AllTokenInputParser<T>|LineInputParser<T>|LineRegexCaptureInputParser<T>|LineTokenInputParser<T>;
interface AllInputParser<T> {
  mode: 'all';
  parseFn: ParseFn<T[], string>;
}
interface AllTokenInputParser<T> {
  mode: 'allToken';
  parseFn: ParseFn<T, string>;
}
interface LineInputParser<T> {
  mode: 'line';
  parseFn: ParseFn<T, string>;
}
interface LineRegexCaptureInputParser<T> {
  mode: 'lineRegexCapture';
  regex: RegExp;
  parseFn: ParseFn<T, string[]>;
}
interface LineTokenInputParser<T> {
  mode: 'lineToken';
  parseFn: ParseFn<T, string[]>;
}

export async function getInput(baseName: string): Promise<string> {
  return await Deno.readTextFile(`./inputs/${baseName}.txt`);
}
export async function getInputLines(baseName: string): Promise<Array<string>> {
  const input = await getInput(baseName);
  return input.split('\n');
}
export async function getTokenizedInputLines(baseName: string, nontokenPattern = DEFAULT_NONTOKEN_PATTERN): Promise<Array<Array<string>>> {
  const inputLines = await getInputLines(baseName);
  return inputLines.map(l => {
    const trimmed = l.trim();
    return trimmed.length === 0 ? [] : trimmed.split(nontokenPattern);
  });
}
export async function getParsedInputLines<T>(baseName: string, parseFn: (value: string, index: number, array: Array<string>) => T): Promise<Array<T>> {
  const inputLines = await getInputLines(baseName);
  return inputLines.map(parseFn);
}

export async function analyzeInput<T = never>(options: InputAnalysisOptions<T>, forTest = false): Promise<Inputs<T>> {
  const nontokenPattern = options.nontokenPattern ?? DEFAULT_NONTOKEN_PATTERN
  const baseFileName = forTest ? `testdata/${options.baseFileName}` : options.baseFileName;
  const raw = await getInput(baseFileName);
  const lines = splitLines(raw);
  const allTokens = tokenize(raw, nontokenPattern);
  const lineTokens = tokenizeAll(lines, nontokenPattern);
  let parsed: T[] = [];
  const parser = options.parser;
  if (parser != null) {
    switch (parser.mode) {
      case "all":
        parsed = parser.parseFn(raw);
        break;
      case "allToken":
        parsed = allTokens.map(parser.parseFn);
        break;
      case "line":
        parsed = lines.map(parser.parseFn);
        break;
      case "lineRegexCapture":
        parsed = lines.map(l => parser.regex.exec(l) ?? []).map(c => parser.parseFn(c));
        break;
      case "lineToken":
        parsed = lineTokens.map(parser.parseFn);
        break;
    }
  }
  return {raw, lines, lineTokens, allTokens, parsed};
}

export function allInputParser<T>(options: Omit<AllInputParser<T>, 'mode'>): AllInputParser<T> {
  return {mode: 'all', ...options};
}

export function allInputTokenParser<T>(options: Omit<AllTokenInputParser<T>, 'mode'>): AllTokenInputParser<T> {
  return {mode: 'allToken', ...options};
}

export function lineParser<T>(options: Omit<LineInputParser<T>, 'mode'>): LineInputParser<T> {
  return {mode: 'line', ...options};
}

export function lineRegexCaptureParser<T>(options: Omit<LineRegexCaptureInputParser<T>, 'mode'>): LineRegexCaptureInputParser<T> {
  return {mode: 'lineRegexCapture', ...options};
}

export function lineTokenParser<T>(options: Omit<LineTokenInputParser<T>, 'mode'>): LineTokenInputParser<T> {
  return {mode: 'lineToken', ...options};
}

export async function solve<T = never>(options: SolveOptions<T>) {
  if (options.expectedTestResults != null) {
    const inputs = JSON.stringify(await analyzeInput(options, true));
    const part1 = options.part1(JSON.parse(inputs));
    const part2 = options.part2(JSON.parse(inputs));
    const part1Passed = String(part1) === String(options.expectedTestResults.part1);
    const part2Passed = String(part2) === String(options.expectedTestResults.part2);
    const part1PassStr = part1Passed ? green('PASS') : red('FAIL');
    const part2PassStr = part2Passed ? green('PASS') : red('FAIL');
    console.log(bold(underline('Tests:')));
    console.log('Output:', {part1, part2});
    console.log(`Part 1 status: ${part1PassStr}`);
    console.log(`Part 2 status: ${part2PassStr}`);
    console.log();
  }
  const inputs = JSON.stringify(await analyzeInput(options, false));
  const part1 = options.part1(JSON.parse(inputs));
  const part2 = options.part2(JSON.parse(inputs));
  console.log(bold(underline('Results:')));
  console.log({part1, part2});
}

export interface SolveOptions<P = never> extends InputAnalysisOptions<P> {
  expectedTestResults?: {part1: unknown, part2: unknown};
  part1: (input: Inputs<P>) => unknown;
  part2: (input: Inputs<P>) => unknown;
}

export interface Inputs<P = never> {
  raw: string;
  lines: Array<string>;
  allTokens: Array<string>;
  lineTokens: Array<Array<string>>;
  parsed: Array<P>;
}

export interface InputAnalysisOptions<P = never> {
  baseFileName: string;
  parser?: InputParser<P>;
  nontokenPattern?: RegExp;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((previous, current) => previous + current);
}

export function sumIterable(numbers: IterableIterator<number>): number {
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum;
}

export function splitLines(input: string): Array<string> {
  return input.split('\n');
}

export function tokenize(line: string, nontokenPattern = DEFAULT_NONTOKEN_PATTERN): Array<string> {
  return line.trim().split(nontokenPattern);
}

export function tokenizeAll(lines: string[], nontokenPattern = DEFAULT_NONTOKEN_PATTERN): Array<Array<string>> {
  return lines.map(l => tokenize(l, nontokenPattern));
}

/**
 * @deprecated
 * Use {@link analyzeInput} or {@link getParsedInputLines}.
 */
export function parseInput<T>(input: string, parseFn: ParseFn<T, string[]>, nontokenPattern = DEFAULT_NONTOKEN_PATTERN): T[] {
  const parsed: T[] = [];
  for (const line of splitLines(input)) {
    const tokens = tokenize(line, nontokenPattern);
    parsed.push(parseFn(tokens));
  }
  return parsed;
}
