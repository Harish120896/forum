var mongoose = require("mongoose")
,Schema = mongoose.Schema;

var Column = new Schema({

    name:String,
    id:String,
    top:Boolean,
    accessNum:Number,
    updateTime:Number,
    createTime:Number,
    des:String

})

var Reply = new Schema({
    createTime:Number,
    updateTime:Number,
    id:String,
    title:String,
    body:String,
    authorId:String,
    parentId:String,
    topicId:String,
    updateTimeout:Number

})

var Topic  = new Schema({
    id:String,
    title: String,
    body:String,
    authorId:String,
    columnId:String,
    accessNum:Number,
    createTime:Number,
    updateTime:Number
})

var User = new Schema({

    role:Number,
    nickname:String,
    loginname:String,
    email:String,
    password:String,
    fraction:String,
    createTime:String

})

var dbs = {
    User:User,
    Column:Column,
    Topic:Topic,
    Reply:Reply
}

module.exports = {
    getDB:function(db_name){
        return dbs[db_name];
    }
}