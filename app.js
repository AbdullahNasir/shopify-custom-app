const express = require('express');
const dotenv = require('dotenv');
const { Liquid } = require('liquidjs');
const connectDB = require('./utils/db');

const fs = require('fs');
const path = require('path');

// load env variables
dotenv.config();

// connect DB
connectDB();

// initialize app
const PORT = process.env.PORT || 5000;
const app = express();

const engine = new Liquid();

// register liquid engine
app.engine('liquid', engine.express());
app.set('views', './views'); // specify the views directory
app.set('view engine', 'liquid'); // set liquid to default

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log('GET Home page');
  res.send('GET Home page');
});

app.get('/test', (req, res) => {
  res.set('Content-Type', 'application/liquid');
  // const file = fs.readFileSync(path.join(__dirname, 'test.liquid'), 'utf8');
  // console.log('file', file);
  // res.send(file);
  res.render('test');
});

app.use('/shopify', require('./routes/shopify'));
app.use('/customers', require('./routes/customers'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
