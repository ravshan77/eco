import moment from "moment";

export const formatDate = (date: string): string => {
  const formattedDate = moment(date, "YYYY-MM-DD").format("DD.MM.YYYY");
  return formattedDate;
};