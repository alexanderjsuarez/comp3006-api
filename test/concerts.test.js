let chai = require("chai");
let { expect } = require("chai");
let chaiHttp = require("chai-http");
let {app} = require("../server");

chai.use(chaiHttp);
describe("concerts api intergration test", () => {
    let id;
    describe("/GET /api/concerts", () => {
        it("should get response code 200", (done) => {
            chai.request(app)
                .get("/api/concerts")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(err).to.be.null;
                    done();
                });
        });
    
        it("should retrieve 4 records", (done) => {
            chai.request(app)
                .get("/api/concerts")
                .end((err, res) => {
                    expect(res.body).to.be.a("array");
                    expect(res.body).to.have.lengthOf(4);
                    done();
                });
        });
    });
    
    describe("/POST /api/concerts", () => {
        let concert = {
            location: "Belfast, Titanic Quarter",
            genre: "Folk",
            date: "2023-05-11"
        };
    
        it("should not post concert without name field", (done) => {
            chai.request(app)
                .post("/api/concerts")
                .send({
                    location: "Belfast, Titanic Quarter",
                    genre: "Folk",
                    date: "2023-05-11"
                })
                .then((res) => {
                    expect(res).to.have.status(400);
                    done();
                })
                .catch((err) => done(err));
                
        });
        
        it("should post without issue", (done) => {
            chai.request(app)
                .post("/api/concerts")
                .send({
                    name: "The Pogues",
                    location: "Belfast, Titanic Quarter",
                    genre: "Folk",
                    date: "2023-05-11"
                })
                .then((res) => {
                    expect(res).to.have.status(200);
                    id = res.body._id;
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("/GET /api/concerts/id", () => {
        it("should return status 404", (done) => {
            chai.request(app)
                // not a real id;
                .get("/api/concerts/507f1f77bcf86cd799439011")
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                })
                .catch((err) => done(err));
        });

        it("should retrieve the record made earlier", (done) => {
            chai.request(app)
                .get("/api/concerts/" + id)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).property('_id').to.equal(id);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("/PUT /api/concerts/id", () => {
        it("should have a different name and genre", (done) => {
            chai.request(app)
                .put("/api/concerts/" + id)
                .send({
                    name: "Ed Sheeran",
                    location: "Belfast, Titanic Quarter",
                    genre: "Pop",
                    date: "2023-05-11"
                })
                .then((res) => {
                    expect(res).to.have.status(200);
                    done();
                })
                .catch((err) => done(err));
        });
        it("should return status 404", (done) => {
            chai.request(app)
                // not a real id;
                .get("/api/concerts/507f1f77bcf123d799439011")
                .send({
                    name: "Ed Sheeran",
                    location: "Belfast, Titanic Quarter",
                    genre: "Pop",
                    date: "2023-05-11"
                })
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe("/DELETE /api/concerts/id", () => {
        it("should return status 200", (done) => {
            chai.request(app)
                .put("/api/concerts/" + id)
                .then((res) => {
                    expect(res).to.have.status(200);
                    done();
                })
                .catch((err) => done(err));
        });
        it("should return status 404", (done) => {
            chai.request(app)
                // not a real id;
                .delete("/api/concerts/507f1f77bcf123d799439011")
                .then((res) => {
                    expect(res).to.have.status(404);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});

