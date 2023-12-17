import { assert } from 'console';
import { convertTextToList } from '../../utils/convertTextToList';

const CONFIG = { red: 12, green: 13, blue: 14 };

const calculatePower = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let power = 0;

  list.forEach((line, i) => {
    const pattern = /\d+(?= (red|green|blue))/g;
    const maxs = { red: 0, green: 0, blue: 0 };
    let patternResult: RegExpExecArray | null | true = true;

    while (patternResult) {
      if (patternResult !== true) {
        wasPatternSearchValid(i, patternResult);
        const [n, key] = patternResult;
        maxs[key] = Math.max(maxs[key], parseInt(n));
      }

      patternResult = pattern.exec(line);
    }

    power += Object.values(maxs).reduce((accPwr, n) => accPwr * n);
  });

  return power;
};

function wasPatternSearchValid(
  lineN: number,
  result: RegExpExecArray
): asserts result is RegExpExecArray & [`${number}`, 'red' | 'green' | 'blue'] {
  assert(
    !isNaN(parseInt(result[0])) && Object.keys(CONFIG).some((key) => result[1] === key),
    `Error in line ${lineN}`
  );
}

export default calculatePower;
