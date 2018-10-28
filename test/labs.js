process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Lab = require('../models/Lab');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

describe('Labs', () => {

  beforeEach((done) => {
    Lab.deleteMany({}, (err) => { 
      done();           
    });        
  });

  describe('/GET /labs', () => {
    it('it should GET all the labs', (done) => {
      chai.request(server)
        .get('/labs')
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

  describe('/POST /labs/new', () => {
    it('it should not POST a lab without name field', (done) => {
      let lab = {
        description: "bar baz quay",
        users: []
      };
      chai.request(server)
        .post('/labs/new')
        .send(lab)
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
    it('it should successfully POST a lab', (done) => {
      let lab = {
        name: "Foo",
        description: "bar baz quay",
        users: [],
        joinRequests: []
      };
      chai.request(server)
        .post('/labs/new')
        .send(lab)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('description');
          res.body.data.should.have.property('users');
          res.body.data.should.have.property('joinRequests');
          res.body.data.should.have.property('rows');
          res.body.data.should.have.property('columns');
          res.body.data.should.have.property('datName');
          res.body.data.should.have.property('datKey');
          done();
        });
    });            
  });

  describe('/GET /labs/:recordId', () => {
    it('it should GET a lab by id', (done) => {
      let lab = new Lab({
        name: "Foo",
        description: "bar baz quay",
        users: []
      });
      lab.save((error, lab) => {
        let route = `/labs/${lab._id}`;
        chai.request(server)
          .get(route)
          .send(lab)
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('name');
            res.body.data.should.have.property('description');
            res.body.data.should.have.property('users');
            res.body.data.should.have.property('rows');
            res.body.data.should.have.property('columns');
            res.body.data.should.have.property('datName');
            res.body.data.should.have.property('datKey');            
            done();
          });
      });
    });
  });

  describe('/POST /labs/:recordId/edit', () => {
    it('it should UPDATE lab by id', (done) => {
      let lab = new Lab({
        name: "Foo",
        description: "bar baz quay",
        users: []
      });
      lab.save((error, lab) => {
        let route = `/labs/${lab._id}/edit`;
        chai.request(server)
          .post(route)
          .send({
            name: "Foo2",
            description: "bar baz quay2",
            users: [],
            rows: 2,
            columns: 2,
            datName: "Foo",
            datKey: "FooBarBaz"          
          })
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('name').eql("Foo2");
            res.body.data.should.have.property('description').eql("bar baz quay2");
            res.body.data.should.have.property('users');
            res.body.data.should.have.property('rows').eql(2);
            res.body.data.should.have.property('columns').eql(2);
            res.body.data.should.have.property('datName').eql("Foo");
            res.body.data.should.have.property('datKey').eql("FooBarBaz");            
            done();
          });
      });
    });
  });

  describe('/POST /labs/:recordId/remove', () => {
    it('it should DELETE lab by id', (done) => {
      let lab = new Lab({
        name: "Foo",
        description: "bar baz quay",
        users: []
      });
      lab.save((error, lab) => {
        let route = `/labs/${lab._id}/remove`;
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
