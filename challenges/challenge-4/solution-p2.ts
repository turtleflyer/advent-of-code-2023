import { convertTextToList } from '../../utils/convertTextToList';
import { goThroughCards } from './goThroughCards';

const calculateScratchCardsTotal = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let sum = 0;
  const cardsAcc = new Map<number, number>();
  let countWin = 0;

  goThroughCards(
    list,

    {
      winProc() {
        countWin++;
      },

      linePostProc(cardN, listSize) {
        const amplifier = cardsAcc.get(cardN) ?? 1;

        if (countWin > 0 && cardN < listSize - 1) {
          for (let i = cardN + 1; i <= cardN + countWin && i < listSize; i++) {
            cardsAcc.set(i, (cardsAcc.get(i) ?? 1) + amplifier);
          }
        }

        sum += amplifier;
        countWin = 0;
      },
    }
  );

  return sum;
};

export default calculateScratchCardsTotal;
