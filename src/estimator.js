/* eslint-disable max-len */
/* eslint-disable no-mixed-operators */
const covid19ImpactEstimator = (data) => {
  const input = data;

  const { reportedCases, totalHospitalBeds, timeToElapse, periodType } = input;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = input.region;

  const convertToDays = () => {
    if (periodType === 'days' || periodType === 'day') {
      return timeToElapse;
    }
    if (periodType === 'weeks' || periodType === 'week') {
      return timeToElapse * 7;
    }
    if (periodType === 'months' || periodType === 'month') {
      return timeToElapse * 30;
    }
  };

  const rate = () => {
    const days = convertToDays() / 3;

    return 2 ** Math.trunc(days);
  };

  // challenge 1
  const currentlyInfectedImpact = Math.trunc(reportedCases * 10);
  const currentlyInfectedSevere = Math.trunc(reportedCases * 50);

  // haven't confirmed the  factors yet. --- infectionsByRequestedTime
  const infectionsImpact = Math.trunc(currentlyInfectedImpact * rate);
  const infectionsSevere = Math.trunc(currentlyInfectedSevere * rate);

  // challenge 2
  const severeICasesByRequestedTime = Math.trunc(15 / infectionsImpact * 100);
  const severeImpactCasesByRequestedTime = Math.trunc(
    15 / infectionsSevere * 100
  );

  const impactAvailableBed = Math.trunc(
    totalHospitalBeds * 0.35 - severeICasesByRequestedTime
  );
  const severeImpactAvailableBed = Math.trunc(
    totalHospitalBeds * 0.35 - severeImpactCasesByRequestedTime
  );

  // challenge 3
  const FivePercentimpactCase = Math.trunc(
    5 / severeImpactCasesByRequestedTime * 100
  );
  const FivePercentsevereImpactCase = Math.trunc(
    5 / severeImpactCasesByRequestedTime * 100
  );

  const TwoPercentimpactCase = Math.trunc(
    2 / severeICasesByRequestedTime * 100
  );
  const TwoPercentsevereImpactCase = Math.trunc(
    2 / severeImpactCasesByRequestedTime * 100
  );

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
        infectionsImpact *
        avgDailyIncomePopulation *
        avgDailyIncomeInUSD *
        convertToDays(),
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
        infectionsSevere *
        avgDailyIncomePopulation *
        avgDailyIncomeInUSD *
        convertToDays(),
    },
  };
};

export default covid19ImpactEstimator;
