//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("Static", () => {

  describe("/GET /", () => {
    it("it should GET the landing page", done => {
      chai
        .request(server)
        .get("/api/v1/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.be.a("string").eql("Welcome to the BioNet API.");
          done();
        });
    });
  });

  describe("/GET /dashboard", () => {
    it("it should GET the dashboard", done => {
      chai
        .request(server)
        .get("/api/v1/dashboard")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.message.should.be.a("string").eql("User successfully retrieved from the Database.");
          res.body.should.have.property("user");
          res.body.user.should.be.a("object");
          done();
        });
    });
  });
});
