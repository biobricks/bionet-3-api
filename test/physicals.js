process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const shortid = require('shortid');
const Physical = require('../models/Physical');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Physicals', () => {

  beforeEach((done) => {
    Physical.deleteMany({}, (err) => { 
      done();           
    });        
  });

  describe('/GET /physicals', () => {
    it('it should GET all the physicals', (done) => {
      chai.request(server)
        .get('/api/v1/physicals')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.message.should.be.a('string');
          res.body.data.should.be.a('array');
          res.body.data.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('/POST /physicals/new', () => {
    it('it should not POST a physical without virtual field', (done) => {
      let physical = {
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        lab: "exampleLab",
        parent: "exampleContainer",
        row: 1,
        column: 2,
        rowSpan: 3,
        columnSpan: 4,
        name: "foo",
        description: "bar baz quay"
      };
      chai.request(server)
        .post('/api/v1/physicals/new')
        .send(physical)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('virtual');
          res.body.error.errors.virtual.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a physical without createdBy field', (done) => {
      let physical = {
        virtual: "exampleVirtual",
        lab: "exampleLab",
        parent: "exampleContainer",
        row: 1,
        column: 2,
        rowSpan: 3,
        columnSpan: 4,
        name: "foo",
        description: "bar baz quay"
      };
      chai.request(server)
        .post('/api/v1/physicals/new')
        .send(physical)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('createdBy');
          res.body.error.errors.createdBy.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a physical without name field', (done) => {
      let physical = {
        virtual: "exampleVirtual",
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        lab: "exampleLab",
        parent: "exampleContainer",
        row: 1,
        column: 2,
        rowSpan: 3,
        columnSpan: 4,
        description: "bar baz quay" 
      };
      chai.request(server)
        .post('/api/v1/physicals/new')
        .send(physical)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('name');
          res.body.error.errors.name.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should successfully POST a physical', (done) => {
      let physical = {
        virtual: "exampleVirtual",
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        lab: "exampleLab",
        parent: "exampleContainer",
        name: "Foo",
        description: "bar baz quay",
        row: 1,
        column: 2,
        rowSpan: 3,
        columnSpan: 4
      };
      chai.request(server)
        .post('/api/v1/physicals/new')
        .send(physical)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('virtual');
          res.body.data.should.have.property('createdBy');
          res.body.data.should.have.property('updatedBy');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('description');
          res.body.data.should.have.property('lab');
          res.body.data.should.have.property('parent');
          res.body.data.should.have.property('row');
          res.body.data.should.have.property('column');
          res.body.data.should.have.property('rowSpan');
          res.body.data.should.have.property('columnSpan');
          done();
        });
    });    
  });

  describe('/GET /physicals/:recordId', () => {
    it('it should GET a physical by id', (done) => {
      let physical = new Physical({
        virtual: "exampleVirtual",
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        lab: "exampleLab",
        parent: "exampleContainer",
        row: 1,
        column: 2,
        rowSpan: 3,
        columnSpan: 4,
        name: "foo",
        description: "bar baz quay"   
      });
      physical.save((error, savedPhysical) => {
        if (error) { 
          console.log(error); 
          done();
        } else {
          let route = `/api/v1/physicals/${savedPhysical._id}`;
          chai.request(server)
            .get(route)
            .end((err, res) => {
              if (err) { console.log(err) }
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message');
              res.body.should.have.property('data');
              res.body.data.should.be.a('object');
              res.body.data.should.have.property('virtual');
              res.body.data.should.have.property('createdBy');
              res.body.data.should.have.property('updatedBy');
              res.body.data.should.have.property('name');
              res.body.data.should.have.property('description');
              res.body.data.should.have.property('parent');
              res.body.data.should.have.property('row');
              res.body.data.should.have.property('column');
              res.body.data.should.have.property('rowSpan');
              res.body.data.should.have.property('columnSpan');
              done();
            });
          }    
      });
    });
  });

  describe('/POST /physicals/:recordId/edit', () => {
    it('it should UPDATE physical by id', (done) => {
      let physical = new Physical({
        virtual: "exampleVirtual",
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        lab: "exampleLab",
        row: 1,
        column: 2,
        rowSpan: 3,
        columnSpan: 4,
        name: "foo",
        description: "bar baz quay",
        datName: "fooDat",
        datHash: "fooHash"    
      });
      physical.save((error, savedPhysical) => {
        if (error) { console.log(error) }
        let route = `/api/v1/physicals/${savedPhysical._id}/edit`;
        chai.request(server)
          .post(route)
          .send({
            virtual: "exampleVirtual2",
            updatedBy: "exampleUser2",
            lab: "exampleLab2",
            parent: "exampleContainer2",
            row: 2,
            column: 3,
            rowSpan: 4,
            columnSpan: 5,
            name: "foo2",
            description: "bar baz quay2"     
          })
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('virtual').eql('exampleVirtual2');
            res.body.data.should.have.property('updatedBy').eql('exampleUser2');
            res.body.data.should.have.property('name').eql('foo2');
            res.body.data.should.have.property('description').eql('bar baz quay2');
            res.body.data.should.have.property('lab').eql('exampleLab2');
            res.body.data.should.have.property('parent').eql('exampleContainer2');
            res.body.data.should.have.property('row').eql(2);
            res.body.data.should.have.property('column').eql(3);
            res.body.data.should.have.property('rowSpan').eql(4);
            res.body.data.should.have.property('columnSpan').eql(5);
            done();
          });
      });
    });
  });

  describe('/POST /physicals/:recordId/remove', () => {
    it('it should DELETE physical by id', (done) => {
      let physical = new Physical({
        virtual: "exampleVirtual",
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        lab: "exampleLab",
        parent: "exampleContainer",
        row: 2,
        column: 3,
        rowSpan: 4,
        columnSpan: 5,
        name: "foo",
        description: "bar baz quay"    
      });
      physical.save((error, savedPhysical) => {
        let route = `/api/v1/physicals/${savedPhysical._id}/remove`;
        chai.request(server)
          .post(route)
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('The record was successfully removed.');
            done();
          });
      });
    });
  });

});
