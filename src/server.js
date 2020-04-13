/* eslint-disable comma-dangle */
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
      time: reqTime
    };

    const parsedData = JSON.stringify(log);
    const write = fs.createWriteStream('./src/logs.json', { flag: 'a' }, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('written log data');
        write.write(parsedData);
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
    const converted = convert.js2xml(data, { compact: true });
    if (/x/.test(path)) {
      res.send(converted);
    } else {
      res.send(converted);
    }
  } catch (error) {
    console.log('err occured with passed data', error);
  }
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  fs.readFile('./src/logs.json', (err, jsonString) => {
    if (err) {
      console.log('failed to read', err);
    } else {
      try {
        const log = JSON.parse(jsonString);

        res.format({
          'text/plain': () => res.send(log),
        });
      } catch (error) {
        console.log(error);
      }
    }
  });
});

app.listen(PORT, () => debug.log(`LISTENING ON PORT ${PORT}`));
