//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/User');

//Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("Auth", () => {

  beforeEach((done) => {
    User.deleteMany({}, (err) => { 
      done();           
    });        
  });

  describe("/POST /signup", () => {
    it("it should not POST a user without username field", done => {
      let payload = {
        password: "foobarbaz",
        name: "foo",
        email: "foo@example.com"
      }
      chai
        .request(server)
        .post("/api/v1/signup")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Check the form for errors.');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('username').eql('Please provide your username.');
          done();
        });
    });

    it("it should not POST a user without name field", done => {
      let payload = {
        username: "foobar",
        password: "foobarbazquay",
        email: "foo@example.com"
      }
      chai
        .request(server)
        .post("/api/v1/signup")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Check the form for errors.');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('name').eql('Please provide your name.');
          done();
        });
    });
    
    it("it should not POST a user without email field", done => {
      let payload = {
        username: "foobar",
        password: "foobarbazquay",
        name: "Foo Bar"
      }
      chai
        .request(server)
        .post("/api/v1/signup")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Check the form for errors.');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('email').eql('Please provide your email.');
          done();
        });
    });

    it('it should not POST a user without password field', (done) => {
      let payload = {
        username: "123",
        name: "foo",
        email: "foo@example.com"
      };
      chai.request(server)
        .post('/api/v1/signup')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Check the form for errors.');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('password').eql('Password must have at least 8 characters.');
          done();
        });
    });
    
    it('it should not POST a user with a password of less than 8 characters', (done) => {
      let payload = {
        username: "123",
        password: "1234567",
        name: "foo",
        email: "foo@example.com"
      };
      chai.request(server)
        .post('/api/v1/signup')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Check the form for errors.');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('password').eql('Password must have at least 8 characters.');
          done();
        });
    });

    it('it should not POST a user when email is already taken', (done) => {
      let user = new User({
        username: "123",
        password: "foobarbaz",
        name: "foo",
        email: "foo@example.com"
      });
      user.save((error, user) => {
        let payload = {
          username: "456",
          password: "bazbarfoor",
          name: "bar",
          email: "foo@example.com"
        };

        chai.request(server)
          .post('/api/v1/signup')
          .send(payload)
          .end((err, res) => {
            res.should.have.status(409);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(false);
            res.body.should.have.property('message');
            res.body.should.have.property('message').eql('Check the form for errors.');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('email').eql('This email is already taken.');
            done();
          });
      });
    });

    it('it should successfully POST a user', (done) => {
      let payload = {
        username: "123",
        password: "foobarbaz",
        name: "foo",
        email: "foo@example.com",
        imageUrl: "http://example.com/examplepicture"
      };
      chai.request(server)
        .post('/api/v1/signup')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('You have successfully signed up! Now you should be able to log in.');
          res.body.should.not.have.property('errors');
          done();
        });
    });
  });

  describe("/POST /login", () => {
    it("it should not POST a user without username field", done => {
      let payload = {
        password: "foobarbaz"
      }
      chai
        .request(server)
        .post("/api/v1/login")
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Check the form for errors.');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('username').eql('Please provide your username.');
          done();
        });
    });

    it('it should not POST a user without password field', (done) => {
      let payload = {
        username: "123"
      };
      chai.request(server)
        .post('/api/v1/login')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Check the form for errors.');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('password').eql('Please provide your password.');
          done();
        });
    });

    it('it should not POST a user with invalid username', (done) => {
      let payload = {
        username: "123",
        password: "foobarbaz"
      };
      chai.request(server)
        .post('/api/v1/login')
        .send(payload)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          res.body.should.have.property('message').eql('Incorrect username or password');
          done();
        });
    });

    it('it should not POST a user with invalid password', (done) => {
      let user = new User({
        username: "123",
        password: "foobarbaz",
        name: "foo",
        email: "foo@example.com"
      });
      user.save((error, user) => {
        let payload = {
          username: "123",
          password: "invalid"
        };
        chai.request(server)
          .post('/api/v1/login')
          .send(payload)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(false);
            res.body.should.have.property('message').eql('Incorrect username or password');
            done();
          });
      });
    });

    it('it should successfully POST a user', (done) => {
      let user = new User({
        username: "123",
        password: "foobarbaz",
        name: "foo",
        email: "foo@example.com"
      });
      user.save((error, user) => {
        let payload = {
          username: "123",
          password: "foobarbaz"
        };
        chai.request(server)
          .post('/api/v1/login')
          .send(payload)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(true);
            res.body.should.have.property('message').eql('You have successfully logged in!');
            res.body.should.have.property('token');
            res.body.token.should.be.a('string');
            res.body.should.have.property('user');
            res.body.user.should.be.a('object');
            res.body.user.should.have.property('username');
            res.body.user.username.should.be.a('string').eql('123');
            res.body.should.not.have.property('errors');
            done();
          });
      });
    });
  });
});
