require("./update_db"); // 监听领域层 create 、update、remove 事件，更新数据库。

module.exports = {
    query:require("./query"),
    get:require("./db").get
}