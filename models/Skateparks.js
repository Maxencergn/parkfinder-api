const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String, unique: true },
  description: String,
	adress: String,
  city: String,
  postalCode: Number,
	image: { type: String, required: true },
});

module.exports = mongoose.model("Skateparks", schema);
