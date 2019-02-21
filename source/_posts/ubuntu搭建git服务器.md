---
title: git
date: 2018-07-24 20:55:13
categories: Git
tags: [Git,Ubuntu]

---
### ubuntu搭建git服务器
#### git服务器
github上传和拉取代码速度是比较慢的，在Github上创建一个私有仓库是收费的。GitBucket是一个开源的代码管理仓库，就像GitHub一样。
<!-- more -->
#### 下载并上传
选择版本，下载gitbucket.war[下载链接](https://gitbucket.github.io)
使用Xftp将war上传到ubuntu服务器上。
#### 安装gitbucket
首先查看是否安装java环境。[安装java环境](https://ouyangresume.github.io/2018/06/15/ubuntu%E5%AE%89%E8%A3%85geoserver/#more)
找到你上传过来的war。执行`nohup java -jar gitbucket.war`
#### 验尸
[http://39.108.100.163:8080](http://39.108.100.163:8080)
我已经创建一个游客账号，可以查看一些公共项目。
username：test
password：qwer
#### 开启pages服务
1.下载gitbucket-pages-plugin插件[jar地址](https://github.com/gitbucket/gitbucket-pages-plugin)
2.将jar文件复制到<GITBUCKET_HOME>/plugins/（GITBUCKET_HOME默认为~/.gitbucket）
查找plugins文件夹在ubuntu上的哪个位置`find / -name 'plugins' -type d `
用xftp拖到plugins目录下。
3.重新启动gitbucket`nohup java -jar gitbucket.war --port 8088`
这里设置的端口号似乎没有用。还是会启动为8080端口。
4.用游客账号创建一个公开的oouyang仓库。创建一个gh-pages孤儿分支，并设置为默认分支。
<div  align="center"><img src="ubuntu搭建git服务器/oouyang.png" width = "500" height = "300" alt="gitbucket" align=center />
</div>
从图片可以看到多了一个pages的功能。（也可以选择master分支为page功能。就不需要创建孤儿分支了。）
5.colne 这个分支并上传一些页面。
访问：打开浏览器并指向 <your repo url>/pages
### git常用命令

<div  align="center"><img src="ubuntu搭建git服务器/gitwork.png" width = "500" height = "300" alt="gitbucket" align=center />

图中几个名词：
+ Workspace：工作区
+ Index / Stage：暂存区
+ Repository：仓库区（或本地仓库）
+ Remote：远程仓库

``` josn
# 下载一个项目和它的整个代码历史
$ git clone [url]
# 添加当前目录的所有文件到暂存区
$ git add .
# 提交暂存区到仓库区
$ git commit -m [message]
# 推送到远程分支
$ git push origin [branch-name]
# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
# 列出所有本地分支和远程分支
$ git branch -a
# 新建一个分支，并切换到该分支
$ git checkout -b [branch]
# 合并指定分支到当前分支
$ git merge [branch]
# 删除分支
$ git branch -d [branch-name]
```

