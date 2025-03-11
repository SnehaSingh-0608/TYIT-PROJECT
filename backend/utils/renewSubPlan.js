const shoulRenewSubcriptionPlan = (user) => {
  const today = new Date();
  return !user?.nextBillingDate || user?.nextBillingDate <= today;
};

module.exports = { shoulRenewSubcriptionPlan };
