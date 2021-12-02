export async function getInput(baseName: string): Promise<string> {
  return await Deno.readTextFile(`./inputs/${baseName}.txt`);
}

export function sum(numbers: number[]): number {
  return numbers.reduce((previous, current) => previous + current);
}

export function parseInput<T>(input: string, parseFn: (items: string[]) => T): T[] {
  const parsed: T[] = [];
  for (const line of input.split('\n')) {
    const tokens = line.split(' ');
    parsed.push(parseFn(tokens));
  }
  return parsed;
}
