import moment from "moment";

export const getDateDifference = (start_date: string, end_date: string): string => {
  const start = moment(start_date);
  const end = moment(end_date);

  if (!start.isValid() || !end.isValid()) return "Noto‘g‘ri sana formati!";

  const years = end.diff(start, "years");
  start.add(years, "years");

  const months = end.diff(start, "months");
  start.add(months, "months");

  const days = end.diff(start, "days");

  let result = "";
  if (years > 0) result += `${years} yil `;
  if (months > 0) result += `${months} oy `;
  if (days > 0 || result === "") result += `${days} kun`; // Agar hammasi 0 bo‘lsa, "0 kun" bo‘lib qoladi.

  return result.trim();
};