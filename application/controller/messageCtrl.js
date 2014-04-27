var express = require('express');
var router = express.Router();
var filterNickname = require("../filterNickname");
var domain = require("../../domain");

router.post("/send",function(req,res){
    domain.repos.Message.create(req.body,function(err,msg){
        res.send({error:err,messageId:msg._id});
    });
});

module.exports = router;