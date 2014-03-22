var request = require("supertest");
var express = require("express");
var columnCtrl = require("../../controller/column");
var assert = require("assert");
var should = require("should");
var env = require("../util/env");
var dbs = require("../util/db");

require("../util/testInit");

var result = require("../../controller/util").result;

var DATA = require("../../controller/data");

describe("columnCtrl", function () {

    it("#create", function (done) {

        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());

        app.use(result);
        app.use(env);
        app.use(app.router);

        app.post("/create", columnCtrl.create, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });

        request(app).post("/create")
            .send({
                name: "title001",
                body: "hahahhahhhahhaha"
            })
            .expect('success', done);

    });

    it("#update", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(result);
        app.use(env);
        app.use(app.router);


        app.post("/update/:id", columnCtrl.update, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });


        request(app).post("/update/c001")
            .send({
                name: "title001",
                body: "hahahhahhhahhaha"
            })
            .expect('success', done);

    })

    it("#up", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(result);
        app.use(env);
        app.use(app.router);


        app.post("/up/:id", columnCtrl.up, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });


        request(app).post("/up/c001")
            .send({})
            .expect('success', done);

    })

    it("#up", function (done) {
        var app = express();
        app.use(express.favicon());
        app.use(express.json());
        app.use(express.methodOverride());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(result);
        app.use(env);
        app.use(app.router);


        app.post("/setManager/:id", columnCtrl.setManager, function (req, res) {
            if (req.result.hasError()) {
                res.send("error");
            } else {
                res.send("success");
            }
        });


        request(app).post("/setManager/c001")
            .send({
                userId: "u001"
            })
            .expect('success', done);

    })

});
