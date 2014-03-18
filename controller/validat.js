
module.exports = {
    removeTopicValidat:function(req,res,next){
        if(req.result.hasError()){
            return next();
        }
        var topic = req.result.data("topic");
        var user = req.session.user;

        next();
    }
}