const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];
 
export const toMonthName = (monthNumber: number): string =>
  MONTH_NAMES[(monthNumber - 1) % 12];

export const fillEmptyMonths = <T extends { month: string }>(
  data: T[],
  zeroes: Omit<T, "month">
): T[] => {
  const map = new Map(data.map((d) => [d.month, d]));
 
  return MONTH_NAMES.map((month) => ({
    month,
    ...zeroes,
    ...(map.get(month) ?? {}),
  })) as T[];
};
 

export const sortByMonth = <T extends { month: string }>(data: T[]): T[] =>
  [...data].sort(
    (a, b) => MONTH_NAMES.indexOf(a.month) - MONTH_NAMES.indexOf(b.month)
  );