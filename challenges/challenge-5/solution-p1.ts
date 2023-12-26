import { convertTextToList } from '../../utils/convertTextToList';
import {
  addBreakpoint,
  createSortedBreakpointsList,
  findBreakpoint,
  type ContextRecord,
} from './breakpointTools';

const calculateMinLocation = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let context = -1;
  const contextsMap: Record<number, ContextRecord> = {};
  const seeds: number[] = [];

  list.forEach((line, i) => {
    if (addBreakpoint(contextsMap[context], line) && i < list.length - 1) return;

    context++;

    if (context === 0) {
      line
        .split(/(?:seeds:)?\s+/)
        .filter((nonempty) => nonempty)
        .forEach((ns) => {
          seeds.push(parseInt(ns));
        });

      return;
    }

    contextsMap[context] = {
      map: new Map([[0, [0, 0]]]),
    } as ContextRecord;

    const prevContextMap = contextsMap[context - 1];

    if (prevContextMap) {
      const { map } = prevContextMap;
      prevContextMap.sortedBreakpoints = createSortedBreakpointsList(map);
    }
  });

  let minLocation = +Infinity;

  seeds.forEach((seed) => {
    let cur = seed;

    for (let i = 1; i < context; i++) {
      const { map, sortedBreakpoints } = contextsMap[i];
      const breakpoint = findBreakpoint(cur, sortedBreakpoints);
      const [mapped, range] = map.get(breakpoint)!;
      const dif = cur - breakpoint;
      cur = dif + 1 > range ? cur : mapped + dif;
    }

    minLocation = Math.min(minLocation, cur);
  });

  return minLocation;
};

export default calculateMinLocation;
