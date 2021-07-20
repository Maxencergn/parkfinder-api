const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/Post');

const port = 8000;
// Connect to MongoDB database
mongoose
  .connect('mongodb://localhost:27017/myBlog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();
    app.use(express.json());

    // FIND ALL POSTS
    app.get('/api/posts', async (req, res) => {
      const posts = await Post.find()
        .then((result) => {
          res.send(result);
        })
        .catch((error) => res.status(500).send(error));
    });

    // FIND POSTS BY ID
    app.get('/api/posts/:id', async (req, res) => {
      const id = req.params.id;
      const posts = await Post.findById(id)
        .exec()
        .then((result) => {
          res.send(result);
        })
        .catch((error) => res.status(500).send(error));
    });

    // CREATE A NEW POST
    app.post('/api/post', async (req, res) => {
      const posts = new Post({
        title: req.body.title,
        content: req.body.content,
      });
      await posts
        .save()
        .then((data) => {
          if (!data) {
            res.status(404).send({
              message: `Cannot create Post!`,
            });
          } else {
            res.send({ message: 'Post was created successfully.' });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: 'Error creating Post',
          });
        });
    });

    // MODIFY A POST BY ID
    app.put('/api/post/:id', async (req, res) => {
      const id = req.params.id;
      const objectId = { _id: id };
      const updatePost = {
        $set: {
          title: req.body.title,
          content: req.body.content,
        },
      };
      await Post.updateOne(objectId, updatePost)
        .then((result) => {
          console.log(result);
          if (result.nModified === 1) {
            res
              .status(202)
              .send({ message: 'Post was updated successfully.' });
          } else {
            res.status(404).send({
              message: `Cannot updated Post!`,
            });
          }
        })
        .catch((error) => res.status(500).send(error));
    });

    // DELETE A POST BY ID
    app.delete('/api/post/:id', async (req, res) => {
      const id = req.params.id;
      const objectId = { _id: id };
      await Post.findOneAndDelete(objectId)
        .then(() => res.sendStatus(202))
        .catch((error) => res.status(500).send(error));
    });

    app.listen(port, () => {
      console.log(`Server has started on port ${port}!`);
    });
  });
