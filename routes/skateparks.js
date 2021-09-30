const express = require('express');
const multer = require('multer');
const Skateparks = require('../models/Skateparks');
const router = express.Router();
const jwt = require('jsonwebtoken');


const { JWT_AUTH_SECRET } = process.env;

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// MIDDLEWARE AUTH
const authenticateWithJsonWebToken = (req, res, next) => {
  if (req.headers.authorization !== undefined) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, JWT_AUTH_SECRET, (err) => {
      if (err) {
        res
          .status(401)
          .json({ errorMessage: "you're not allowed to access these data" });
      } else {
        next();
      }
    });
  } else {
    res
      .status(401)
      .json({ errorMessage: "you're not allowed to access these data!" });
  }
};

// FIND ALL SKATEPARKS
router.get('/', /* authenticateWithJsonWebToken, */ async (req, res) => {
  const skateparks = await Skateparks.find()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => res.status(500).send(error));
});

// CREATE A NEW SKATEPARK
router.post('/', upload.single('parkImage'), async (req, res) => {
  const file = req.file;
  console.log(file);
  const skateparks = new Skateparks({ 
    name: req.body.name,
    description: req.body.description,
    adress: req.body.adress,
    city: req.body.city,
    postalCode: req.body.postalCode,
    image: req.file.path,
  });
  await skateparks
    .save()
    .then((data) => {
      console.log(data)
      if (!data) {
        res.status(404).send({
          message: `Cannot create skatepark!`,
        });
      } else {
        res.send({ message: 'skatepark was created successfully.' });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error creating skatepark',
      });
    });
});

 // FIND SKATEPARKS BY ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const skateparks = await Skateparks.findById(id)
    .exec()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => res.status(500).send(error));
});

// MODIFY A SKATEPARK BY ID
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const objectId = { _id: id };
  const skateparks = {
    $set: {
      name: req.body.name,
      description: req.body.description,
      urlImage: req.body.urlImage,
      place: req.body.place,
      userWhoCreate: req.body.userId,
    },
  };
  await Skateparks.updateOne(objectId, skateparks)
    .then((result) => {
      console.log(result);
      if (result.nModified === 1) {
        res.status(202).send({ message: 'Skatepark was updated successfully.' });
      } else {
        res.status(404).send({
          message: `Cannot updated Skatepark!`,
        });
      }
    })
    .catch((error) => res.status(500).send(error));
});

// DELETE A SKATEPARK BY ID
router.delete('/:id', async (req, res) => {
  const objectId = { _id: req.params.id };
  await Skateparks.findOneAndDelete(objectId)
    .then(() => res.sendStatus(202))
    .catch((error) => res.status(500).send(error));
});

module.exports = router;