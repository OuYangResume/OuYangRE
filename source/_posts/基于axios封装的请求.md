---
title: 基于axios封装的请求
date: 2019-03-25 21:42:04
categories: Vue
tags: [axios]

---
axios非常方便，但是如果在每个组件中走一遍axios流程，最终又会写出“意大利面条”式的代码。况且很多时候在前端需要设置header，统一添加token，对异常进行处理等，所以最好对其进行封装。结合axios，能够很好的进行封装。
<!--more-->
最近项目中，前端遇到获取数据时来自各种不同的项目组，其中有一个提供空间数据的小组为了保证数据的安全性。需要在请求数据前先用规定用户名和密码请求一个token。然后将这个token当必传参数去请求空间数据。为方便同事的使用即封装了一个公共的请求方法。

``` javascript
//cudeAxios.js
import axios from 'axios';//引入axios请求
import Vue from 'vue';

let vm = new Vue({});//定义vm 等于 vue

/**
     * @description: 获取token
     * @param {type} 
     * @return: 
     */
function getToken() {
  return axios({
    method: "get",
    url: vm.usedUrl() + "getCubeDataAccessToken",
  })
    .then(res => {
      return res;
    })
    .catch(error => {
      reject(error);
    })
};
/**
 * @description: 获取块数据请求之前的token
 * @param {type}
 * @return:
 */
function getCubeToken() {
  let timestamp = new Date().getTime();
  let user = {
    userName: "user",
    passWord: "123456"
  };
  let params = {
    time: timestamp,
    user: user.userName,
    secret: vm.md5(timestamp + user.passWord)
  };
  return axios({
    method: "get",
    url: "http://192.168.1.192:9000/ksj_api/getToken",
    params: params
  })
    .then(res => {
      return res;
    })
    .catch(error => {
      reject(error);
    });
}

async function fetchPost(url, params) {
  //判断是否传请求类型
  if (!params.request_type) {//否
    params.request_type = 'post'//默认为post
  }
  //判断请求类型为post或put
  if (params.request_type == 'post' || params.request_type == 'put') {//是
    var type = 'data';//以data形式传参
  } else {//否
    var type = 'params'//以params形式传参
  }
  //设置请求参数及类型等
  let httpDefaultOpts = {
    method: params.request_type,//请求类型
    url: url,//请求链接
    // timeout: 20 * 1000,//请求超时时间
    [type]: '',//参数
  }
  //删除请求类型对象
  delete params.request_type;
  //判断参数是否data形式
  if (type == "data") {//是
    //转换为formData
    var formData = new FormData();
    for(let i in params){
      formData.append(i,params[i]);
    }
    let token = await getToken();
    //添加token
    formData.append("token", token.data.data.data.token);
  }else{
    var formData =params;
  }
  //设置请求参数值
  httpDefaultOpts[type] = formData;
  //返回请求数据到promise
  return new Promise((resolve, reject) => {
    //请求方法
    axios(httpDefaultOpts).then(response => {
      resolve(response)
    }).catch((error) => {
      //提示请求发生错误，请检查网络
      vm.open4('请求发生错误,请检查网络');
      reject(error);//请求失败数据返回
    })
  })
}

//返回axios请求，名为Ajax
export default {
  Ajax(url, params) {
    return fetchPost(url, params);
  }
};

```
上面既然用到的export default导出对象。就顺便记录一下
JavaScript中AMD和ES6模块的导入导出对比。import，export，export default属于ES6规范。import命令具有提升效果，会提升到整个模块的头部，首先执行。import是解构过程（是在编译阶段执行的）

``` javascript
//output.js
const a = 'valueA1'
export {a}

import {a} from './output.js'//此处的import {a}和export {a}，两个a是一一对应关系
console.log(a)//=>valueA1

//output.js
const a = 'valueA1'
export default{a}

import a from './output.js'//此处的a和export default{a}，不是一个a，
console.log(a)//=>{ a: 'valueA1' }
```
require，exports，module.exports属于AMD规范。
require是运行时调用.require是赋值过程.
在最后写一个调用这个公共axios的例子。

``` javascript 
import cubeAxios from "@/assets/axios/cudeAxios";
 /**
     * @description: 根据经纬度获取八级地址信息
     * @param {type} 参数lonlat是一个[lan,lon]
     * @return:
     */
    async getDivisionsByLatLon(lonlat) {
      let vm = this;
      var params={
        request_type:cubeApi.getDivisionsByLatLon.request_type,
        paramCodeList:"KJ5008",
        coordinates:JSON.stringify(lonlat)
      }
      let url = vm.cubeCommonUrl()+cubeApi.getDivisionsByLatLon.url;
      return new Promise((resolve, reject) => {
        cubeAxios
          .Ajax(url, params)
          .then(res => {
            console.log(res);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /**
```