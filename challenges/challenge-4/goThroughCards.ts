export const goThroughCards = (
  list: string[],
  {
    winProc,
    linePostProc,
  }: { winProc: () => void; linePostProc: (cardN: number, listSize: number) => void }
) => {
  list.forEach((line, i) => {
    const [, _wins, _draw] = line.split(/Card\s+\d+:\s+| \| /);
    const [wins, draw] = [_wins, _draw].map((nums) => nums.split(/\s+/));
    const drawSet = new Set<string>();
    let index = 0;

    wins.forEach((n) => {
      if (drawSet.has(n)) {
        winProc();

        return;
      }

      while (index < draw.length) {
        const newN = draw[index];
        index++;
        drawSet.add(newN);

        if (n === newN) {
          winProc();

          return;
        }
      }
    });

    linePostProc(i, list.length);
  });
};
