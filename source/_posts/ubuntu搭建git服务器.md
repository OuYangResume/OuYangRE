---
title: ubuntu搭建git服务器
date: 2018-07-24 20:55:13
categories: Git
tags: [Git,Ubuntu]

---
### git服务器
github上传和拉取代码速度是比较慢的，在Github上创建一个私有仓库是收费的。GitBucket是一个开源的代码管理仓库，就像GitHub一样。
<!-- more -->
### 下载并上传
选择版本，下载gitbucket.war[下载链接](https://gitbucket.github.io)
使用Xftp将war上传到ubuntu服务器上。
### 安装gitbucket
首先查看是否安装java环境。[安装java环境](https://ouyangresume.github.io/2018/06/15/ubuntu%E5%AE%89%E8%A3%85geoserver/#more)
找到你上传过来的war。执行`nohup java -jar gitbucket.war --prot 8088`
### 验尸
[http://39.108.100.163:8088](http://39.108.100.163:8088)
我已经创建一个游客账号，可以查看一些公共项目。
username：test
password：qwer
