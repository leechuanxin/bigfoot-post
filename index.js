import express from 'express';
import { read, add } from './jsonFileStorage.js';

const app = express();
const PORT = process.argv[2];
const FILENAME = './data.json';

// Set view engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (request, response) => {
  read(FILENAME, (err, data) => {
    response.render('index', data);
  });
});

app.get('/sightings/:index', (request, response) => {
  read(FILENAME, (err, data) => {
    if (request.params.index >= data.sightings.length) {
      response.status(404).send('Sorry, we cannot find that!');
    } else {
      const sighting = data.sightings[request.params.index];
      const sightingObj = {
        sighting,
      };
      response.render('sighting', sightingObj);
    }
  });
});

app.get('/years', (request, response) => {
  read(FILENAME, (err, data) => {
    const years = {};
    data.sightings.forEach((el) => { years[el.YEAR] = ''; });
    const links = Object.keys(years);
    const link = {
      links,
    };
    response.render('years', link);
  });
});

app.get('/year-sighting/:year', (request, response) => {
  read(FILENAME, (err, data) => {
    const sightings = data.sightings.filter((sighting) => sighting.YEAR === request.params.year);
    const sightingsObj = {
      sightings,
    };
    response.render('year', sightingsObj);
  });
});

app.get('/new-sighting', (request, response) => {
  response.render('newsighting');
});

app.post('/sighting', (request, response) => {
  // Add new recipe data in request.body to recipes array in data.json.
  add('data.json', 'sightings', request.body, (err, str) => {
    if (err) {
      response.status(500).send('DB write error.');
      return;
    }
    console.time('parse');
    console.timeLog('parse');
    // const obj = JSON.parse(str);
    console.timeLog('parse');
    // const idx = obj.sightings.length - 1;
    console.timeEnd('parse');
    // Acknowledge recipe saved.
    response.redirect('../sightings/3');
  });
});
// app.get('/year-sighting/:year', (request, response) => {
//   read(FILENAME, (err, data) => {
//     const newSightings = data.sightings.map(el, index => { ...el, INDEX: index });
//     const sightingObj = {
//       sighting,
//     };
//     response.render('sighting', sightingObj);
//   });
// });

app.listen(PORT);
