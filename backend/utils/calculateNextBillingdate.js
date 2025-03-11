const calculateNextBillingDate = () => {
  const oneMonthfromNow = new Date();
  oneMonthfromNow.setMonth(oneMonthfromNow.getMonth() + 1);
  return oneMonthfromNow;
};

module.exports = { calculateNextBillingDate };
