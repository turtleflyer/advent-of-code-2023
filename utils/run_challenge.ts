import { resolve } from 'node:path';
import { argv, cwd } from 'node:process';

const toRun = async () => {
  const [nChall] = argv.slice(2);
  const folderName = `./challenge-${nChall}`;

  const runChallenge = (await import(resolve(cwd(), folderName, './solution.ts'))).default as (
    dataFile: string
  ) => void;

  const inputData = resolve(cwd(), folderName, './input.txt');
  console.log(`Answer to challenge #${nChall} is: `, runChallenge(inputData));
};

toRun();
