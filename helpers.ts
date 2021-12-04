export type ParseFn<O, I = string> = (value: I, index?: number, array?: Array<I>) => O;

export const DEFAULT_NONTOKEN_PATTERN = /\W+/;

type InputParser<T> = LineInputParser<T>|TokenInputParser<T>;
interface LineInputParser<T> {
  mode: 'lines';
  parseFn: ParseFn<T, string>;
}
interface TokenInputParser<T> {
  mode: 'tokens';
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

export async function analyzeInput<T = never>(options: InputAnalysisOptions<T>): Promise<Inputs<T>> {
  const nontokenPattern = options.nontokenPattern ?? DEFAULT_NONTOKEN_PATTERN
  const raw = await getInput(options.baseFileName);
  const lines = splitLines(raw);
  const tokens = tokenizeAll(lines, nontokenPattern);
  let parsed: T[] = [];
  if (options.parser != null) {
    switch (options.parser.mode) {
      case "lines":
        parsed = lines.map(options.parser.parseFn);
        break;
      case "tokens":
        parsed = tokens.map(options.parser.parseFn);
        break;
    }
  }
  return {raw, lines, tokens, parsed};
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
