const db = require("../models");
const Concert = db.concerts;

// get all
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { $regex: new RegExp(name), $options: "i" } } : {};
    Concert.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "an error occured whilst retrieving concerts."
            });
        });  
};
// get one
exports.findOne = (req, res) => {
    const id = req.params.id;
    Concert.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "concert id:" + id + " not found."
                });
            else res.send(data);
        })
        .catch(err => {
            res
            .status(500)
            .send({ 
                message: 
                err.essage || "error retrieving concert id:" + id + "."
            });
        });  
};
// post
exports.create = (req, res) => {
    // validate request
    if (!req.body.name) {
        res.status(400).send({ message: "name can not be empty!" });
        return;
    }
    if (!req.body.location) {
        res.status(400).send({ message: "location can not be empty!" });
        return;
    }
    if (!req.body.genre) {
        res.status(400).send({ message: "genre can not be empty!" });
        return;
    }
    if (!req.body.date) {
        res.status(400).send({ message: "date can not be empty!" });
        return;
    }
    // create a concert
    const concert = new Concert({
        name: req.body.name,
        location: req.body.location,
        genre: req.body.genre,
        date: req.body.date,
        twitterHandle: req.body.twitterHandle
    });
    // post concert to db
    concert
        .save(concert)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "an error occured whilst creating the concert."
            });
        });  
};
// put 
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "cannot update an empty record!"
        });
    }
    const id = req.params.id;
    Concert.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
        if (!data) {
            res.status(404).send({
                message: `cannot update concert with id:${id}. maybe concert was not found!`
            });
        }
        else res.send({ 
            message: "concert was updated successfully.",
            data: data
        });
    })
    .catch(err => {
        res.status(500).send({
            message: 
            err.message || "error updating concert with id:" + id
        });
    });  
};
// delete 
exports.delete = (req, res) => {
    const id = req.params.id;
    Concert.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `cannot delete concert with id:${id}. maybe cutorial was not found!`
                });
            } 
            else {
                res.send({
                    message: "concert was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 
                err.message || "could not delete concert with id:" + id
            });
        });  
};
