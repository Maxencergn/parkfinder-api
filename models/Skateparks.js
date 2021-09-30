const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: String,
  description: String,
  city: String,
  adress: String,
  postalCode: Number,
  userWhoCreate: Number,
});

module.exports = mongoose.model("Skateparks", schema);
