process.env.NODE_ENV = 'test';

var mongoose = require('mongoose'),
    User = require('../userModel');

var chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../../app.js');

var should = chai.should();

chai.use(chaiHttp);

// parent block
describe('User', function () {
  // first clean the test database
  beforeEach( function (done) {
    User.remove({}, function (err) {
      done();
    });
  });

  // start testing /api/u/ GET endpoint
  describe('GET /api/u/ to get all users', function () {
    it ('it should GET all the users', function (done) {
      chai.request(server)
          .get('/api/u/')
          .end(function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
    });
  });

  // start testing /api/u/add POST endpoint
  describe('POST /api/u/add/ to create a user', function () {
    it ('it should not POST a user without a firstName field', function (done) {
      var user = {
        lastName: "Smith",
        email: "bsmith@gmail.com",
        password: "testing"
      }
      chai.request(server)
          .post('/api/u/add/')
          .send(user)
          .end( function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('error');
            done();
          });
    });

    it ('it should POST a user', function (done) {
      var user = {
        firstName: "Bob",
        lastName: "Smith",
        email: "bsmith@gmail.com",
        password: "testing"
      }
      chai.request(server)
          .post('/api/u/add/')
          .send(user)
          .end( function (err, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('firstName');
            res.body.should.have.property('lastName');
            res.body.should.have.property('email');
            res.body.should.have.property('password');
            done();
          });
    });
  });

  describe('GET /api/u/:uid to get a specific user', function (done) {
    it ('it should GET a user', function (done) {
      var user = new User({ firstName: "Bob", lastName: "Smith", email: "bsmith@gmail.com", password: "testing"});
      user.save(function (err, user) {
          chai.request(server)
              .get('/api/u/' + user.id)
              .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('firstName');
                res.body.should.have.property('lastName');
                res.body.should.have.property('email');
                res.body.should.have.property('password');
                res.body.should.have.property('_id').eql(user.id);
                done();
              });
      });
    });
  });

  describe('PATCH /api/u/update/:uid to update a specific user', function (done) {
    it ('it should PATCH a user', function (done) {
      var user = new User({ firstName: "Bob", lastName: "Smith", email: "bsmith@gmail.com", password: "testing"});
      user.save(function (err, user) {
          user.firstName = "Testing";
          chai.request(server)
              .patch('/api/u/update/' + user.id)
              .send(user)
              .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('firstName').eql("Testing");
                done();
              });
      });
    });
  });

  describe('DELETE /api/u/remove/:uid to remove a specific user', function (done) {
    it ('it should remove a user', function (done) {
      var user = new User({ firstName: "Bob", lastName: "Smith", email: "bsmith@gmail.com", password: "testing"});
      user.save(function (err, user) {
          chai.request(server)
              .delete('/api/u/remove/' + user.id)
              .end(function (err, res) {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('Status').eql("Successful");
                done();
              });
      });
    });
  });

});
