
module.exports = wrap;

function wrap(my){

    service1.serviceName = "existColumn";

    function service1(columnId,callback){
        my.repos.Column.get(columnId,function(err,col){
            if(col){
                callback(true);
            }else{
                callback(false);
            }
        })
    }


    service2.serviceName = "existPost";

    function service2(postId,callback){
        my.repos.SubPost.get(postId,function(err,post){
            if(col){
                callback(true);
            }else{
                callback(false);
            }
        })
    }

    return [service1,service2];

}

