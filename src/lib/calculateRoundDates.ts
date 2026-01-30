export default function calculateRoundDates(baseDate: string, weekday: number, count: number) {
  const base = new Date(baseDate);
  if (Number.isNaN(base.getTime())) return [];
  const day = base.getDay();
  const diff = (weekday - day + 7) % 7;
  const first = new Date(base);
  first.setDate(first.getDate() + diff);
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(first);
    date.setDate(first.getDate() + i * 7);
    const yyyy = date.getFullYear();
    const mm = `${date.getMonth() + 1}`.padStart(2, "0");
    const dd = `${date.getDate()}`.padStart(2, "0");
    return { roundNo: i + 1, date: `${yyyy}-${mm}-${dd}` };
  });
}
