

module.exports = function wrap(domain,query){
    return {
        send: function (req, res, next) {
            if (req.result.hasError()) {
                return next();
            }
            req.body.authorId = req.session.user.id;

            domain.exec("send message", req.body, next());
        }
    }
}


