const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
  city: String,
  adress: String,
  postalCode: Number,
  userWhoCreate: Number,
  parkimage: String,
});

module.exports = mongoose.model("Skateparks", schema);
