export   const formatRetreatText = (start: Date, end: Date) => {
  const startDay = start.getDate();
  const endDay = end.getDate();

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const month = monthNames[start.getMonth()];

 
  if (start.getMonth() === end.getMonth()) {
    return `${startDay}–${endDay} ${month}`;
  }

  const endMonth = monthNames[end.getMonth()];
  return `${startDay} ${month} – ${endDay} ${endMonth}`;
};
