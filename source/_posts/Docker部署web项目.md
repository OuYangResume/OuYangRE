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
docker 镜像名称由REPOSITORY和TAG组成 [REPOSITORY[:TAG]]，TAG默认为latest。查看所有镜像`docker image ls`
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
	-p 8088:8082 端口映射，将宿主的8088端口映射到容器的8082端口
	-d 后台方式运行
	--name 容器名 	
查看 docker 进程
`docker container ls -a`
进入这个已经启动的容器`docker exec -it containerID bash` 可以看到Dockerfile指定的工作目录和copy过来的文件。

#### 访问
`http://localhost:8088`
### 部署前端应用
#### vue项目
将前端项目运行起来并打包`npm run build`现在将这个生成的dist静态文件部署到docker上。
#### 拉取nginx镜像
`docker pull nginx`这次就基于nginx这个基础镜像部署项目（node项目是新建了一个镜像）。
#### 创建nginx config配置文件
在项目根目录下创建nginx文件夹，该文件夹下新建文件default.conf

``` 
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    access_log  /var/log/nginx/host.access.log  main;
    error_log  /var/log/nginx/error.log  error;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    location /api/ {
        rewrite  /api/(.*)  /$1  break;
        proxy_pass http://172.17.0.4:8082;
    }

}
```
这个文件可以看到首页的指向为 /usr/share/nginx/html/index.html, 所以我们可以一会把构建出来的index.html文件和相关的静态资源放到/usr/share/nginx/html目录下。
还将上面node服务代理出去了。容器内部 ip 通过查看` docker inspect containerID`
#### 启动容器

```
docker run \
-p 8000:80 \
-d --name vuenginx \
--mount type=bind,source=$HOME/vueclidemo/nginx,target=/etc/nginx/conf.d \
--mount type=bind,source=$HOME/vueclidemo/dist,target=/usr/share/nginx/html \
nginx
```
```
$HOME是指项目所在系统盘位置
--mount type=bind,source={sourceDir},target={targetDir} 将宿主机的sourceDir 挂载到容器的 targetDir 目录上。
```
访问localhost:8000/api/*就可以请求到node的后台服务了。
#### 编写sheel脚本
每次启动容器运行的命令较长，如果每次重新输入难免麻烦，我们可以将完整的命令保存到一个shell文件。

``` shell
#!/bin/sh
:<<EOF
    docker 运行脚本
    shell
    author:oouyang
EOF
# `解释器 !# 而不用在终端之前输入sh, bash.`
#!/bin/sh

##### 查看所有镜像 docker image ls
##### 查看所有容器 docker container ls -a
##### 启动已终止容器 docker container start  containerID
####   查看单个容器信息  docker inspect containerID
##### 进入容器 docker exec -it containerID bash

HOME=/Users/oouyang/Desktop/github/node
echo "输入1查看所有镜像"
echo "输入2 运行nginx"
echo "输入3 查看所有容器并选择删除"
echo "输入4 删除镜像"
echo "输入5 查看容器信息"
read -p $'\n\n请选择你要的操作:' aNum

case $aNum in
    1)  
        echo '所有镜像'
        docker image ls
        ;;
    2) 
        echo '查看所有容器'
        docker container ls -a
        read -p $'\n\n请输入您要运行的镜像：' imageName
        if [[ $imageName = 'nginx' || $imageName = 'vuenginxcontainer' ]]
        then
            read -p $'\n\n请输入映射端口：' -n 6 -t 5 -s ipCode 
            #-p 输入提示文字
            #-n 输入字符长度限制(达到6位，自动结束)
            #-t 输入限时
            #-s 隐藏输入内容
            docker run -p $ipCode:80 -d \
            --mount type=bind,source=$HOME/vueclidemo/nginx,target=/etc/nginx/conf.d \
            --mount type=bind,source=$HOME/vueclidemo/dist,target=/usr/share/nginx/html \
            $imageName
            echo -e "\n请访问localhost:$ipCode" #echo 后面是双引号
        fi
        ;;
    3)  
        echo '查看所有容器'
        docker container ls -a
        read -p $'\n\n请输入您要删除的容器：' containerName
        docker container stop $containerName
        docker container rm $containerName
        echo "\n删除 $containerName容器成功！"
        ;;
    4)  
        echo '查看所有镜像'
        docker image ls
        read -p $'\n\n请输入您要删除的镜像:' imageName
        docker image rm $imageName
        ;;
    5)
        echo '查看所有容器信息'
        docker container ls -a
        read -p $'\n\n请输入您要查看的容器名称:' containerName1
        docker inspect $containerName1
        ;;
    *)  echo '你没有输入 1 到 5 之间的数字'
    ;;
esac

```
