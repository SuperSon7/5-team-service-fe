export default function calculateEndTime(start: string, minutes: number) {
  const [hh, mm] = start.split(":").map(Number);
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return "";
  const total = hh * 60 + mm + minutes;
  const next = total % (24 * 60);
  const nextH = `${Math.floor(next / 60)}`.padStart(2, "0");
  const nextM = `${next % 60}`.padStart(2, "0");
  return `${nextH}:${nextM}`;
}
