
// only test .
var q;
module.exports = function(q_,callback){
    if(q){
        callback(true)
    }else{
        callback(false);
        q = q_;
    }
}