export const getRange = (start: number, end: number, step: number = 1): number[] => {
  const ret = [];
  for (let i = start; i < end; i += step) {
    ret.push(i);
  }

  return ret;
};
