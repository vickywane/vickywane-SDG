/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
const covid19ImpactEstimator = (data) => {
  const input = data;
  // Destructuring to improve readability
  const { reportedCases, totalHospitalBeds, timeToElapse } = input;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = input.region;

  // challenge 1
  const currentlyInfectedImpact = reportedCases * 10;
  const currentlyInfectedSevere = reportedCases * 50;

  // haven't confirmed the  factors yet. --- infectionsByRequestedTime
  const infectionsImpact = currentlyInfectedImpact * 512;
  const infectionsSevere = currentlyInfectedSevere * 512;

  // challenge 2
  const severeICasesByRequestedTime = 15 / infectionsImpact * 100;
  const severeImpactCasesByRequestedTime = 15 / infectionsSevere * 100;

  const impactAvailableBed = totalHospitalBeds / severeICasesByRequestedTime; // UNSURE OF METHOD USED
  const severeImpactAvailableBed = totalHospitalBeds / severeImpactCasesByRequestedTime; // UNSURE OF METHOD USED

  // challenge 3
  const FivePercentimpactCase = 5 / severeImpactCasesByRequestedTime * 100;
  const FivePercentsevereImpactCase = 5 / severeImpactCasesByRequestedTime * 100;

  const TwoPercentimpactCase = 2 / severeICasesByRequestedTime * 100;
  const TwoPercentsevereImpactCase = 2 / severeImpactCasesByRequestedTime * 100;

  return {
    data: input,
    impact: {
      // challenge 1
      currentlyInfected: currentlyInfectedImpact,
      infectionsByRequestedTime: infectionsImpact,

      // challenge 2
      severeCasesByRequestedTime: severeICasesByRequestedTime,
      hospitalBedsByRequestedTime: impactAvailableBed,

      // challenge 3
      casesForICUByRequestedTime: FivePercentimpactCase,
      casesForVentilatorsByRequestedTime: TwoPercentimpactCase,

      dollarsInFlight:
        infectionsImpact
        * avgDailyIncomePopulation
        * avgDailyIncomeInUSD
        * timeToElapse
    },
    severeImpact: {
      // challenge 1
      currentlyInfected: currentlyInfectedSevere,
      infectionsByRequestedTime: infectionsSevere,

      // challenge 2
      severeICasesByRequestedTime: severeImpactCasesByRequestedTime,
      hospitalBedsByRequestedTime: severeImpactAvailableBed,

      // challenge 3
      casesForICUByRequestedTime: FivePercentsevereImpactCase,
      casesForVentilatorsByRequestedTime: TwoPercentsevereImpactCase,

      dollarsInFlight:
        infectionsSevere
        * avgDailyIncomePopulation
        * avgDailyIncomeInUSD
        * timeToElapse
    }
  };
};

export default covid19ImpactEstimator;
