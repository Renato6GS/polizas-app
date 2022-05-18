export const calculateAge = ({ date }) => {
  const birthday = new Date(date);

  const month_diff = Date.now() - birthday.getTime();

  //convert the calculated difference in date format
  const age_dt = new Date(month_diff);

  //extract year from date
  const year = age_dt.getUTCFullYear();

  //now calculate the age of the user
  const age = Math.abs(year - 1970);

  //display the calculated age
  return { age };
};
