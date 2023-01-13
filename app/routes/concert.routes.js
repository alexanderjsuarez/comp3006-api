module.exports = app => {
    const concerts = require("../controllers/concert.controller.js");
    var router = require("express").Router();
    // retreive all concerts
    router.get("/", concerts.findAll);
    // retreive concert by id
    router.get("/:id", concerts.findOne);
    // create a new concert
    router.post("/", concerts.create);
    // update concert by id
    router.put("/:id", concerts.update);
    // delete concert by id
    router.delete("/:id", concerts.delete);
    app.use('/api/concerts', router);
  };