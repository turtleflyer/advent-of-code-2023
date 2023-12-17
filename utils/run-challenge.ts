import { accessSync } from 'node:fs';
import { resolve } from 'node:path';
import { argv, cwd } from 'node:process';

const toRun = async () => {
  const [dayN, partN] = [
    ['--day', '-d'],
    ['--part', '-p'],
  ].map((keys) =>
    argv
      .slice(2)
      .find(
        (possibleDay, i, args) =>
          !isNaN(parseInt(possibleDay)) && i > 0 && keys.some((key) => args[i - 1] === key)
      )
  );

  const folderName = `./challenges/challenge-${dayN}`;

  const filePath = (
    partN === '1' || partN == null
      ? ['./solution.ts', './solution-p1.ts']
      : [`./solution-p${partN}.ts`]
  )
    .map((path) => {
      try {
        const resolvedPath = resolve(cwd(), folderName, path);
        accessSync(resolvedPath);

        return resolvedPath;
      } catch {
        return null;
      }
    })
    .find((possiblePath) => possiblePath != null)!;

  const runChallenge = (await import(filePath)).default as (dataFile: string) => void;

  const inputData = resolve(cwd(), folderName, './input');
  const partNIndeed = filePath.replace(/.*solution-p(\d+).*/, '$1');

  console.log(
    `Answer to challenge of day ${dayN}${partNIndeed ? ` (part ${partNIndeed})` : ''} is:`,
    runChallenge(inputData)
  );
};

toRun();
