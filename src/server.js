/* eslint-disable no-console */
import express from 'express';
import debug from 'debug';
import response from 'response-time';
import fs from 'fs';
import convert from 'xml-js';
import covid19ImpactEstimator from './estimator';

const app = express();
const PORT = 3000;

// TODO: make sure log file doesnt get overwritten and pull data from req body & add status code

app.use(
  response((req, res, time) => {
    const reqTime = time * 60;
    const reqMethod = req.method;
    const path = req.originalUrl;
    console.log(path);

    const log = {
      req: reqMethod,
      reqpath: path,
      time: reqTime,
    };

    const parsedData = JSON.stringify(log);
    fs.writeFile('./src/logs.json', parsedData, { flag: 'r+' }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('written log data');
      }
    });
  })
);

app.post('/api/v1/on-covid-19(*)', (req, res) => {
  const path = req.originalUrl;
  // const EstimatorData = req.query.data;

  const test = {
    region: {
      name: 'Africa',
      avgAge: 19.7,
      avgDailyIncomeInUSD: 5,
      avgDailyIncomePopulation: 0.71,
    },
    periodType: 'days',
    timeToElapse: 58,
    reportedCases: 674,
    population: 66622705,
    totalHospitalBeds: 1380614,
  };
  const data = covid19ImpactEstimator(test);

  try {
    if (/x/.test(path)) {
      const converted = convert.js2xml(data, { compact: true });
      console.log(converted, 'converted');
      res.set('Accept', 'application/xml');
      res.send(converted);
    }
  } catch (error) {
    console.log('err occured with passed data', error);
  }
});

app.get('/api/v1/on-covid-19/logs', () => {
  fs.readFile('./src/logs.json', (err, jsonString) => {
    if (err) {
      console.log('failed to read', err);
    } else {
      try {
        const log = JSON.parse(jsonString);
        console.log(log, 'parsed data');
      } catch (error) {
        console.log(error);
      }
    }
  });
});

app.listen(PORT, () => debug.log(`LISTENING ON PORT ${PORT}`));
