export const getQuarterInfo = (date: string) => {
  const quarterDate = new Date(date);
  const month = quarterDate.getMonth();
  const year = quarterDate.getFullYear();
  
  let quarterNum, startMonth, endMonth, dueDate, taxYear;
  if (month >= 0 && month < 3) {
    quarterNum = 4;
    startMonth = "October";
    endMonth = "December";
    dueDate = "January 15";
    taxYear = year - 1;
  } else if (month >= 3 && month < 6) {
    quarterNum = 1;
    startMonth = "January";
    endMonth = "March";
    dueDate = "April 15";
    taxYear = year;
  } else if (month >= 6 && month < 9) {
    quarterNum = 2;
    startMonth = "April";
    endMonth = "June";
    dueDate = "June 15";
    taxYear = year;
  } else {
    quarterNum = 3;
    startMonth = "July";
    endMonth = "September";
    dueDate = "September 15";
    taxYear = year;
  }

  return {
    quarterNum,
    dateRange: `${startMonth} - ${endMonth} ${taxYear}`,
    dueDate: `${dueDate}, ${year}`,
    taxYear,
  };
};