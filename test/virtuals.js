//During the test the env variable is set to test
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const shortid = require("shortid");
const Virtual = require("../models/Virtual");

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("Virtuals", () => {
  beforeEach(done => {
    Virtual.deleteMany({}, err => {
      done();
    });
  });

  describe("/GET /virtuals", () => {
    it("it should GET all the virtuals", done => {
      chai
        .request(server)
        .get("/virtuals")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("data");
          res.body.message.should.be.a("string");
          res.body.data.should.be.a("array");
          res.body.data.length.should.be.eql(0);
          done();
        });
    });
  });

  describe("/POST /virtuals/new", () => {
    it("it should not POST a virtual without creator field", done => {
      let virtual = {
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      };
      chai
        .request(server)
        .post("/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.have.property("errors");
          res.body.error.errors.should.have.property("creator");
          res.body.error.errors.creator.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
    it("it should not POST a virtual without name field", done => {
      let virtual = {
        creator: "exampleUser",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      };
      chai
        .request(server)
        .post("/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.have.property("errors");
          res.body.error.errors.should.have.property("name");
          res.body.error.errors.name.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
    it("it should not POST a virtual without provenance field", done => {
      let virtual = {
        creator: "exampleUser",
        name: "foo",
        description: "bar baz quay",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      };
      chai
        .request(server)
        .post("/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.have.property("errors");
          res.body.error.errors.should.have.property("provenance");
          res.body.error.errors.provenance.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
    it("it should not POST a virtual without genotype field", done => {
      let virtual = {
        creator: "exampleUser",
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        sequence: "fooSequence",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      };
      chai
        .request(server)
        .post("/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.have.property("errors");
          res.body.error.errors.should.have.property("genotype");
          res.body.error.errors.genotype.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
    it("it should not POST a virtual without sequence field", done => {
      let virtual = {
        creator: "exampleUser",
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      };
      chai
        .request(server)
        .post("/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.have.property("errors");
          res.body.error.errors.should.have.property("sequence");
          res.body.error.errors.sequence.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
    it("it should not POST a virtual without category field", done => {
      let virtual = {
        creator: "exampleUser",
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        datName: "fooDat",
        datHash: "fooHash"
      };
      chai
        .request(server)
        .post("/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          if (err) {
            console.log(err);
          }
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.have.property("errors");
          res.body.error.errors.should.have.property("category");
          res.body.error.errors.category.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
    it("it should successfully POST a virtual", done => {
      let virtual = {
        creator: "exampleuser",
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      };
      chai
        .request(server)
        .post("/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("data");
          res.body.data.should.be.a("object");
          res.body.data.should.have.property("creator");
          res.body.data.should.have.property("name");
          res.body.data.should.have.property("description");
          res.body.data.should.have.property("provenance");
          res.body.data.should.have.property("genotype");
          res.body.data.should.have.property("sequence");
          res.body.data.should.have.property("category");
          res.body.data.should.have.property("datName");
          res.body.data.should.have.property("datHash");
          done();
        });
    });
  });

  describe("/GET /virtuals/:recordId", () => {
    it("it should GET a virtual by id", done => {
      let virtual = new Virtual({
        creator: "exampleuser",
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      });
      virtual.save((error, virtual) => {
        if (error) {
          console.log(error);
          done();
        } else {
          let route = `/virtuals/${virtual._id}`;
          chai
            .request(server)
            .get(route)
            .send(virtual)
            .end((err, res) => {
              if (err) {
                console.log(err);
              }
              res.should.have.status(200);
              res.body.should.be.a("object");
              res.body.should.have.property("message");
              res.body.should.have.property("data");
              res.body.data.should.be.a("object");
              res.body.data.should.have.property("creator");
              res.body.data.should.have.property("name");
              res.body.data.should.have.property("description");
              res.body.data.should.have.property("provenance");
              res.body.data.should.have.property("genotype");
              res.body.data.should.have.property("sequence");
              res.body.data.should.have.property("category");
              res.body.data.should.have.property("datName");
              res.body.data.should.have.property("datHash");
              done();
            });
        }
      });
    });
  });

  describe("/POST /virtuals/:recordId/edit", () => {
    it("it should UPDATE virtual by id", done => {
      let virtual = new Virtual({
        creator: "exampleuser",
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      });
      virtual.save((error, virtual) => {
        if (error) {
          console.log(error);
        }
        let route = `/virtuals/${virtual._id}/edit`;
        chai
          .request(server)
          .post(route)
          .send({
            creator: "foobarbaz",
            name: "foobar",
            description: "bar baz quay foo",
            provenance: "fooProvenance2",
            genotype: "fooGenotype2",
            sequence: "fooSequence2",
            category: "Organism",
            datName: "fooDat2",
            datHash: "fooHash2"
          })
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            res.body.should.have.property("data");
            res.body.data.should.be.a("object");
            res.body.data.should.have.property("creator").eql("foobarbaz");
            res.body.data.should.have.property("name").eql("foobar");
            res.body.data.should.have
              .property("description")
              .eql("bar baz quay foo");
            res.body.data.should.have
              .property("provenance")
              .eql("fooProvenance2");
            res.body.data.should.have.property("genotype").eql("fooGenotype2");
            res.body.data.should.have.property("sequence").eql("fooSequence2");
            res.body.data.should.have.property("category").eql("Organism");
            res.body.data.should.have.property("datName").eql("fooDat2");
            res.body.data.should.have.property("datHash").eql("fooHash2");
            done();
          });
      });
    });
  });

  describe("/POST /virtuals/:recordId/remove", () => {
    it("it should DELETE virtual by id", done => {
      let virtual = new Virtual({
        creator: "exampleuser",
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        datName: "fooDat",
        datHash: "fooHash"
      });
      virtual.save((error, virtual) => {
        let route = `/virtuals/${virtual._id}/remove`;
        chai
          .request(server)
          .post(route)
          .end((err, res) => {
            if (err) {
              console.log(err);
            }
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("The record was successfully removed.");
            done();
          });
      });
    });
  });
});
