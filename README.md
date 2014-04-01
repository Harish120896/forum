
#### 眼下放到测试服务器，所以感觉很慢，5月份上正式服务器。

快速运行
=======

##### 安装

   npm install forum

##### 启动程序

例如 run.js

```
var app = require("forum")({
    admin_email:"xxxxx@xxx.xxx"  // 这个是管理员email，当你第一次用这个邮箱注册，你就成为超级管理员。
});

app.listen(3000);

```

运行 node run.js 即可运行。

论坛模块概念
==========

`core` 是核心对象，实现了全部论坛功能。通过调用 core.exec / core.call 方法对系统进行操作。

`controller控制器` 是服务于UI的中间层，介于core核心和UI之间，提供了权限控制、UI所需数据、验证码等。

`query查询` 是个从数据库或文件系统得到数据的组件，可以自己定制，但必须符合相应接口。
query是core核心层、控制器、UI都可调用的组建，它屏蔽的具体数据库，达到切换各种数据库的接口。

`view 动态页` 是依赖控制器的。


定义查询组件
==========

查询query，是应用程序与数据库之间的桥梁，用于获取数据。 我们知道查询在任何一个系统中都至关重要，所以要如何发挥其规范性是至关重要的环节；
另外如何能不依赖特定数据库，这个问题也是值得深思，为了做到这一点，我们需要特殊的方式。

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

#### 调用一个查询

// 第一种调用方式
query("get a user",{id:"001"},function(result){
    ... ...
})

// 第二种调用方式，效果和第一种方式等效，不过形式不同。
// 第二种方式返回一个 promise ，推荐这种调用方式，好处大家都知道。
query("get a user",{id:"001"}).then(function(result){
    ... ...
})

```

LICENSE
=======

GPLv3