var express = require('express');
var http = require('http');
var fs = require("fs");
var path = require("path");
var app = express();
var init = false;
var core = require("./core");
var config = require("./basic/config");
var coredoor = require("./core_door");
var Result = require("result-brighthas");

module.exports = function(conf) {

    if (init) return;

    init = true;

    // 新配置
    if (conf) {
        for (var k in conf) {
            config[k] = conf[k];
        }
    }

    // 服务于控制器的工具
    var util = require("./util")(config.query);

    // 为core添加getQuery服务service
    core.register("service",function wrap(my) {
        getQuery.serviceName = "getQuery";
        function getQuery() {
            return config.query;
        }

        return getQuery;
    }, "get", config.getById).seal(); // 封印

    app.use(express.favicon(__dirname + '/public/favicon.ico'));
    app.use(express.static(config.static_path));
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

    app.use(function(req,res,next){
        req.result = new Result();
        next();
    });

    app.use(app.router);

    var my = {
        app:app,
        query:config.query,
        core:core,
        config:config,
        util:util
    }

    // 初始化核心入口控制器
    coredoor(my);

    // 加载默认头像
    app.get("/logo/*",function(req,res){
      res.redirect("/logo/guest.jpg");
    })

    // 加载控制器
    fs.readdirSync(config.contrller_path).forEach(function (filename) {
        require(config.contrller_path + "/" + filename)(my);
    });

    // 调用 监听core create/update/remove 事件，并更新数据库
    var create_handle = config.core_changed_handles["*.*.create"];
    core.on("*.*.create", create_handle);

    var update_handle = config.core_changed_handles["*.*.update"];
    core.on("*.*.update", update_handle);

    var remove_handle = config.core_changed_handles["*.*.remove"];
    core.on("*.*.remove", remove_handle);

    return app;

}