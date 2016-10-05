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
var User = require("../userModel");
var config = require("config");

// Create a new testing connection to the database, cannot use default because server is using it
// mongoose.createConnection(config.get('DBHost'));
process.env.NODE_ENV = 'test';

describe("User API", function() {

    // Test user data we will insert then use api to retrieve
    var testUsers = [
        {firstName: 'Tom', lastName: 'Schedle', email: 'schedle@gmail.com', password: 'test'},
        {firstName: 'Ryan', lastName: 'Tyrella', email: 'tyrella@gmail.com', password: 'test'}
    ];

    describe("GET /api/u/ to get users", function () {
        it('return nothing', function (done) {
            chai.request(app)
                .get('/api/u/')
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.have.lengthOf(0);
                    done();
                });
        });
        it('returns all users in the user database', function (done) {
            User.create(testUsers, function (err) {
                if (err) return done(err);
                chai.request(app)
                    .get('/api/u/')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(res).to.have.status(200); // status and json from chai-http
                        expect(res).to.be.json;
                        expect(res.body).to.be.a('array');
                        expect(res.body).to.have.lengthOf(2);

                        var testTom = res.body[0];
                        var testRyan = res.body[1];

                        expect(testTom.firstName).to.equal(testUsers[0].firstName);
                        expect(testTom.lastName).to.equal(testUsers[0].lastName);
                        expect(testTom.email).to.equal(testUsers[0].email);
                        expect(testTom.password).to.equal(testUsers[0].password);

                        expect(testRyan.firstName).to.equal(testUsers[1].firstName);
                        expect(testRyan.lastName).to.equal(testUsers[1].lastName);
                        expect(testRyan.email).to.equal(testUsers[1].email);
                        expect(testRyan.password).to.equal(testUsers[1].password);

                        done();
                    });
            });
        });
        afterEach(function (done) {
            User.remove({}, function (err) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('POST /api/u/add/ to create a user', function () {
        it ('should not POST a user without a firstName field', function (done) {
            var user = deepcopy(testUsers[0]);
            delete user.firstName;
            chai.request(app)
                .post('/api/u/add/')
                .send(user)
                .end( function (err, res) {
                    expect(res).to.have.status(500);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('errorCode');
                    expect(res.body).to.have.property('message');
                    done();
                });
        });
        it("adds user to database", function(done) {
            var testUser = deepcopy(testUsers[1]);
            chai.request(app)
                .post('/api/u/add')
                .send(testUser)
                .end(function(err, res) {
                    if (err) return done(err);
                    expect(res).to.have.status(200);

                    User.findOne(testUser, function(err, user) {
                        if (err) return done(err);
                        expect(user._doc).to.be.a('object');
                        // Remove added mongo stuff so we can deep compare
                        delete user._doc._id;
                        delete user._doc.__v;
                        // Check if retrieved user and inserted user are equal
                        expect(user._doc).to.deep.equal(testUser);

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

    describe("GET /api/u/:uid lookup specific user", function () {
        it("retrieves a non-existent user from the database", function (done) {
            chai.request(app)
                .get('/api/u/' + "53f1dadae7cf8b355811c77e")
                .end(function (err, res) {
                    expect(res).to.have.status(404);

                    expect(res.body).to.be.a('object');
                    expect(res.body.errorCode).to.eql(404);
                    expect(res.body.message).to.exist;
                    done();
                });
        });
        it("retrieves a user from the database", function (done) {
            var testUser = deepcopy(testUsers[1]);
            User.create(testUser, function (err, user) {
                if (err) return done(err);
                chai.request(app)
                    .get('/api/u/' + user._id)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(res).to.have.status(200);

                        expect(res.body).to.be.a('object');
                        expect(res.body.firstName).to.exist;
                        expect(res.body.lastName).to.exist;
                        expect(res.body.email).to.exist;
                        expect(res.body.password).to.exist;

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

    describe('PATCH /api/u/update/:uid to update a specific user', function (done) {
        it('it should PATCH a user', function (done) {
            // Add second base user to database
            User.create(testUsers[1], function (err, user) {
                if (err) return done(err);
                // Create copy of second user and modify name then attempt patch
                var testUser = deepcopy(testUsers[1]);
                testUser.firstName = "Bob";
                chai.request(app)
                    .patch('/api/u/update/' + user._id)
                    .send(testUser)
                    .end(function (err, res) {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body.firstName).to.eql(testUser.firstName);
                        expect(res.body.firstName).to.not.eql(testUsers[1].firstName);
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

    describe('DELETE /api/u/remove/:uid to remove a specific user', function (done) {
        it ('it should remove a user', function (done) {
            User.create(testUsers[0], function (err, user) {
                if (err) return done(err);
                chai.request(app)
                    .delete('/api/u/remove/' + user.id)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.a('object');
                        expect(res.body.Status).to.eql("Successful");
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
