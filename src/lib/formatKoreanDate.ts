export default function formatKoreanDate(dateString: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (!match) return dateString;
  const [, year, month, day] = match;
  return `${year}년 ${month}월 ${day}일`;
}
