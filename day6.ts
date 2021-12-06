import { allInputTokenParser, solve, sumIterable } from "./helpers.ts";

await solve({
  baseFileName: 'day6',

  parser: allInputTokenParser({parseFn: Number}),

  expectedTestResults: {
    part1: 5934,
    part2: 26984457539,
  },

  part1: inputs => {
    const ages = inputs.parsed;
    for (let day = 0; day < 80; day++) {
      const preexistingFish = ages.length;
      for (let i = 0; i < preexistingFish; i++) {
        ages[i]--;
        if (ages[i] < 0) {
          ages[i] += 7;
          ages.push(8);
        }
      }
    }
    return ages.length;
  },
  part2: inputs => {
    const fish = new Map<number, number>();
    inputs.parsed.forEach(num => {
      const before = fish.get(num) ?? 0;
      fish.set(num, before + 1);
    });
    for (let day = 0; day < 256; day++) {
      const births = fish.get(0) ?? 0;
      fish.set(0, 0);
      for (let i = 1; i <= 8; i++) {
        const num = fish.get(i) ?? 0;
        fish.set(i, 0);
        fish.set(i - 1, num);
      }
      const ageSix = fish.get(6) ?? 0;
      fish.set(6, ageSix + births);  // parents resetting spawn cycle
      fish.set(8, births);  // offspring starting life
    }
    return sumIterable(fish.values());
  },
});
