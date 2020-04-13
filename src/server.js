/* eslint-disable arrow-body-style */
/* eslint-disable no-console */
/* eslint-disable prefer-template */
/* eslint-disable radix */
import express from 'express';
import bodyParser from 'body-parser';
import xml from 'xml';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

import estimator from './estimator';

const app = express();
app.use(bodyParser.json());

fs.mkdirSync(path.join(__dirname, './logs/'));
const logFile = fs.createWriteStream(path.join(__dirname, './log.txt'), {
  flags: 'a'
});

app.use(
  morgan(
    (tokens, req, res) => {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        parseInt(tokens['response-time'](req, res).toString()) < 10
          ? '0' + parseInt(tokens['response-time'](req, res).toString()) + 'ms'
          : parseInt(tokens['response-time'](req, res).toString()) + 'ms'
      ].join('\t\t');
    },
    {
      stream: logFile
    }
  )
);

app.post('/api/v1/on-covid-19', estimator, (req, res) => {
  res.status(201).json(res.body);
});

app.post('/api/v1/on-covid-19/:type', estimator, (req, res) => {
  if (req.params.type === 'json') {
    res.status(201).json(res.body);
  } else if (req.params.type === 'xml') {
    const { data, impact, severeImpact } = res.body;

    const dataToSubmit = [
      {
        results: [
          { _attr: { from: 'COVID-19 estimator' } },
          {
            data: [
              {
                region: [
                  { name: data.region.name },
                  { avgAge: data.region.avgAge },
                  { avgDailyIncomeInUSD: data.region.avgDailyIncomeInUSD },
                  {
                    avgDailyIncomePopulation:
                      data.region.avgDailyIncomePopulation
                  }
                ]
              },
              { periodType: data.periodType },
              { timeToElapse: data.timeToElapse },
              { reportedCases: data.reportedCases },
              { population: data.population },
              { totalHospitalBeds: data.totalHospitalBeds }
            ]
          },
          {
            impact: [
              { currentlyInfected: impact.currentlyInfected },
              { infectionsByRequestedTime: impact.infectionsByRequestedTime },
              { severeCasesByRequestedTime: impact.severeCasesByRequestedTime },
              {
                hospitalBedsByRequestedTime: impact.hospitalBedsByRequestedTime
              },
              { casesForICUByRequestedTime: impact.casesForICUByRequestedTime },
              {
                casesForVentilatorsByRequestedTime:
                  impact.casesForVentilatorsByRequestedTime
              },
              { dollarsInFlight: impact.dollarsInFlight }
            ]
          },
          {
            severeImpact: [
              { currentlyInfected: severeImpact.currentlyInfected },
              {
                infectionsByRequestedTime:
                  severeImpact.infectionsByRequestedTime
              },
              {
                severeCasesByRequestedTime:
                  severeImpact.severeCasesByRequestedTime
              },
              {
                hospitalBedsByRequestedTime:
                  severeImpact.hospitalBedsByRequestedTime
              },
              {
                casesForICUByRequestedTime:
                  severeImpact.casesForICUByRequestedTime
              },
              {
                casesForVentilatorsByRequestedTime:
                  severeImpact.casesForVentilatorsByRequestedTime
              },
              { dollarsInFlight: severeImpact.dollarsInFlight }
            ]
          }
        ]
      }
    ];

    // set the content type to xml
    res.type('application/xml');
    // send an xml data
    res.status(201).send(xml(dataToSubmit, { declaration: true }));
  }
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const logs = fs.readFileSync(path.join(__dirname, './logs/log.txt'), {
    encoding: 'utf-8'
  });
  console.log(logs);
  res.type('text/plain');
  res.status(200).send(logs);
});

app.get('*', (req, res) => {
  res.status(403).send('forbidden');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
