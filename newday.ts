import { bold } from "https://deno.land/std@0.117.0/fmt/colors.ts";
import { dirname, fromFileUrl } from "https://deno.land/std@0.117.0/path/mod.ts";

const pwd = dirname(fromFileUrl(import.meta.url));
const dir = Deno.readDirSync(pwd);
let lastDay = 0;
for (const f of dir) {
  if (f.isFile) {
    const dayCapture = /day([0-9]+).ts/.exec(f.name);
    if (dayCapture != null) {
      const day = Number(dayCapture[1]);
      lastDay = Math.max(day, lastDay);
    }
  }
}
const newDay = String(lastDay + 1);
console.log(`Creating day ${bold(newDay)}...`);
const newDayFile = `day${newDay}`;
Deno.copyFileSync('template.ts', `${newDayFile}.ts`);
Deno.writeTextFileSync(`inputs/${newDayFile}.txt`, '');
Deno.writeTextFileSync(`inputs/testdata/${newDayFile}.txt`, '');
Deno.writeTextFileSync('README.md', `* [Day ${newDay}](${newDayFile}.ts)\n`, {append: true});
console.log('Done!');
