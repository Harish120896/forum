var query = require("../application/query");
var dbs = require("../application/dbs");
var shortid = require("shortid");
var clearDB =require("./util/clearDB");

describe("query",function(){

    it("#clearDB",function(done){
        clearDB().then(done);
    });

    it("#get user by id",function(done){
        var uid = shortid();
        dbs.save("User",{id:uid,name:"leo"},function(){
            query["get user by id"](uid).then(function(user){
                user.id.should.eql(uid);
                done();
            })
        })
    });

    it("#get replyList by user's id",function(done){
        dbs.save("Reply",{name:"r001",authorId:"a01",creatTime:Date.now()},function(){
            dbs.save("Reply",{name:"r002",authorId:"a01",creatTime:Date.now()},function(){
                query["get replyList by user's id"]("a01").then(function(result){
                    result.length.should.eql(2);
                    done();
                })
            })
        })
    })

    it("#get topicList by user's id",function(done){
        dbs.save("Topic",{name:"r001",authorId:"a01",creatTime:Date.now()},function(){
            dbs.save("Topic",{name:"r002",authorId:"a01",creatTime:Date.now()},function(){
                query["get topicList by user's id"]("a01").then(function(result){
                    result.length.should.eql(2);
                    done();
                })
            })
        })
    })

    it("#get infoList by user's id",function(done){

        dbs.save("Info",{name:"r001",targetId:"a01",creatTime:Date.now()},function(){
            dbs.save("Info",{name:"r002",targetId:"a01",creatTime:Date.now()},function(){
                query["get infoList by user's id"]("a01").then(function(result){
                    result.length.should.eql(2);
                    done();
                })
            })
        })
    })

    it("#get messageList by user's id",function(done){

        dbs.save("Message",{name:"r001",targetId:"a01",creatTime:Date.now()},function(){
            dbs.save("Message",{name:"r002",targetId:"a01",creatTime:Date.now()},function(){
                query["get messageList by user's id"]("a01").then(function(result){
                    result.length.should.eql(2);
                    done();
                })
            })
        })
    })

    

})