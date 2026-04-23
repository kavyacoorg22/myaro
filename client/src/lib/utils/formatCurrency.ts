// utils/formatCurrency.ts

export const formatINR = (amount: number): string =>
  "₹" + Math.round(amount).toLocaleString("en-IN");

export const formatLakh = (amount: number): string => {
  if (amount >= 100_000) return `₹${(amount / 100_000).toFixed(2)}L`;
  if (amount >= 1_000)   return `₹${Math.round(amount / 1_000)}k`;
  return `₹${amount}`;
};