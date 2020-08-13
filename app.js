const express = require('express');
const dotenv = require('dotenv');
const { Liquid } = require('liquidjs');
const connectDB = require('./utils/db');

// load env variables
dotenv.config();

// connect DB
connectDB();

// initialize app
const PORT = process.env.PORT || 5000;
const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// register liquid engine
const engine = new Liquid();
app.engine('liquid', engine.express());
app.set('views', './views'); // specify the views directory
app.set('view engine', 'liquid'); // set liquid to default

app.get('/', (req, res) => {
  console.log('GET Home page');
  res.send('GET Home page');
});

app.use('/shopify', require('./routes/shopify'));
app.use('/customers', require('./routes/customers'));
app.use('/proxy', require('./routes/proxy'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
