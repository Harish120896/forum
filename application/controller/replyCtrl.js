var express = require('express');
var router = express.Router();
var domain = require("../../domain");

router.post("/create",function(req,res){
    domain.repos.Reply.create(req.body,function(err,reply){
        res.send({error:err,replyId:reply._id});
    });
})

module.exports = router;