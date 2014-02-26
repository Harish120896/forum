var dbs = require("./db");
var crypto = require("crypto");
var md5 = crypto.createHash('md5');
var pwd = md5.update("123456").digest("hex");
var domain = require("./domain");
var Node = require("tree-node");

var replyTree = new Node();


// create a user
dbs.getDB("User").insert({id:"u001",email:"leo@leo.leo",nickname:"leo",password:pwd});

// create a column
dbs.getDB("Column").insert({name:"column name",body:"column content",id:"c001",managerId:"u001"});

// create a topic
dbs.getDB("Topic").insert({id:"t001",title:"topic title",body:"topic conent",replyTree:replyTree.toJSON(), authorId:"u001",columnId:"c001"});

