import { convertTextToList } from '../../utils/convertTextToList';

const calculateSumOfGearRatios = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let sum = 0;

  list.forEach((line, i) => {
    const pattern = /\*/g;
    let patternResult: RegExpExecArray | null | true = true;

    while (patternResult) {
      if (patternResult !== true) {
        const { index } = patternResult;
        const adjPattern = /(?<=(\d+)?)[^\d](?=(\d+)?)|\d+(?<=(\d+))[^\d]/y;

        const matches = [i - 1, i, i + 1]
          .filter((lN) => lN >= 0 && lN < list.length)
          .map((lN) => {
            adjPattern.lastIndex = index;
            const match = list[lN].match(adjPattern);
            match?.splice(0, 1);

            return match;
          })
          .flat()
          .filter((n) => n != null) as string[];

        if (matches.length === 2) {
          sum += parseInt(matches[0]) * parseInt(matches[1]);
        }
      }

      patternResult = pattern.exec(line);
    }
  });

  return sum;
};

export default calculateSumOfGearRatios;
