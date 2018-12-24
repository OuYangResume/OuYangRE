---
title: 造塑料轮子至npm
date: 2018-12-22 21:24:23
categories: NodeJS
tags: [GIS,npm]

---
maptalks插件库里面也有一个[VectorLayer](https://github.com/maptalks/maptalks.routeplayer).但是我们后台路径数据没有提供里面的time属性。所以自己写了一个实现类型功能的插件。为方便使用，所以发布到npm中。
<!-- more -->
### 编写功能
`npm init` 一路到底。编写`index.js`也就是插件的功能代码，
[详细代码](https://github.com/OuYangResume/routermove/blob/master/index.js)已上传到我的github中。
设置`git repository`仓库地址和`keywords`关键字作为这个包的索引。
### README文档
[文档](https://github.com/OuYangResume/routermove)
什么效果--怎么安装依赖--怎么使用--还有API。
### 设置npm账号
首先，要在npm发布包，首先得注册一个账号（记得邮箱认证），与github一样，npm对于公共包是免费的。
第二步，添加账号。输入命令`npm adduser`，然后键入你在npm上注册的账号和密码。另外，`npm config ls`可以查看你的npm配置。

接下来，使用`npm publish`就可以发布你的包了。发布与更新都是使用`npm publish`	命令，更新必须修改版本信息。
### packages
[我的npm](https://www.npmjs.com/settings/oouyang/packages)
还有很多需要学习，es6转es5。babel配置不好导致github上demo失败。
