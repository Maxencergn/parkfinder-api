const express = require('express');
const router = express.Router();
const skateparks = require('./skateparks');
const users = require('./users');

// ROUTE SKATEPARKS
router.use('/skateparks', skateparks);
router.use('/users', users);

module.exports = router;
