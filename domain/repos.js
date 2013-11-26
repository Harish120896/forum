module.exports = wrap;

function wrap(my) {

    var replyRepo = new my.Repository("Reply");

    var columnRepo = new my.Repository("Column");
    columnRepo._create = function (args, callback) {
        var Column = my.Aggres.Column;
        var column = new Column(args.name, args.des);
        callback(null, column);
    }

    columnRepo._aggre2data = function (aggre) {
        return {
            name: aggre._name,
            id: aggre._id,
            top: aggre._top,
            accessNum: aggre._accessNum,
            updateTime: aggre._updateTime,
            createTime: aggre._createTime,
            des: aggre._des
        }
    }

    columnRepo._data2aggre = function(data){
        var aggre = new my.Aggres.Column(data.name,data.des);
        aggre._updateTime = data.updateTime;
        aggre._id = data.id;
        aggre._top = data.name;
        aggre._accessNum = data.accessNum;
        aggre._createTime = data.createTime;
        return aggre;
    }

    return [replyRepo, columnRepo];
}