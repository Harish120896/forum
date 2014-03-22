if (typeof app === "undefined") {
    app = null;
}
(function (angularapp) {


    var ability = {
        canUpdateColumn: function (user) {
            return user.role === 1;
        },
        canRemoveTopic: function (user, topic, column) {
            try {
                return user.role === 1 || (topic.authorId === user.id && !topic.top) || (column.managerId === user.id && !topic.top);
            } catch (e) {
                return false;
            }
        },
        canUpdateTopic: function (user, topic, column) {
            try {
                return user.role === 1 || (topic.authorId === user.id && !topic.top) || (column.managerId === user.id && !topic.top);
            } catch (e) {
                return false;
            }
        },
        canRemoveReply: function (user, reply, topic, column) {
            try {
                return user.role === 1 || column.managerId === user.id || topic.authorId === user.id || reply.authorId === user.id;
            } catch (e) {
                return false;
            }
        }

    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = ability;
    } else {
        angularapp.factory("ability", function () {
            return ability;
        })
    }

})(app);