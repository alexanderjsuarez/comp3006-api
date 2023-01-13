// import modules
require('dotenv').config();
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.ATLAS_URI;
db.concerts = require("./concert.model.js") (mongoose);

module.exports = db;