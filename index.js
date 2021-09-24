const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes/index')

const port = process.env.PORT;

const { DEV_URL } = process.env;

app.use(
  cors({
    origin: [DEV_URL],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
const { DB_URL } = process.env;
// Connect to MongoDB database
mongoose.connect(DB_URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', routes)

app.listen(port, () => {
  console.log(`Server has started on port ${port}!`);
});
