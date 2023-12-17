import { assert } from 'console';
import { convertTextToList } from '../../utils/convertTextToList';

const CONFIG = { red: 12, green: 13, blue: 14 };

const determineValidGames = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let count = 0;

  list.forEach((line, i) => {
    const pattern = /(?<=Game )\d+|\d+(?= (red|green|blue))/g;
    let nGame = 0;
    let valid = true;
    let n: number;
    let key: 'red' | 'green' | 'blue' | undefined;

    while (valid) {
      const patternResult = pattern.exec(line);

      if (!patternResult) break;

      wasPatternSearchValid(i, patternResult);
      n = parseInt(patternResult[0]);
      key = patternResult[1];

      if (key == null) {
        nGame = n;

        continue;
      }

      n > CONFIG[key] && (valid = false);
    }

    valid && (count += nGame);
  });

  return count;
};

function wasPatternSearchValid(
  lineN: number,
  result: RegExpExecArray
): asserts result is RegExpExecArray & [`${number}`, 'red' | 'green' | 'blue' | undefined] {
  assert(
    !isNaN(parseInt(result[0])) &&
      (result[1] === undefined || Object.keys(CONFIG).some((key) => result[1] === key)),
    `Error in line ${lineN}`
  );
}

export default determineValidGames;
