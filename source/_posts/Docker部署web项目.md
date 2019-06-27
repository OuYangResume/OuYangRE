---
title: Docker部署web项目
date: 2019-06-27 17:30:59
categories: NodeJS
tags: [docker,nginx,Vue,express]

---
本文使用Docker来部署一个vue的前端应用,后台是express提供的接口。更多的实践docker命令,[上篇文章](https://ouyangresume.github.io/2019/06/24/Docker-Base/#more)有关于Docker更详细的介绍.
<!--more-->
### 部署node服务
#### 运行本地express
这个后台服务就用很早之前写的项目,[项目地址](https://github.com/OuYangResume/node/tree/master/expressdemo)在github上。运行该 express 应用需要 node 环境，我们基于 node 镜像来构建一个新镜像.
#### 拉取node镜像
`docker pull node`
查看所有镜像`docker image ls`
#### 编写Dockerfile文件
在express项目的根目录创建Dockerfile文件。

``` Dockerfile
#基于 node:latest 镜像而构建的
FROM node
#指定工作目录
WORKDIR /usr/src/app
#COPY 指令将从构建上下文目录中 <源路径> 的文件/目录复制到新的一层的镜像内的 <目标路径> 位置。
COPY package*.json ./
#安装依赖
RUN npm install
#将所有文件copy到工作目录
COPY . .
#声明运行时容器提供服务端口
EXPOSE 8082
#指定默认的容器主进程的启动命令
CMD [ "npm", "start" ]
```
这里的端口是指容器端口`-p <宿主端口>:<容器端口>`跟运行并没有关系。
#### 构建镜像
`docker build -t nodeWebServer .`
-t 是给镜像命名 . 是基于当前目录的Dockerfile来构建镜像
#### 启动容器
基于该镜像启动一个docker容器。

``` 
docker run \
-p 8088:8082 \
-d --name nodeApp \
nodeWebServer
```
 	docker run 基于镜像启动一个容器
	-p 3000:80 端口映射，将宿主的8088端口映射到容器的8082端口
	-d 后台方式运行
	--name 容器名 	
查看 docker 进程
`docker container ls -a`
进入这个已经启动的容器`docker exec -it containerID bash` 可以看到Dockerfile指定的工作目录和copy过来的文件。

#### 访问
`http://localhost:8088`
### 部署前端应用

