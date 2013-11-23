var check = require('validator').check;

module.exports = wrap;

function wrap(my) {

    service1.serviceName = "existColumn";

    function service1(columnId, callback) {
        my.repos.Column.get(columnId, function (err, col) {
            if (col) {
                callback(true);
            } else {
                callback(false);
            }
        })
    }


    service2.serviceName = "existPost";

    function service2(postId, callback) {
        my.repos.SubPost.get(postId, function (err, post) {
            if (col) {
                callback(true);
            } else {
                callback(false);
            }
        })
    }


    service3.serviceName = "updateColumnValidator";

    function service3(name, des) {

        if (name === name.trim() && des === des.trim()) {
            check(name).len(5, 15);
            check(des).len(0, 200);
        } else {
            throw new Error();
        }
    }

    service4.serviceName = "updatePasswordValidator";

    function service4(password) {
        if (password === password.trim()) {
            check(password).len(6, 18);
        } else {
            throw new Error();
        }
    }

    return [service1, service2, service3, service4];

}

