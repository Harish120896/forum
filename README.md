这是个开始，更多文档逐步完善。

介绍
=====

论坛核心采用CQRS框架[JSDM](https://github.com/brighthas/jsdm)开发，应用层采用MVC Express框架，UI前端采用Angular。

论坛设计分三层，领域核心层包含了所有功能，然后是应用层和UI层，核心层没有任何权限限制，所以需要应用层加以控制，
权限控制是指，用户的登录与否等。

通过 domain.exec 和 domain.call 函数可以调用核心层功能。

运行
===

    var forum = require("forum")();

    forum.app.listen(3000); // 运行

配置
====

下面是个配置对象，都是可选的，都具有默认值，也可以替换部分属性达到相应效果。

    var config = {

        "query",          // 查询组件

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
        "getById",

        /*
        * 根据领域层create update remove 事件更新数据库，
        * 可以自定义，替换这个默认函数
        */
        "update_db",

        "admin_email",       // 用这个邮箱注册的将为管理员
        "sys_email",         // 这个邮箱用于发送邮箱

        "contrller_path",    // 控制器目录
        "route_path,         // 路由目录，将加载该目录下的路由器
        "static_path,        // 静态文件目录路径
        "view_path"          // 视图文件目录路径
    }


    var forum = require("forum")(config);


forum 对象
==========

forum.domain 论坛的领域对象。

forum.app 是Express应用对象。


domain.exec 核心层命令
====================

#### 调用 `domain.exec` 函数可以操作核心层，以下是命令列表。

##### create a topic 创建一个主题

domain.exec("create a topic",参数,回调函数)

##### remove a topic

删除一个主题贴

##### create a reply

创建一个回复贴

##### create a user

创建一个用户

##### remove a reply

删除一个回复

##### create a column

创建一个栏目

##### send message

发送一条私信

##### top topic

置顶一个主题帖

##### down topic

下架一个置顶的主题帖

##### remove a user

删除一个用户

##### isCustomLogo

设置是否是自定义头像

domain.call 核心层命令
====================

#### 调用 `domain.call` 函数可以操作核心层，以下是命令列表。

##### User.plus

`domain.call("User.plus",用户ID,[分数],[回调函数])` 为用户加积分。

##### User.updatePassword

更改用户密码

##### User.follow

关注用户

##### User.unfollow

取消关注用户

##### User.becomeAdmin

设置用户为终极管理员

##### User.becomeModerator

设置用户为版主

##### User.becomeUser

设置用户为普通用户，默认。

##### User.sealUser

屏蔽用户，通过调用 User.becomeUser 命令可以解除屏蔽。

##### User.updateInfo

更改用户 性别 、个人描述 、 地址 信息。

##### 待续 ...

LICENSE
=======

GPLv3