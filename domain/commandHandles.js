module.exports = wrap;

function wrap(my){



    //////////////////////  command handle for Topic  ////////////////////
    // create a topic.
    handle1.commandName = "create a topic";
    function handle1(args,callback){
        my.repos.Topic.create(args,callback);
    }


    // remove a topic
    handle2.commandName = "remove a topic";
    function handle2(args,callback){
        my.repos.Topic.get(args.id,function(err,topic){
            if(topic){
                topic.removeReply();
                topic.remove();
            }
            callback();
        });
    }

    // update a topic
    handle3.commandName = "update a topic";
    function handle3(args,callback){
        my.repos.Topic.get(args.id,function(err,topic){
            if(topic){
                topic.updateInfo(args.title,args.body,args.columnId);
            }
            callback();
        })
    }


    //////////////////////  command handle for User  ////////////////////
    handle4.commandName = "create a user";
    function handle4(args,callback){

        my.repos.User.create(args,callback);
    }

    return [handle1,handle2,handle3,handle4]
}