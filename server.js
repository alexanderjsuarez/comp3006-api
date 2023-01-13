// import modules
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./app/models")
// delcare constants
const PORT = process.env.PORT || 3000;
const dbName = (process.env.NODE_ENV === "testing" ? "concerto-test" : "concerto");
// create express app
const app = express();
// connect to mongodb
db.mongoose.set('strictQuery', false);
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: dbName
    })
    .then(() => {
        console.log("Connection established with mongodb.")
    })
    .catch(error => {
        console.log("Failed to connect to mongodb. The application will now exit.", error);
        process.exit();
    });
// add cors middleware and body parser (json, urlencoded)
let corsOptions = {
    origin: "http://localhost:3001"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// define base route
app.get("/", (req, res) => {
    res.json({message: "This is the root of the api."});
});
// add additional routes
require("./app/routes/concert.routes")(app);
// start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
module.exports.app = app;