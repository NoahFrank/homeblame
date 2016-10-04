// Need to require so the api starts up
var app = require("../../app");

// Testing requires
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

    before(function(done) {
        User.create(testUsers, function (err) {
            expect(err).to.be.null;
            done();
        });
    });

    describe("Get all users", function() {
        it("returns all users in the user database", function(done) {
            chai.request(app)
                .get('/api/u/')
                .end(function(err, res) {
                    expect(err).to.be.null;
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

    describe("Add user", function() {
        it("adds user to database", function(done) {
            var testUser = {firstName: 'Noah', lastName: 'Frank', email: 'naf@rit.edu', password: 'tester'};
            chai.request(app)
                .post('/api/u/add')
                .send(testUser)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    User.findOne(testUser, function(err, user) {
                        expect(err).to.be.null;

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
    });

    describe("Get a specific user", function() {
        it("retrieves a user from the database", function(done) {
          var user = new User({firstName: 'Colin', lastName: 'Thatcher', email: 'cmt@rit.edu', password: 'tester'});
          user.save(function (err, user) {
            chai.request(app)
                .get('/api/u/' + user.id)
                .end(function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);

                    expect(res.body).to.be.object;
                    expect(res.body).to.have.firstName;
                    expect(res.body).to.have.lastName;
                    expect(res.body).to.have.email;
                    expect(res.body).to.have.password;

                    done();
                });
          });
        });
    });

    // describe("Update a specific user", function() {
    //     it("updates a user from the database", function(done) {
    //       var userData = {firstName: 'Colin', lastName: 'Thatcher', email: 'cmt@rit.edu', password: 'tester'};
    //       var user = new User(userData);
    //       // User.find({}, function (err, users) {
    //       //   console.log(users);
    //       // });
    //       user.save(function (err, user) {
    //         console.log(user);
    //         userData.firstName = "Noah";
    //         chai.request(app)
    //             .patch('/api/u/update' + user.id)
    //             .send(userData)
    //             .end(function(err, res) {
    //                 expect(err).to.be.null;
    //                 expect(res).to.have.status(200);
    //
    //                 // expect(res.body).to.be.object;
    //                 // expect(res.body).to.have.firstName.equal("Noah");
    //                 done();
    //             });
    //       });
    //     });
    // });

    afterEach(function (done) {
        User.remove({}, function() {
            done();
        });
    });

});
