import { argv, cwd } from 'node:process';
import { resolve } from 'node:path';

const toRun = async () => {
  const [nChall] = argv.slice(2);
  const folderName = `./challenge-${nChall}`;

  const runChallenge = (await import(resolve(cwd(), folderName, './solution.ts'))).default as (
    dataFile: string
  ) => void;

  const dataFile = resolve(cwd(), folderName, './data');
  console.log(`Answer to challenge #${nChall} is: `, runChallenge(dataFile));
};

toRun();
