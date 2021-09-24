const mongoose = require('mongoose');

const schema = mongoose.Schema({
  userName: { type: String, required: true, unique : true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  parkAdded: Array,
});

module.exports = mongoose.model('Users', schema);
