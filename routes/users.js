const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_AUTH_SECRET } = process.env;

// FIND ALL USERS
router.get('/', async (req, res) => {
  const users = await Users.find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => res.status(500).send(error));
});

// CREATE A NEW USER
router.post('/register', async (req, res) => {
  try {
    const hashedPwd = await Bcrypt.hash(req.body.password, 10);
    const users = new Users({
      userName: req.body.userName,
      password: hashedPwd,
      city: req.body.city,
      parkAdded: req.body.parkAdded,
    });
    if (users.userName.length === 0) {
      res.status(404).send({ message: 'You need to add a username !' });
    } else if (users.password.length === 0) {
      res.status(404).send({ message: 'You need to add a password !' });
    } else if (users.city.length === 0) {
      res.status(404).send({ message: 'You need to add your city !' });
    } else {
      const insertResult = await Users.create(users);
      res.send(insertResult);
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// REGISTER A USER
router.post('/login', async (req, res) => {
  try {
    if (!req.body.userName || !req.body.password) {
      res
        .status(400)
        .json({ errorMessage: 'Please specify both username and password' });
    } else {
      const user = await Users.findOne({ userName: req.body.userName });
      if (user) {
        const cmp = await Bcrypt.compare(req.body.password, user.password);
        if (cmp) {
          //   ..... further code to maintain authentication like jwt or sessions
          const token = jwt.sign({ userName: user.userName }, JWT_AUTH_SECRET, {
            expiresIn: 60 * 60 * 24,
          });
          res.status(200).json({ user, token });
        } else {
          res.send('Wrong username or password.');
        }
      } else {
        res.send('Wrong username or password.');
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = router;
