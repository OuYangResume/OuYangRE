---
title: express常用功能
date: 2018-11-21 10:23:20
categories: NodeJS
tags: [express]

---

Express基于 Node.js 平台，快速、开放、极简的 Web开发框架.本篇文章实现连接mysql||mongodb数据库提供RESTful服务和文件上传。根据这两个功能和nginx搭建一个简易图片服务器。
<!-- more -->
### helloworld
安装`npm install express --save`.


```   javascript
const express = require('express')
const app = express()

app.get('/', (req, res) =>{
res.header('Access-Control-Allow-Origin', '*') //解决跨域问题
    let userData=[
        {name:"oouyang",age:23},
        {name:"zhangsan",age:22}
    ]
    res.send(userData);
})

const port =8082;
//开启监听
app.listen(port, () => console.log('Example app listening on port'+port+' !'))
```

启动 node server.js 然后`http://localhost:8082`在浏览器中加载以查看输出。

### 集成数据库
安装依赖并配置 `npm install mysql`
```
//数据库配置文件mysqlEngine
const mysql = require('mysql')
var connection = mysql.createConnection({
    host: '39.108.100.163',
    user: 'root',
    password: '*******',
    database: 'test'
});
module.exports =connection;
```
引用内置router中间件
``` javascript
//user.js文件
const express = require('express')
const router = express.Router()
const connection = require('../uilts/mysqlEngine') //数据库配置

//创建一个connection
connection.connect(function (err) {
    if (err) {
        console.log('连接失败' + err);
        return;
    }
    console.log('[connection connect]  succeed!');
});

router.get('/getAllUser', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //解决跨域问题
    let sql= 'SELECT * from user'
	//执行sql
    connection.query(sql, function (err, rows, fields) {
        if (err) throw err
        //console.log('The solution is: ', rows[0]);
        res.send(rows);
    })
    connection.end() //关闭连接
})

module.exports= router
```
注册中间件
``` javascript

const express = require('express')
const app = express()

let userRouter = require('./routers/user.js')
//注册
app.use('/user', userRouter)

const port =8082;
//开启监听
app.listen(port, () => console.log('Example app listening on port'+port+' !'))
```
启动 `http://localhost:8082/user/getAllUser`

### 文件上传
安装依赖`npm install --save multer` [multer](https://www.npmjs.com/package/multer)
``` javascript
const express = require('express')
const router = express.Router()

var fs = require('fs');
var multer  = require('multer') //文件上传

var createFolder = function(folder){
    try{
        fs.accessSync(folder)
    }catch(e){
        fs.mkdirSync(folder)
    }
}

var uploadFolder="./upload/";
createFolder(uploadFolder);
//设置文件上传目录和文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder)
    },
    filename: function (req, file, cb) {
    //   cb(null, file.fieldname + '-' + Date.now())
    cb(null, file.originalname)
    }
  })
  var upload = multer({ storage: storage }) 
//文件上传
router.post('/upload',upload.single('avatar'),(req,res)=>{
    //avatar 是文件的上传的name还需修改
    res.send("上传成功aaaa")
    console.dir(req.file)
})
module.exports= router
```
上传页面
```
<template>
    <div>
        <h3>文件上传：</h3>
        选择一个文件上传: <br />
        <form action="http://localhost:8082/user/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="avatar" />
            <br />
            <input type="submit" value="上传文件" />
        </form>
    </div>
</template>
```
### 图片服务
目前还在开发中，说到就肯定做不到。