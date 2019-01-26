---
title: Vue项目中常用模块
date: 2018-08-29 19:59:05
categories: Vue
tags: [Vue]

---
最近被项目组安排到写前端，用的框架是vue。下面就记录一些常用的npm模块和vue相关的知识。
<!-- more -->
### Mockjs模拟数据
在后台接口未开发完成之前模拟数据，并返回，完成前台的交互；在后台数据完成之后，你所做的只是去掉mockjs：停止拦截真实的ajax，仅此而已。
#### 安装与引用
[网站](http://mockjs.com/)
`npm install mockjs --save`
`import Mock from 'mockjs'`
#### 运用实例
``` javascript
<script>
    import axios from "axios";
    import Mock from 'mockjs'
    export default {
        data() {
            return {
                userData: {
                    total: null,
                    list: []
                }
            };
        },
        created() {     
            this.initGetData(); 
        },
        methods: {
            initGetData: function () {
                new Promise((resolve, reject) => {})
                    .then(this.getUserData())
                    .catch(
                        reject(error)//请求失败数据返回
                    )
            },
            //Mock生成数据
            templateFunction: () => {
                const Random = Mock.Random;
                var id = 0;
                var len = 10;
                let data = {
                    code: 1000,
                    msg: '成功',
                    total: len,
                    data: new Array()
                }
                for (var i = 0; i < len; i++) {
                    var obj = new Object();
                    obj.id = id++;
                    obj.age = Random.integer(18, 25);//生成1-5随机值
                    obj.password = Random.natural();//生成16位随机值
                    obj.username = Random.ctitle();//生成4位中文
                    obj.time = Random.date('yyyy-MM-dd');//生成日期
                    obj.describe = Random.cparagraph();//生成一句话
                    data.data.push(obj);
                }
                return data;
            },
            getUserData() {
                var vm = this;
				//Mock.mock(rurl,template)
                Mock.mock("getAllUserData", vm.templateFunction);
                axios.get("getAllUserData").then(res => {
                    console.log(res);
                    vm.userData.total = res.data.total;
                    vm.userData.list = res.data.data;
                })
            },
        }
    };
</script>
```
Mock.mock(rurl,template)
重点就是写数据模板。当拦截到匹配 rurl 的 Ajax 请求时，将根据数据模板 template 生成模拟数据，并作为响应数据返回。
通过axios请求设置的那个rurl。userData可以获取到10条随机数据。

### 代理服务器
#### express和http-proxy-middleware创建代理服务器
起因：发布wmts服务不管通过怎么样的方式去调用都出现跨域的问题。
跨域的原因都是浏览器的同源策略，域名、协议、端口相同。
解决方案：创建代理服务器，服务器不存在跨域问题，所以可以由服务器请求所要域的资源再返回给客户端。

``` javascript
const express = require('express')
var proxy = require('http-proxy-middleware');
const app = express()


// proxy middleware options
var options = {
	//此处地址是公司的wmts，需要vpn访问。
    target: 'http://172.17.0.179/ArcGIS/rest/services/FTKSJ/NANSHAN_CGCS2000/MapServer', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
        //   '^/api/old-path': '/api/new-path', // rewrite path
        //   '^/api/remove/path': '/path', // remove base path
        "^/api": ""
    }
}
// create the proxy (without context)
var exampleProxy = proxy(options)

app.use('/api', exampleProxy);
const port = 8081;
//开启监听
app.listen(port, () => console.log('Example app listening on port' + port + ' !'))

```
访问 `localhost:8081/api`就相当于访问了`target`指向的地址。
上面这个🌰也只是用到`http-proxy-middleware`的一些皮毛。更多高级功能去npm&&github中查看。
#### vue项目设置代理
用vue-cli搭建的项目内置集成了`http-proxy-middleware`,所以找到config📁下的index.js中的proxyTable属性添加。

``` javascript
proxyTable: {
      /**
       * 设置武汉地图服务的代理，避免跨域。--oouyang
       */
      '/api': {
        target: 'http://172.17.0.179/ArcGIS/rest/services/FTKSJ/NANSHAN_CGCS2000/MapServer',
        changeOrigin: false,
        pathRewrite: {
          "^/api": ""
        }
      }
    },
```


### 封装Vue的公共方法
