const express = require('express');
const dotenv = require('dotenv');

// load env variables
dotenv.config();

// initialize app
const PORT = process.env.PORT || 5000;
const app = express();

// body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  console.log('GET Home page');
  res.send('GET Home page');
});

app.post('/', (req, res) => {
  console.log('POST Home page');
  console.log('req.body', req.body);
  console.log('req.params', req.params);
  console.log('req.query', req.query);
  res.send('POST Home page');
});

app.use('/shopify', require('./routes/shopify'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
