module.exports = wrap;
var filterNickname = require("./../domain/filterNickname");

function wrap(my) {


    handle7.commandName = "send message";

    function handle7(args, callback) {
        var title = args.title;
        var body = args.body;
        var body2 = body.replace(/(?:@)\w*(?=\s|$)/gi, "");
        var authorId = args.authorId;
        if (body) {
            filterNickname(body).forEach(function (name) {
                my.services.userByNick(name, function (user) {
                    if (user) {

                        my.repos.Message.create({
                            title: title,
                            body: body2,
                            authorId: authorId,
                            targetId: user.id
                        }, function (err) {
                        });
                    }
                });
            });
        }
        callback();
    }

    return [handle1, handle2, handle3, handle4, handle5, handle6, handle7, handle8, handle9, handle10, handle11];

}
