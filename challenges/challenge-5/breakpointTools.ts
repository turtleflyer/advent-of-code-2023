export type ContextRecord = { map: ContextMap; sortedBreakpoints: number[] };

type ContextMap = Map<number, Range>;

export type Range = [base: number, range: number];

export const findBreakpoint = (input: number, sortedBreakpoints: number[]) => {
  let curStart = 0;
  let curEnd = sortedBreakpoints.length - 1;

  while (curEnd - curStart > 1) {
    const mid = Math.floor((curEnd + curStart) / 2);

    if (input === sortedBreakpoints[mid]) {
      curStart = mid;

      break;
    }

    input < sortedBreakpoints[mid] ? (curEnd = mid) : (curStart = mid);
  }

  return sortedBreakpoints[curStart];
};

export const addBreakpoint = (
  contextRecord: ContextRecord,
  line: string
): line is 'valid for parsing map' => {
  if (/^(\d+\s*){3}$/.test(line)) {
    const [mapped, input, range] = line.split(/\s+/).map((ns) => parseInt(ns));
    contextRecord.map.set(input, [mapped, range]);

    return true;
  }

  return false;
};

export const createSortedBreakpointsList = (contextMap: ContextMap) => [
  ...Array.from(contextMap.keys()).sort((k1, k2) => k1 - k2),
  +Infinity,
];

export const createSortedBreakpointsListAndNormalizeMap = (contextMap: ContextMap) => {
  const sortedBreakpoints = createSortedBreakpointsList(contextMap);
  const newSorted: number[] = [];

  for (let i = 0; i < sortedBreakpoints.length - 1; i++) {
    const breakpoint = sortedBreakpoints[i];
    newSorted.push(breakpoint);
    const [, range] = contextMap.get(breakpoint)!;
    const possibleNewBreakpoint = breakpoint + range;
    const nextBreakpoint = sortedBreakpoints[i + 1];

    if (possibleNewBreakpoint > nextBreakpoint) {
      throw Error('Possible overlap');
    }

    if (possibleNewBreakpoint === nextBreakpoint) continue;

    newSorted.push(possibleNewBreakpoint);

    contextMap.set(possibleNewBreakpoint, [
      possibleNewBreakpoint,
      nextBreakpoint - possibleNewBreakpoint,
    ]);
  }

  newSorted.push(+Infinity);

  return newSorted;
};
