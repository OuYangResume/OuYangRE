---
title: 浏览器indexDB的使用
date: 2019-03-11 22:20:02
categories: blog
tags: [SQL,Vue] 

---

本地存储介绍一下HTML5时代带来的本地化存储技术， localStorage 、sessionStorage、WebSQL、indexedDB等.

+ localStorage 用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。
+ sessionStorage 用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。
+ cookie数据始终在同源的http请求中携带(即使不需要)，即cookie在浏览器和服务器间来回传递。
<!--more-->
+ IndexedDB 允许储存大量数据，提供查找接口，还能建立索引。这些都是 LocalStorage 所不具备的。就数据库类型而言，IndexedDB 不属于关系型数据库（不支持 SQL 查询语句），更接近mongodb数据库。

我目前编写Vue项目中用于存储数据字典等。下面就是创建,获取，更新，写入等基本操作。
编写公共方法，并注册到Vue的生命周期中。

``` javascript
install(Vue) {
        //定义一个vue的全局变量，用于获取创建indexdb的生命周期
        Vue.prototype.db=null;
         /**
         * @description: 初始化浏览器的indexdb数据库
         * @param {type} 
         * @return: 
         */
        Vue.prototype.initIndexDB = (callback) => {
            /**
             * @description: //创建数据库，第一个是数据库名,第二个是数据库的版本号
             * @param {type} 
             * @return: 同时返回一个IDBOpenDBRequest对象用于操作数据库
             */
            const request = window.indexedDB.open('myDatabase', 1);
            request.onerror = function (event) {
                console.log(event,'数据库打开报错');
            };
            //数据库升级触发的事件，创建数据库也会触发这个事件
            request.onupgradeneeded = function (event) {
                console.log(event,"onupgradeneeded")
                Vue.prototype.db = event.target.result;
                //新建数据库以后，第一件事是新建对象仓库，先判断是否存在
                if (!Vue.prototype.db.objectStoreNames.contains('person')) {
                  objectStore = Vue.prototype.db.createObjectStore('person', { keyPath: 'id' });
                }
              }
            request.onsuccess = function (event) {
                Vue.prototype.db = request.result;
                console.log(Vue.prototype.db,'数据库创建成功');
                if(typeof callback === 'function'){
                    console.log('执行回调成功');
                    callback();
                  }
            };
        }
        }
```
在App.vue去调用这个公共方法。

``` javascript 
import axios from "axios";
export default {
  name: "App",
  mounted() {
    //创建indexdb数据库
    this.initIndexDB(this.initFun);
  },
  methods: {
    /**
     * @description: 初始化方法
     * @param {type}
     * @return:
     */
    initFun() {
      let vm = this;
      vm.getUploadData().then(res => {
        console.log(vm.db);
        //向对象仓库写入数据记录。通过事务完成。
        let objStore = vm.db
          .transaction(["person"], "readwrite")
          .objectStore("person");
        console.log(res);
        let data = { name: "oouyang", age: 17, id: "3" };
        //查询数据
        let getRequest = objStore.get(4);
        getRequest.onsuccess = function(event) {
          if (getRequest.result) {
            //如果存在g更新数据
            let updateRequest = objStore.put({ id: 4, ...res.data });
            updateRequest.onsuccess = function(event) {
              console.log("数据更新成功");
            };
            updateRequest.onerror = function(event) {
              console.log("数据更新失败");
            };
          } else {
            //如果不存在，写入数据
            let insertRequest = objStore.add({ id: 4, ...res.data });
            insertRequest.onsuccess = function(event) {
              console.log("数据写入成功");
            };
            insertRequest.onerror = function(event) {
              console.log("数据写入失败");
            };
          }
        };
        getRequest.onerror = function(event) {
          console.log("获取数据事务失败");
        };
      });
    },
    /**
     * @description: 获取数据
     * @param {type}
     * @return:
     */
    getUploadData() {
      let vm = this;
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url: "http://39.108.100.163:8082/upload/getUploadByLimit"
        })
          .then(res => {
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  },
  destroyed() {
    if (this.db) {
      this.db.close();
      console.log("断开连接缓存数据库！");
    }
  }
};
```


