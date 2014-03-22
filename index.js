var express = require('express');
var http = require('http');
var fs = require("fs");
var path = require("path");
var app = express();
var init = false;
var domain = require("./domain");
var Result = require("result-brighthas");

var config = {

    "query": require("./basic/query"),          // 查询组件

    /*
     *  通过ID查询的函数，可自定义
     *
     *  functon(type, id, cb){
     *
     *  }
     *
     *  type 字符串 表示类型，比如 Topic User 等
     *  id 对象id
     *  cb 回调函数 function(err,obj){}
     *
     */
    "getById": require("./basic/db").get,

    /*
     * 根据领域层create update remove 事件更新数据库，
     * 可以自定义，替换这个默认函数
     */
    "update_db": function (domain) {

        var dbs = require("./basic/db");
        var crypto = require("crypto");

        domain.on("*.*.create", function (className, data) {
            if (className === "User") {
                data.logo = crypto.createHash("md5").update(data.email).digest("hex");
            }
            dbs.save(className, data, function () {
            });
        });

        domain.on("*.*.update", function (className, id, data) {
            dbs.update(className, id, data, function () {
            });
        });

        domain.on("*.*.remove", function (className, id) {
            dbs.remove(className, id);
        });
    },

    "admin_email": "brighthas@gmail.com",       // 用这个邮箱注册的将为管理员
    "sys_email": "brighthas@gmail.com",         // 这个邮箱用于发送邮箱

    "contrller_path": __dirname + "/controller", // 控制器目录
    "route_path": __dirname + "/route",          // 路由目录，将加载该目录下的路由器
    "static_path": __dirname + "/public",        // 静态文件目录路径
    "view_path": __dirname + "/views"            // 视图文件目录路径
}

module.exports = function (conf) {

    if (!init) {
        init = true;

        // 新配置
        if (conf) {
            for (var k in conf) {
                config[k] = conf[k];
            }
        }

        // 为domain添加getQuery服务service
        domain.register("service",function wrap(my) {
            getQuery.serviceName = "getQuery";
            function getQuery() {
                return config.query;
            }

            return getQuery;
        }, "get", config.getById).seal(); // 封印

        // 控制器
        var ctrls = {}

        // 加载控制器
        fs.readdirSync(config.contrller_path).forEach(function (filename) {
            var filepath = config.contrller_path + "/" + filename;
            ctrls[path.basename(filepath, ".js")] = require(filepath)(domain, config.query);
        });

        app.set('views', path.join(config.view_path));
        app.engine('.html', require('ejs').__express);
        app.set('view engine', 'html');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.methodOverride());
        app.use(express.bodyParser());
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());

        app.use(
            function (req, res, next) {
                req.result = new Result();
                next();
            });

        app.locals.markdown = require("marked");
        app.use(app.router);
        app.use(express.static(config.static_path));

        // 加载路由器
        fs.readdirSync(config.route_path).forEach(function (filename) {
            require(config.route_path + "/" + filename)(app, ctrls);
        });

        // 调用 监听domain create/update/remove 事件，并更新服务器
        config.update_db(domain);

    }

    return {
        domain: domain,
        app: app
    }

}