// Need to require so the api starts up
var app = require("../../app");

// Testing requires
var deepcopy = require('deepcopy');
var expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

// Testing database requires
var mongoose = require("mongoose");
var User = require("../../users/userModel");
var config = require("config");

describe("Auth API", function() {

    var testUsers = [
        {firstName: 'Tom', lastName: 'Schedle', email: 'schedle@gmail.com', password: 'test'},
        {firstName: 'Ryan', lastName: 'Tyrella', email: 'tyrella@gmail.com', password: 'test'}
    ];

    describe("POST /api/auth", function (done) {
        it ('it should not allow someone to authenticate if their password doesnt match the given password', function (done) {
            User.create(testUsers, function (err) {
                chai.request(app)
                    .post('/api/auth')
                    .send({email: testUsers[0].email, password: 'wrongPassword'})
                    .end(function (err, res) {
                        expect(res).to.have.status(401);
                        expect(res.body).to.be.a('object');
                        expect(res.body.success).to.be.false;
                        expect(res.body).to.have.property('message');
                        done();
                    });
            });
        });
        it ('it should not allow someone to authenticate if their user cant be found', function (done) {
            User.create(testUsers, function (err) {
                chai.request(app)
                    .post('/api/auth')
                    .send({email: 'test@gmail.com', password: 'wrongPassword'})
                    .end(function (err, res) {
                        expect(res).to.have.status(404);
                        expect(res.body).to.be.a('object');
                        expect(res.body.success).to.be.false;
                        expect(res.body).to.have.property('message');
                        done();
                    });
            });
        });
        it ('it should allow someone to authenticate', function (done) {
            User.create(testUsers, function (err) {
                chai.request(app)
                    .post('/api/auth')
                    .send({email: testUsers[0].email, password: testUsers[0].password})
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body.success).to.be.true;
                        expect(res.body).to.have.property('message');
                        expect(res.body).to.have.property('token');
                        done();
                    });
            });
        });
        afterEach(function (done) {
            User.remove({}, function(err) {
                if (err) return done(err);
                done();
            });
        });
    });

});
