// Need to require so the api starts up
var app = require("../../app");

// Testing requires
var deepcopy = require('deepcopy');
var expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require('chai-http');
var sinon = require('sinon');

chai.use(chaiHttp);

// Testing database requires
var config = require("config");
var utils = require("../utils");

describe("utils functions", function() {

    describe("isAuthenticated", function () {
        it('returns 403 when no Authentication header is given', function (done) {
            var testReq = {};
            testReq.headers = {}
            var testRes = {
                send: sinon.spy(),
                status: function (status) {
                    expect(status).to.equal(403);
                    return this;
                }
            };
            var testNext = sinon.spy();
            utils.isAuthenticated(testReq, testRes, testNext);
            expect(testRes.send.called);
            expect(testNext.notCalled);
            done();
        });
        it('returns 401 when token doens\'t validate correctly', function (done) {
            var testReq = {};
            testReq.headers = {authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ODdmY2E2NzhiY2E5YTAwN2Q4ZGYzMzciLCJpYXQiOjE0ODUxMzQyNzV9.l1eRL4aTKVltmpyOjlgr9FVVCLVOFcOZ19ICR5YBVzY'}
            var testRes = {
                send: sinon.spy(),
                status: function (status) {
                    expect(status).to.equal(403);
                    return this;
                }
            };
            var testNext = sinon.spy();
            utils.isAuthenticated(testReq, testRes, testNext);
            expect(testRes.send.called);
            expect(testNext.notCalled);
            done();
        });
        it('calls next if the token validate correctly', function (done) {
            var testReq = {};
            testReq.headers = {authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNkZiJ9.tEn4fDp0P9u9nSDTHNee3NnvArrcOlN5I3zxoIL5dPc'}
            var testRes = {
                send: sinon.spy(),
                status: function (status) {
                    return this;
                }
            };
            var testNext = sinon.spy();
            utils.isAuthenticated(testReq, testRes, testNext);
            expect(testRes.notCalled);
            expect(testNext.called);
            done();
        });
    });
});
