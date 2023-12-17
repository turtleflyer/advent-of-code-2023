import { assert } from 'console';
import { convertTextToList } from '../../utils/convertTextToList';

const calculateSumInEngineSchematic = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let sum = 0;

  list.forEach((line, i) => {
    const pattern = /\d+/g;
    let patternResult: RegExpExecArray | null | true = true;

    while (patternResult) {
      if (patternResult !== true) {
        wasPatternSearchValid(i, patternResult);
        const { [0]: n, index } = patternResult;
        const { lastIndex } = pattern;
        const adjPatter1 = RegExp(`.{0,${lastIndex - index + 1}}[^.\\d]`, 'y');
        const adjPatter2 = /[^.\d]/y;

        const isToAdd =
          [i - 1, i + 1]
            .filter((ln) => ln >= 0 && ln < list.length)
            .some((ln) => {
              const adjL = list[ln];
              adjPatter1.lastIndex = index - 1;

              return adjPatter1.test(adjL);
            }) ||
          [index - 1, lastIndex].some((p) => {
            adjPatter2.lastIndex = p;

            return adjPatter2.test(line);
          });

        isToAdd && (sum += parseInt(n));
      }

      patternResult = pattern.exec(line);
    }
  });

  return sum;
};

function wasPatternSearchValid(
  lineN: number,
  result: RegExpExecArray
): asserts result is RegExpExecArray & [`${number}`] {
  assert(!isNaN(parseInt(result[0])), `Error in line ${lineN}`);
}

export default calculateSumInEngineSchematic;
