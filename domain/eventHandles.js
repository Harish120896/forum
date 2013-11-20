
module.exports = wrap;

function wrap(my){

    handle1.eventName = "removeSubMark";

    function handle1(ids){
        ids.forEach(function(id){
            my.repos.SubPost.remove(id);
        })
    }

    return [hande1];
}
