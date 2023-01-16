// declare constants
require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./app/models");
const PORT = process.env.PORT || 3000;
const dbName = (process.env.NODE_ENV === "testing" ? "concerto-test" : "concerto");

// add cors middleware and body parser (json, urlencoded)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// create socket
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
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

// define base route
app.get("/", (req, res) => {
    res.json({message: "Demonstration"});
});

// add additional routes
require("./app/routes/concert.routes")(app);

// start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// socket.io events
// this runs when a client joins
io.on('connection', (socket) => {
    let nameChosen = false;
    // let client chosoe name for the chatroom
    socket.on('choose name', (username) => {
        // check the client hasn't already chosen a name
        if(nameChosen) return;
        socket.username = username;
        nameChosen = true;
        // broadcast to room a new user has joined
        socket.broadcast.emit('user joined' , username);
    });

    // broadcast to the room when a user disconnects
    socket.on('disconnect', (username) => {
        // no name to broadcast if user hasnt chosen a name
        if(!nameChosen) return;

        socket.broadcast.emit('user left', {
            username: socket.username
        });
    });
    // broadcast to the room when client sends a message
    socket.on('new message', (message) => {
        socket.broadcast.emit('new message', {
            username: socket.username,
            message: message
        });
      });
})
module.exports.app = app;