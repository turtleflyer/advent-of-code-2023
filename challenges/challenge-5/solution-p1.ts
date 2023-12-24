import { convertTextToList } from '../../utils/convertTextToList';

const calculateMinLocation = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let context = -1;

  type MapWithRanges = Map<number, { mapped: number; range: number }>;
  type ContextRecord = { map: MapWithRanges; sortedBreakpoints: number[] };

  const contextsMap: Record<number, ContextRecord> = {};
  const seeds: number[] = [];

  list.forEach((line, i) => {
    if (/^(\d+\s*){3}$/.test(line)) {
      const [mapped, input, range] = line.split(/\s+/).map((ns) => parseInt(ns));
      contextsMap[context].map.set(input, { mapped, range });

      if (i < list.length - 1) return;
    }

    context++;

    if (context === 0) {
      line.split(/(?:seeds:)?\s+/).forEach((ns) => {
        if (ns === '') return;

        seeds.push(parseInt(ns));
      });

      return;
    }

    contextsMap[context] = {
      map: new Map([[0, { mapped: 0, range: +Infinity }]]),
    } as ContextRecord;
    const prevContextMap = contextsMap[context - 1];

    if (prevContextMap) {
      const { map } = prevContextMap;

      prevContextMap.sortedBreakpoints = [
        ...Array.from(map.keys()).sort((k1, k2) => k1 - k2),
        +Infinity,
      ];
    }
  });

  let minLocation = +Infinity;

  seeds.forEach((seed) => {
    let cur = seed;

    for (let i = 1; i < context; i++) {
      const { map, sortedBreakpoints } = contextsMap[i];

      let curStart = 0;
      let curEnd = sortedBreakpoints.length - 1;

      while (curEnd - curStart > 1) {
        const mid = Math.floor((curEnd + curStart) / 2);

        if (cur === sortedBreakpoints[mid]) {
          curStart = mid;

          break;
        }

        cur < sortedBreakpoints[mid] ? (curEnd = mid) : (curStart = mid);
      }

      const breakpoint = sortedBreakpoints[curStart];
      const { mapped, range } = map.get(breakpoint)!;
      const dif = cur - breakpoint;
      cur = dif + 1 > range ? cur : mapped + dif;
    }

    minLocation = Math.min(minLocation, cur);
  });

  return minLocation;
};

export default calculateMinLocation;
