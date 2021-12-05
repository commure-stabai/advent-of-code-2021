import {
  bold,
  underline,
  red,
  green,
} from "https://deno.land/std@0.117.0/fmt/colors.ts";

export type ParseFn<O, I = string> = (value: I, index?: number, array?: Array<I>) => O;

export const DEFAULT_NONTOKEN_PATTERN = /\W+/;

type InputParser<T> = LineInputParser<T>|LineRegexCaptureInputParser<T>|TokenInputParser<T>;
interface LineInputParser<T> {
  mode: 'line';
  parseFn: ParseFn<T, string>;
}
interface LineRegexCaptureInputParser<T> {
  mode: 'lineRegexCapture';
  regex: RegExp;
  parseFn: ParseFn<T, string[]>;
}
interface TokenInputParser<T> {
  mode: 'token';
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
  const tokens = tokenizeAll(lines, nontokenPattern);
  let parsed: T[] = [];
  const parser = options.parser;
  if (parser != null) {
    switch (parser.mode) {
      case "line":
        parsed = lines.map(parser.parseFn);
        break;
      case "lineRegexCapture":
        parsed = lines.map(l => parser.regex.exec(l) ?? []).map(c => parser.parseFn(c));
        break;
      case "token":
        parsed = tokens.map(parser.parseFn);
        break;
    }
  }
  return {raw, lines, tokens, parsed};
}

export function lineParser<T>(options: Omit<LineInputParser<T>, 'mode'>): LineInputParser<T> {
  return {mode: 'line', ...options};
}

export function lineRegexCaptureParser<T>(options: Omit<LineRegexCaptureInputParser<T>, 'mode'>): LineRegexCaptureInputParser<T> {
  return {mode: 'lineRegexCapture', ...options};
}

export function tokenParser<T>(options: Omit<TokenInputParser<T>, 'mode'>): TokenInputParser<T> {
  return {mode: 'token', ...options};
}

export async function solve<T = never>(options: SolveOptions<T>) {
  if (options.expectedTestResults != null) {
    const inputs = await analyzeInput(options, true);
    const part1 = options.part1(inputs);
    const part2 = options.part2(inputs);
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
  const inputs = await analyzeInput(options, false);
  const part1 = options.part1(inputs);
  const part2 = options.part2(inputs);
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
  tokens: Array<Array<string>>;
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

export function splitLines(input: string): Array<string> {
  return input.split('\n');
}

export function tokenizeLine(line: string, nontokenPattern = DEFAULT_NONTOKEN_PATTERN): Array<string> {
  return line.trim().split(nontokenPattern);
}

export function tokenizeAll(lines: string[], nontokenPattern = DEFAULT_NONTOKEN_PATTERN): Array<Array<string>> {
  return lines.map(l => tokenizeLine(l, nontokenPattern));
}

/**
 * @deprecated
 * Use {@link analyzeInput} or {@link getParsedInputLines}.
 */
export function parseInput<T>(input: string, parseFn: ParseFn<T, string[]>, nontokenPattern = DEFAULT_NONTOKEN_PATTERN): T[] {
  const parsed: T[] = [];
  for (const line of splitLines(input)) {
    const tokens = tokenizeLine(line, nontokenPattern);
    parsed.push(parseFn(tokens));
  }
  return parsed;
}
