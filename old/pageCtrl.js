var express = require('express');
var router = express.Router();
var query = require("../application/query");

// 错误代码
var ERROR_CODE = {
    NO_LOGIN:1
}



/*-------------------- pages ---------------------*/
router.get("/",function(req,res){

})

router.get("/user/:id",function(req,res){

})

router.get("/topic/:id",function(req,res){

})

router.get("/topic/search",function(req,res){

})

router.get("/column/:id",function(req,res){

})

module.exports = router;

