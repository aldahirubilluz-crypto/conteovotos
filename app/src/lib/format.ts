// lib/format.ts
export const formatNumber = (num: number) =>
  new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 0,
  }).format(num);

export function formatTime(date: string | Date) {
  if (typeof window === "undefined") return "";
  return new Date(date).toLocaleTimeString("es-PE");
}
