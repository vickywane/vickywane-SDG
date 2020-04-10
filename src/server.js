import express from 'express';
import debug from 'debug';
// import Covid19Estimator from './estimator';

const app = express();

const PORT = 3000;

app.post('/api/v1/on-covid-19', (req, res) => {
  console.log(req);

  console.log(res);
  //   Covid19Estimator(data);
});

app.listen(PORT, () => debug.log(`LISTENING ON PORT ${PORT}`));
