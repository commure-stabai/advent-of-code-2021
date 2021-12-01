export async function getInput(baseName: string): Promise<string> {
  return await Deno.readTextFile(`./inputs/${baseName}.txt`);
}

export function sum(numbers: number[]): number {
  return numbers.reduce((previous, current) => previous + current);
}