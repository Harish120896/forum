var dbs = require("./db");
var path = require("path");

module.exports = {

    "core_route_paths": {
        call: "/call",
        exec: "/exec",
        query: "/query"
    },

    "query": require("./query"),          // 查询组件

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
    "getById": require("./db").get,

    /*
     * 根据领域层 create update remove 事件更新数据库，
     * 可以自定义，替换这个默认对象
     */
    "core_changed_handles": require("./core_changed_handles"),

    "admin_email": "brighthas@gmail.com",       // 用这个邮箱注册的将为管理员
    "sys_email": "308212012@qq.com",         // 这个邮箱用于发送邮箱

    "contrller_path": path.join(__dirname, "..", "/controller"), // 控制器目录
    "view_path": path.join(__dirname, "..", "/views"),            // 视图文件目录路径

    "static_path": path.join(__dirname, "..", "/public")        // 静态文件目录路径

}
