const express = require('express');
const app = express();

require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes/index')

const port = 8000;

app.use(express.json());
const { DB_URL } = process.env;
// Connect to MongoDB database
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server has started on port ${port}!`);
});
