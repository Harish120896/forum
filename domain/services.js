
module.exports = wrap;

function wrap(my){

    function service1(columnId,callback){
        my.repos.Column.get(columnId,function(err,col){
            if(col){
                callback(true);
            }else{
                callback(false);
            }
        })
    }

    service1.serviceName = "existColumn";

    return [service1];
}

