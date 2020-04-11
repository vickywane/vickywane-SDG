/* eslint-disable no-console */
import express from 'express';
import debug from 'debug';
import response from 'response-time';
import fs from 'fs';

import covid19ImpactEstimator from './estimator';

const app = express();
const PORT = 3000;

app.use(
  response((req, res, time) => {
    const reqTime = time * 60;
    const reqMethod = req.method;
    const path = req.originalUrl;

    console.log(path);
    const log = {
      method: reqMethod,
      url: path,
      time: reqTime,
    };

    const parsedData = JSON.stringify(log);
    fs.writeFile('./src/logs.json', parsedData, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('written log data');
      }
    });
  })
);

app.post('/api/v1/on-covid-19(*)', (req, res) => {
  const EstimatorData = req.query.data;
  console.log(EstimatorData);

  const sampleData = {
    name: 'Victory',
  };

  const path = req.originalUrl;
  if (/x/.test(path)) {
    res.set('Accept', 'application/xml');
  } else {
    console.log('not xml');
  }

  res.status(404).send('qsome err');
  try {
    covid19ImpactEstimator(EstimatorData);
  } catch (error) {
    console.log('err occured with passed data');
  }
});

app.get('/api/v1/on-covid-19/logs(*)', (req, res) => {
  // reading from file
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
