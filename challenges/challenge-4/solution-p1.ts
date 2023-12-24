import { convertTextToList } from '../../utils/convertTextToList';
import { goThroughCards } from './goThroughCards';

const calculateWinPoints = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let rank = 0;
  let sum = 0;

  goThroughCards(
    list,

    {
      winProc: () => {
        rank = Math.max(rank, 1 / 2) * 2;
      },

      linePostProc: () => {
        sum += rank;
        rank = 0;
      },
    }
  );

  return sum;
};

export default calculateWinPoints;
