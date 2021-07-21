const mongoose = require("mongoose")

const schema = mongoose.Schema({
	userName: String,
	password: String,
	city: String,
	parkAdded: Array,
});

module.exports = mongoose.model("Users", schema)