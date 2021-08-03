export const shuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j] as T, arr[i] as T];
  }
  return arr;
};

export const randomChoose = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)] as T;
};
