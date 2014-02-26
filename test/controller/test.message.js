var request = require("supertest");
var express = require("express");
var msgCtrl = require("../../controller/message");
var assert = require("assert");
var should = require("should");
var env = require("../util/env");
var dbs = require("../util/db");

require("../util/testInit");

var result = require("../../controller/util").result;

var DATA = require("../../controller/data");

describe("columnCtrl", function() {

    it("#send message", function(done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());

        app.use(result);
        app.use(env);
        app.use(app.router);

        app.post("/create",
            function(req, res, next) {
                req.session.user = {
                    id: "u001"
                }
                next();
            },
            msgCtrl.send, function(req, res) {
                res.send("success")
            });

        request(app).post("/create")
            .send({
                name: "title001",
                body: "hahahhahhhahhaha"
            })
            .expect('success', done);

    });

});
