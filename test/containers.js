//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const shortid = require('shortid');
const Container = require('../models/Container');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Containers', () => {

  beforeEach((done) => {
    Container.deleteMany({}, (err) => { 
      done();           
    });        
  });

  describe('/GET /containers', () => {
    it('it should GET all the containers', (done) => {
      chai.request(server)
        .get('/api/v1/containers')
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

  describe('/POST /containers/new', () => {

    it('it should not POST a container without createdBy field', (done) => {
      let container = {
        updatedBy: 'demoUserId',
        parent: "labId",
        lab: "labId",
        name: "Foo",
        description: "bar baz quay",
        rows: 1,
        columns: 2,
        row: 3,
        column: 4,
        rowSpan: 5,
        columnSpan: 6,
        category: "Freezer",
        bgColor: "#cccccc" 
      };
      chai.request(server)
        .post('/api/v1/containers/new')
        .send(container)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('createdBy');
          res.body.error.errors.createdBy.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a container without name field', (done) => {
      let container = {
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        parent: "labId",
        lab: "labId",
        description: "bar baz quay",
        rows: 1,
        columns: 2,
        row: 3,
        column: 4,
        rowSpan: 5,
        columnSpan: 6,
        category: "Freezer",
        bgColor: "#cccccc" 
      };
      chai.request(server)
        .post('/api/v1/containers/new')
        .send(container)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          res.body.error.should.have.property('errors');
          res.body.error.errors.should.have.property('name');
          res.body.error.errors.name.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should successfully POST a container', (done) => {
      let container = {
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        parent: "labId",
        lab: "labId",
        name: "Foo",
        description: "bar baz quay",
        rows: 1,
        columns: 2,
        row: 3,
        column: 4,
        rowSpan: 5,
        columnSpan: 6,
        category: "Freezer",
        bgColor: "#cccccc"
      };
      chai.request(server)
        .post('/api/v1/containers/new')
        .send(container)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('The new record was successfully saved.');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('createdBy');
          res.body.data.should.have.property('updatedBy');
          res.body.data.should.have.property('createdAt');
          res.body.data.should.have.property('updatedAt');
          res.body.data.should.have.property('lab');
          res.body.data.should.have.property('parent');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('description');
          res.body.data.should.have.property('rows');
          res.body.data.should.have.property('columns');
          res.body.data.should.have.property('row');
          res.body.data.should.have.property('column');
          res.body.data.should.have.property('rowSpan');
          res.body.data.should.have.property('columnSpan');
          res.body.data.should.have.property('category');
          res.body.data.should.have.property('bgColor');          
          done();
        });
    });    
  });

  describe('/GET /containers/:recordId', () => {
    it('it should GET a container by id', (done) => {
      let container = new Container({
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        parent: "labId",
        lab: "labId",
        name: "Foo",
        description: "example description",
        rows: 1,
        columns: 2,
        row: 3,
        column: 4,
        rowSpan: 5,
        columnSpan: 6,
        category: "Freezer",
        bgColor: "#cccccc"
      });
      container.save((error, savedContainer) => {
        let route = `/api/v1/containers/${savedContainer._id}`;
        chai.request(server)
          .get(route)
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Success');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('createdBy');
            res.body.data.should.have.property('updatedBy');
            res.body.data.should.have.property('createdAt');
            res.body.data.should.have.property('updatedAt');             
            res.body.data.should.have.property('parent');
            res.body.data.should.have.property('lab');
            res.body.data.should.have.property('name');
            res.body.data.should.have.property('description');
            res.body.data.should.have.property('rows');
            res.body.data.should.have.property('columns');
            res.body.data.should.have.property('row');
            res.body.data.should.have.property('column');
            res.body.data.should.have.property('rowSpan');
            res.body.data.should.have.property('columnSpan');
            res.body.data.should.have.property('category');
            res.body.data.should.have.property('bgColor');          
            done();
          });
      });
    });
  });

  describe('/POST /containers/:recordId/edit', () => {
    it('it should UPDATE container by id', (done) => {
      let container = new Container({
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        parent: "labId",
        lab: "labId",
        name: "Foo",
        description: "example description",
        rows: 1,
        columns: 2,
        row: 3,
        column: 4,
        rowSpan: 5,
        columnSpan: 6,
        category: "Freezer",
        bgColor: "#cccccc"  
      });
      container.save((error, savedContainer) => {
        if (error) { console.log(error) }
        let route = `/api/v1/containers/${savedContainer._id}/edit`;
        chai.request(server)
          .post(route)
          .send({
            updatedBy: 'demoUserId',
            name: 'Foo2',
            lab: 'labId2',
            parent: 'labId2',
            description: 'updated description',
            rows: 2,
            columns: 3,
            row: 4,
            column: 5,
            rowSpan: 6,
            columnSpan: 7,
            category: 'Well',
            bgColor: '#dddddd'   
          })
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('The updated record was successfully saved.');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('createdBy');
            res.body.data.should.have.property('updatedBy');
            res.body.data.should.have.property('createdAt');
            res.body.data.should.have.property('updatedAt');
            res.body.data.should.have.property('parent').eql('labId2');
            res.body.data.should.have.property('lab').eql('labId2');
            res.body.data.should.have.property('name').eql('Foo2');
            res.body.data.should.have.property('description').eql('updated description');
            res.body.data.should.have.property('rows').eql(2);
            res.body.data.should.have.property('columns').eql(3);
            res.body.data.should.have.property('row').eql(4);
            res.body.data.should.have.property('column').eql(5);
            res.body.data.should.have.property('rowSpan').eql(6);
            res.body.data.should.have.property('columnSpan').eql(7);
            res.body.data.should.have.property('category').eql('Well');
            res.body.data.should.have.property('bgColor').eql('#dddddd');
            done();
          });
      });
    });
  });

  describe('/POST /containers/:recordId/remove', () => {
    it('it should DELETE container by id', (done) => {
      let container = new Container({
        createdBy: 'demoUserId',
        updatedBy: 'demoUserId',
        parent: "labId",
        lab: "labId",
        name: "Foo",
        description: "example description",
        rows: 1,
        columns: 2,
        row: 3,
        column: 4,
        rowSpan: 5,
        columnSpan: 6,
        category: "Freezer",
        bgColor: "#cccccc"  
      });
      container.save((error, container) => {
        let route = `/api/v1/containers/${container._id}/remove`;
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
