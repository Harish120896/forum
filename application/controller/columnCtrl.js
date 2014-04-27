var express = require('express');
var router = express.Router();
var domain = require("../../domain");

router.post("/create",function(req,res){
    domain.repos.Column.create(req.body,function(err,column){
        column = column || {};
        res.send({error:err,columnId:column._id});
    })
})

router.post("/:id/updateInfo",function(req,res){
    domain.call("Column.updateInfo",req.params.id,[req.body.name,req.body.des]);
    res.send();
})

router.post("/:id/setManager",function(req,res){
    domain.call("Column.setManager",req.params.id, [req.body.managerId]);
    res.send();
})

router.post("/:id/top",function(req,res){
    domain.call("Column.top",req.params.id);
    res.send();
})

module.exports = router;