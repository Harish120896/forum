var domain = require("../domain");
var should = require("should");
var request = require("supertest");

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var clearDB = require("./util/clearDB");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser("keyboard cat"));
app.use(session());

app.use('/', require("../application/controller/columnCtrl"));

var agent = request.agent(app);


describe("columnCtrl", function () {

    var columnId;

    it("#/create", function (done) {
        agent.post("/create").send({name: "node.js", des: ""}).end(function (err, res) {
            columnId = res.body.columnId;
            done()
        })
    })

    it("#/:id/updateInfo", function (done) {
        agent.post("/" + columnId + "/updateInfo").send({name: "express", des: "gaga"}).end(function (err, res) {
            domain.repos.Column.get(columnId).then(function (col) {
                col._name.should.eql("express");
                done()
            })
        })
    })

    it("#/:id/setManager", function (done) {

        domain.repos.User.create({id: "u001", username: "leo", email: "leo@q.q"});

        agent.post("/" + columnId + "/setManager").send({managerId: "u001"}).end(function (err, res) {
            domain.repos.Column.get(columnId).then(function (col) {
                col._managerId.should.eql("u001");
                done()
            })
        })
    })


    it("#/:id/top", function (done) {

        domain.repos.Column.get(columnId).then(function (column) {

            var updateTime = column._updateTime;

            agent.post("/" + columnId + "/top").end(function (err, res) {
                domain.repos.Column.get(columnId).then(function (col) {
                    (col._updateTime > updateTime).should.eql(true);
                    done()
                })
            })
        })
    })


})