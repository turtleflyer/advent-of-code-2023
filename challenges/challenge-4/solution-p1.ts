import { convertTextToList } from '../../utils/convertTextToList';

const calculateWinPoints = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let sum = 0;

  list.forEach((line) => {
    const [, _wins, _draw] = line.split(/Card\s+\d+:\s+| \| /);
    const [wins, draw] = [_wins, _draw].map((nums) => nums.split(/\s+/));
    const drawSet = new Set<string>();
    let index = 0;
    let rank = 0;

    const increaseRank = () => {
      rank = Math.max(rank, 1 / 2) * 2;
    };

    wins.forEach((n) => {
      if (drawSet.has(n)) {
        increaseRank();

        return;
      }

      while (index < draw.length) {
        const newN = draw[index];
        index++;
        drawSet.add(newN);

        if (n === newN) {
          increaseRank();

          return;
        }
      }
    });

    sum += rank;
  });

  return sum;
};

export default calculateWinPoints;
