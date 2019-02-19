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
        .get("/api/v1/virtuals")
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
    it("it should not POST a virtual without createdBy field", done => {
      let virtual = {
        name: "foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        isAvailable: true,
        fgSubmitted: true,
        fgStage: 1
      };
      chai
        .request(server)
        .post("/api/v1/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          res.body.error.should.have.property("errors");
          res.body.error.errors.should.have.property("createdBy");
          res.body.error.errors.createdBy.should.have.property("kind").eql("required");
          done();
        });
    });
    it("it should not POST a virtual without name field", done => {
      let virtual = {
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        isAvailable: true,
        fgSubmitted: true,
        fgStage: 1
      };
      chai
        .request(server)
        .post("/api/v1/virtuals/new")
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
    it("it should successfully POST a virtual", done => {
      let virtual = {
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        name: "Foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        isAvailable: true,
        fgSubmitted: true,
        fgStage: 1
      };
      chai
        .request(server)
        .post("/api/v1/virtuals/new")
        .send(virtual)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message");
          res.body.should.have.property("data");
          res.body.data.should.be.a("object");
          res.body.data.should.have.property("createdBy");
          res.body.data.should.have.property("updatedBy");
          res.body.data.should.have.property("name");
          res.body.data.should.have.property("description");
          res.body.data.should.have.property("provenance");
          res.body.data.should.have.property("genotype");
          res.body.data.should.have.property("sequence");
          res.body.data.should.have.property("category");
          res.body.data.should.have.property("isAvailable");
          res.body.data.should.have.property("fgSubmitted");
          res.body.data.should.have.property("fgStage");
          done();
        });
    });
  });

  describe("/GET /virtuals/:recordId", () => {
    it("it should GET a virtual by id", done => {
      let virtual = new Virtual({
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        name: "Foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        isAvailable: true,
        fgSubmitted: true,
        fgStage: 1
      });
      virtual.save((error, virtual) => {
        if (error) {
          console.log(error);
          done();
        } else {
          let route = `/api/v1/virtuals/${virtual._id}`;
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
              res.body.data.should.have.property("createdBy");
              res.body.data.should.have.property("updatedBy");
              res.body.data.should.have.property("name");
              res.body.data.should.have.property("description");
              res.body.data.should.have.property("provenance");
              res.body.data.should.have.property("genotype");
              res.body.data.should.have.property("sequence");
              res.body.data.should.have.property("category");
              res.body.data.should.have.property("isAvailable");
              res.body.data.should.have.property("fgSubmitted");
              res.body.data.should.have.property("fgStage");
              done();
            });
        }
      });
    });
  });

  describe("/POST /virtuals/:recordId/edit", () => {
    it("it should UPDATE virtual by id", done => {
      let virtual = new Virtual({
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        name: "Foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        isAvailable: true,
        fgSubmitted: true,
        fgStage: 1
      });
      virtual.save((error, savedVirtual) => {
        if (error) {
          console.log(error);
        }
        let route = `/api/v1/virtuals/${savedVirtual._id}/edit`;
        chai
          .request(server)
          .post(route)
          .send({
            updatedBy: "demoUser2",
            name: "Foo2",
            description: "bar baz quay foo",
            provenance: "fooProvenance2",
            genotype: "fooGenotype2",
            sequence: "fooSequence2",
            category: "Organism",
            isAvailable: false,
            fgSubmitted: false,
            fgStage: 0
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
            res.body.data.should.have.property("createdBy").eql("demoUserId");
            res.body.data.should.have.property("updatedBy").eql("demoUser2");
            res.body.data.should.have.property("name").eql("Foo2");
            res.body.data.should.have.property("description").eql("bar baz quay foo");
            res.body.data.should.have.property("provenance").eql("fooProvenance2");
            res.body.data.should.have.property("genotype").eql("fooGenotype2");
            res.body.data.should.have.property("sequence").eql("fooSequence2");
            res.body.data.should.have.property("category").eql("Organism");
            res.body.data.should.have.property("isAvailable").eql(false);
            res.body.data.should.have.property("fgSubmitted").eql(false);
            res.body.data.should.have.property("fgStage").eql(0);
            done();
          });
      });
    });
  });

  describe("/POST /virtuals/:recordId/remove", () => {
    it("it should DELETE virtual by id", done => {
      let virtual = new Virtual({
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        name: "Foo",
        description: "bar baz quay",
        provenance: "fooProvenance",
        genotype: "fooGenotype",
        sequence: "fooSequence",
        category: "DNA",
        isAvailable: true,
        fgSubmitted: true,
        fgStage: 1
      });
      virtual.save((error, virtual) => {
        let route = `/api/v1/virtuals/${virtual._id}/remove`;
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
