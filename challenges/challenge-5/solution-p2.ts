import { convertTextToList } from '../../utils/convertTextToList';
import {
  addBreakpoint,
  createSortedBreakpointsListAndNormalizeMap,
  findBreakpoint,
  type ContextRecord,
  type Range,
} from './breakpointTools';

const calculateMinLocation = (inputFilePath: string) => {
  const list = convertTextToList(inputFilePath);
  let context = -1;
  const contextsMap: Record<number, ContextRecord> = {};
  const seedRanges: Range[] = [];

  list.forEach((line, i) => {
    if (addBreakpoint(contextsMap[context], line) && i < list.length - 1) return;

    context++;

    if (context === 0) {
      line
        .split(/(?:seeds:\s+)|(\d+\s+\d+)|(?:\s+)/)
        .filter((nonempty) => nonempty)
        .forEach((rangeS) => {
          seedRanges.push(rangeS.split(/\s+/).map((ns) => parseInt(ns)) as Range);
        });

      return;
    }

    contextsMap[context] = {
      map: new Map([[0, [0, 1]]]),
    } as ContextRecord;

    const prevContextMap = contextsMap[context - 1];

    if (prevContextMap) {
      const { map } = prevContextMap;
      prevContextMap.sortedBreakpoints = createSortedBreakpointsListAndNormalizeMap(map);
    }
  });

  let curRanges = seedRanges;

  for (let ci = 1; ci < context; ci++) {
    const nextRanges: Range[] = [];

    const proceedRange = ([base, range]: [number, number]) => {
      const { sortedBreakpoints, map } = contextsMap[ci];
      const breakpoint = findBreakpoint(base, sortedBreakpoints);
      const [mapped, bpRange] = map.get(breakpoint)!;
      const dif = base - breakpoint;
      const restRange = bpRange - dif;

      if (range > 1 && range > restRange) {
        nextRanges.push([mapped + dif, restRange]);
        proceedRange([breakpoint + bpRange, range - restRange]);

        return;
      }

      nextRanges.push([mapped + dif, range]);
    };

    curRanges.forEach(proceedRange);
    curRanges = nextRanges;
  }

  return curRanges.reduce((min, [base]) => Math.min(min, base), +Infinity);
};

export default calculateMinLocation;
