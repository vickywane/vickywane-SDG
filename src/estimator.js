const covid19ImpactEstimator = () => {
  const data = {
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71,
    },
    periodType: 'days',
    timeToElapse: 58,
    reportedCases: 674,
    population: 66627705,
    totalHospitalBeds: 1380614,
  };

  const input = data;

  // challenge 1
  const currentlyInfectedImpact = data.reportedCases * 10;
  const currentlyInfectedSevere = data.reportedCases * 50;

  // haven't confirmed the  factors yet.
  const infectionsImpact = currentlyInfectedImpact * 512;
  const infectionsSevere = currentlyInfectedSevere * 512;

  // challenge 2
  const severeCasesByRequestedTime = 15 / 100 * infectionsImpact;
  const severeImpactCasesByRequestedTime = 15 / 100 * infectionsSevere;

  const impactAvailableBed = data.totalHospitalBeds;
  const severeImpactAvailableBed = data.totalHospitalBeds;

  return {
    data: input,
    impact: {
      //challenge 1
      currentlyInfected: currentlyInfectedImpact,
      infectionsByRequestedTime: infectionsImpact,

      // challenge 2
      severeCasesByRequestedTime: severeCasesByRequestedTime,
      hospitalBedsByRequestedTime: impactAvailableBed,
    },
    severeImpact: {
      // challenge 1
      currentlyInfected: currentlyInfectedSevere,
      infectionsByRequestedTime: infectionsSevere,

      // challenge 2
      severeCasesByRequestedTime: severeImpactCasesByRequestedTime,
      hospitalBedsByRequestedTime: severeImpactAvailableBed,
    },
  };
};

export default covid19ImpactEstimator;
