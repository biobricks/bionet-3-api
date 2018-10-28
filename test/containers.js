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

const exampleContainer = {
  creator: "abc",
  parent: "123",
  lab: "examplelab",
  name: "foo",
  description: "bar baz quay",
  rows: 1,
  columns: 2,
  locations: [],
  category: "Freezer",
  datName: "fooDat",
  datHash: "fooHash",
  bgColor: "#cccccc" 
};

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

    it('it should not POST a container without creator field', (done) => {
      let container = {
        parent: "123",
        lab: "examplelab",
        name: "foo",
        description: "bar baz quay",
        rows: 1,
        columns: 2,
        locations: [],
        category: "Freezer",
        datName: "fooDat",
        datHash: "fooHash",
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
          res.body.error.errors.should.have.property('creator');
          res.body.error.errors.creator.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a container without name field', (done) => {
      let container = {
        creator: "foobarbaz",
        parent: "123",
        lab: "examplelab",
        description: "bar baz quay",
        rows: 1,
        columns: 2,
        locations: [],
        category: "Freezer",
        datName: "fooDat",
        datHash: "fooHash",
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
    it('it should not POST a container without rows field', (done) => {
      let container = {
        creator: "foobarbaz",
        parent: "123",
        lab: "examplelab",
        name: "foo",
        description: "bar baz quay",
        columns: 2,
        locations: [],
        category: "Freezer",
        datName: "fooDat",
        datHash: "fooHash",
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
          res.body.error.errors.should.have.property('rows');
          res.body.error.errors.rows.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a container without rows field', (done) => {
      let container = {
        creator: "foobarbaz",
        parent: "123",
        lab: "examplelab",
        name: "foo",
        description: "bar baz quay",
        columns: 2,
        locations: [],
        category: "Freezer",
        datName: "fooDat",
        datHash: "fooHash",
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
          res.body.error.errors.should.have.property('rows');
          res.body.error.errors.rows.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a container without columns field', (done) => {
      let container = {
        creator: "foobarbaz",
        parent: "123",
        lab: "examplelab",
        name: "foo",
        description: "bar baz quay",
        rows: 1,
        locations: [],
        category: "Freezer",
        datName: "fooDat",
        datHash: "fooHash",
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
          res.body.error.errors.should.have.property('columns');
          res.body.error.errors.columns.should.have.property('kind').eql('required');
          done();
        });
    });  
    it('it should successfully POST a container', (done) => {
      let container = exampleContainer;
      container.name = shortid.generate();
      chai.request(server)
        .post('/api/v1/containers/new')
        .send(container)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('The new record was successfully saved.');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('creator');
          res.body.data.should.have.property('createdAt');
          res.body.data.should.have.property('updatedAt');
          res.body.data.should.have.property('lab');
          res.body.data.should.have.property('parent');
          res.body.data.should.have.property('name');
          res.body.data.should.have.property('description');
          res.body.data.should.have.property('rows');
          res.body.data.should.have.property('columns');
          res.body.data.should.have.property('locations');
          res.body.data.should.have.property('category');
          res.body.data.should.have.property('datName');
          res.body.data.should.have.property('datHash'); 
          res.body.data.should.have.property('bgColor');          
          done();
        });
    });    
  });

  describe('/GET /containers/:recordId', () => {
    it('it should GET a container by id', (done) => {
      let container = new Container({
        creator: "foobarbaz",
        parent: "123",
        lab: "fooLab",
        name: "foo",
        description: "bar baz quay",
        rows: 1,
        columns: 2,
        locations: [],
        category: "Freezer",
        datName: "fooDat",
        datHash: "fooHash",
        bgColor: "#cccccc"
      });
      container.save((error, container) => {
        if (error) { 
          console.log(error); 
          done();
        } else {
          let route = `/api/v1/containers/${container._id}`;
          chai.request(server)
            .get(route)
            .send(container)
            .end((err, res) => {
              if (err) { console.log(err) }
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql('The record was successfully retrieved.');
              res.body.should.have.property('data');
              res.body.data.should.be.a('object');
              res.body.data.should.have.property('creator');
              res.body.data.should.have.property('createdAt');
              res.body.data.should.have.property('updatedAt');              
              res.body.data.should.have.property('parent');
              res.body.data.should.have.property('lab');
              res.body.data.should.have.property('name');
              res.body.data.should.have.property('description');
              res.body.data.should.have.property('rows');
              res.body.data.should.have.property('columns');
              res.body.data.should.have.property('locations');
              res.body.data.should.have.property('category');
              res.body.data.should.have.property('datName');
              res.body.data.should.have.property('datHash');
              res.body.data.should.have.property('bgColor');
              done();
            });
          }    
      });
    });
  });

  describe('/POST /containers/:recordId/edit', () => {
    it('it should UPDATE container by id', (done) => {
      let container = new Container({
        creator: "foobarbaz",
        parent: "123",
        lab: "fooLab",
        name: "foos",
        description: "bar baz quay",
        rows: 1,
        columns: 2,
        locations: [[1,2]],
        category: "Freezer",
        datName: "fooDat",
        datHash: "fooHash",
        bgColor: "#dddddd"      
      });
      container.save((error, container) => {
        if (error) { console.log(error) }
        let route = `/api/v1/containers/${container._id}/edit`;
        chai.request(server)
          .post(route)
          .send({
            creator: "foobarbaz",
            parent: "1234",
            name: "foobars",
            lab: "fooLabs",
            description: "bar baz quay foo",
            rows: 5,
            columns: 6,
            locations: [[3,4]],
            category: "Well",
            datName: "fooDatData",
            datHash: "SADHJKASHDKJASKDKD",
            bgColor: "#cccccc"   
          })
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('The updated record was successfully saved.');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('creator').eql('foobarbaz');
            res.body.data.should.have.property('createdAt');
            res.body.data.should.have.property('updatedAt');
            res.body.data.should.have.property('parent').eql('1234');
            res.body.data.should.have.property('lab').eql('fooLabs');
            res.body.data.should.have.property('name').eql('foobars');
            res.body.data.should.have.property('description').eql('bar baz quay foo');
            res.body.data.should.have.property('rows').eql(5);
            res.body.data.should.have.property('columns').eql(6);
            res.body.data.should.have.property('locations').eql([[3,4]]);
            res.body.data.should.have.property('category').eql('Well');
            res.body.data.should.have.property('datName').eql('fooDatData');
            res.body.data.should.have.property('datHash').eql('SADHJKASHDKJASKDKD');
            res.body.data.should.have.property('bgColor').eql('#cccccc');
            done();
          });
      });
    });
  });

  describe('/POST /containers/:recordId/remove', () => {
    it('it should DELETE container by id', (done) => {
      let container = new Container({
        creator: "foobarbaz",
        parent: "123",
        lab: "fooLabs",
        name: "foo",
        description: "bar baz quay",
        rows: 1,
        columns: 2,
        locations: [],
        category: "Freezer",
        datName: "fooDatData",
        datHash: "SADHJKASHDKJASKDKD",
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
