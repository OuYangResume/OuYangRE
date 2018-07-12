---
title: ubuntu安装geoserver
date: 2018-06-15 16:18:26
categories: GIS
tags: [GIS,SpringBoot]

---
### 安装geoserver
#### 下载geoserver
去[官网下载](http://geoserver.org/)你喜欢的版本。
#### 上传到ubuntu
用Xshell登录到服务器，然后使用sftp将下载的文件上传到root目录下。
<!-- more -->
<div  align="center"><img src="ubuntu安装geoserver/sftp.png" width = "500" height = "400" alt="sftp" align=center />
</div>
将你要上传的文件拉到这里面来就行了。
#### 解压geoserver
安装unzip 
`apt-get install unzip`
解压zip文件
`unzip 压缩文件名.zip`
<div  align="center"><img src="ubuntu安装geoserver/unzip.png" width = "500" height = "400" alt="unzip" align=center />
</div>
这里可以看到上传过来的zip和解压之后的geoserver-2.11.1
#### 安装java环境
1.添加仓库源`add-apt-repository ppa:webupd8team/java`之前可能需要安装依赖包。
2.更新软件包列表`apt-get update`
3.安装JDK `apt-get install oracle-java8-installer`
4.查看java版本，看看是否安装成功`java-version`
#### 设置GEOSERVER_HOME环境变量
`vi /etc/profile` 添加路径   
<div  align="center"><img src="ubuntu安装geoserver/home.png" width = "500" height = "400" alt="sftp" align=center />
</div>
保存修改重新生效`source /etc/profile`
#### 启动geoserver
启动：` nohup ./startup.sh &`
关闭：`./shutdown.sh`
[访问试试](http://39.108.100.163:8080/geoserver/web/)
### 部署SpringBoot项目
#### idea打包成jar包
maven工具先clean再package。
maven命令打包，排除测试代码后进行打包
`mvn clean package  -Dmaven.test.skip=true`
#### 上传到ubuntu
上传之前先在本机上测试一下打包的jar是否能正常运行
`java -jar Name.jar`
上传方式与上面相同。
#### 运行jar
启动之前查看安装了Java环境，`nohup java -jar Name.jar`
[springboot](http://39.108.100.163:8888)
#### 查看进程并kill
查看java的进程`ps -ef|grep java`
``` xml 
root@iZi2m69ympwtuqZ:~# ps aux| grep java
root     12194  0.1 39.6 2610948 812304 ?      Sl   Jun15  54:44 /usr/lib/jvm/java-8-oracle/bin/java -DGEOSERVER_DATA_DIR=/root/geoserver-2.11.1/data_dir -Djava.awt.headless=true -DSTOP.PORT=8079 -DSTOP.KEY=geoserver -jar start.jar
root     24255 16.2 10.1 2478560 208748 ?      Sl   15:52   0:17 java -jar spring-boot-jpa-thymeleaf-curd-2.0.2.RELEASE.jar
root     24334  0.0  0.1  11764  2084 pts/2    S+   15:54   0:00 grep --color=auto java
```
杀死pid为24255的进程`kill -s 9 24255`




