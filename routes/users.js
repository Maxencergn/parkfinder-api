const express = require('express');
const Users = require('../models/Users');
const router = express.Router();
const Bcrypt = require('bcrypt');

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
    if (users.userName.length > 1 && users.password.length > 1 && users.city.length > 1) {
      const insertResult = await Users.create(users);
      res.send(insertResult);
    } else {
      res.status(404).send({ message: 'One of the input is empty !' });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        message:
          'Internal Server error Occured, or you tring to enter name that already exist !',
      });
  }
});

// REGISTER A USER
router.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({ userName: req.body.userName });
    if (user) {
      const cmp = await Bcrypt.compare(req.body.password, user.password);
      if (cmp) {
        //   ..... further code to maintain authentication like jwt or sessions
        res.send('Auth Successful');
      } else {
        res.send('Wrong username or password.');
      }
    } else {
      res.send('Wrong username or password.');
    }
  } catch (error) {
    res.status(500).send('Internal Server error Occured');
  }
});

module.exports = router;
