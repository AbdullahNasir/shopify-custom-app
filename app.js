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

app.post('/customer', (req, res) => {
  const { body, query, params } = req;
  console.log('body', body);
  console.log('query', query);
  console.log('params', params);
});

app.use('/shopify', require('./routes/shopify'));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
