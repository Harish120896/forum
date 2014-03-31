计划
===

4月1日晚8点开测 论坛地址：http://jsera.net

测试计划：4月份小范围删档公测，5月、6月不删档公测，7月1日发布beta1.0

论坛模块概念
==========

`core` 是核心对象，实现了全部论坛功能。通过调用 core.exec / core.call 方法对系统进行操作。

`controller控制器` 是服务于UI的中间层，介于core核心和UI之间，提供了权限控制、UI所需数据、验证码等。

`query查询` 是个从数据库或文件系统得到数据的组件，可以自己定制，但必须符合相应接口。
query是core核心层、控制器、UI都可调用的组建，它屏蔽的具体数据库，达到切换各种数据库的接口。

`view 动态页` 是依赖控制器的。


定义查询组件
==========

查询query，是应用程序与数据库之间的桥梁，用于获取数据。

#### 定义query

```

// 第一种查询组件定义方式

var query = require("query-brighthas");

// 添加一个查询
query
    .add(
        "get a user",  // 查询名称
        ["id",{require:true}], // 限定查询参数, 表示必须要提供一个id，如果不提供会得到一个 callback(null)
        function(args,callback){  // 查询函数, 最终返回一个值，只能赋予一个参数。
            ......
            callback(xxx)

        })
    .add(
        "all users",
        function(args,callback){
            ......
            callback(xxx)

        })


```

```

// 其他查询组件定义方式

var query = {

    // 第二种方式，args参数没有被限定，需要函数自己处理
    "find a user":function(args,callback){

    },

    // 第三种方式，和第一种方式一样，只不过形式不同而已.
    "find a user":{

        args:{
            "id":{require:true}
        },

        handle:function(args,handle){

        }
    },


    // 第四种方式，和第一种方式一样，只不过形式不同而已.
    "find a user":{
        args:["id",{require:true}], // 和第三种参数限制一样，形式不同而已。
        handle:function(args,handle){

        }
    }

}


```

LICENSE
=======

GPLv3