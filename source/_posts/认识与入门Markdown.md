---
title: 认识与入门Markdown
date: 2018-03-06 11:23:46  
categories: blog
tags: [markdown]
---
Markdown 是一种用来写作的轻量级「标记语言」，它用简洁的语法代替排版，而不像一般我们用的字处理软件 Word 或 Pages 有大量的排版、字体设置。它使我们专心于码字，用「标记」语法，来代替常见的排版格式。例如此文从内容到格式，甚至插图，键盘就可以通通搞定了。
<!-- more -->
 
### 列表
   + 无序列表使用*或者+或者-（注意*后面加空格）
   + 有序列表使用数字加.
   
### 标题
   * 使用#的个数代表等级数
   
### 引用
  > 数据结构
  >> 树
  >>> 二叉树
       
### 强调   
   * **加粗文本**或者__这样__
   * *斜体*
   *  ~~删除怎么没效果~~
   
### 图片与连接
  * 语法格式
    1. 图片：`![]()`  ![图片文本（可忽略)](图片地址）
    2. 链接：`[]()`  [链接文本]（链接地址）
  * 链接又分为行内，参考，自动
     * 行内链接：[文章地址](https://ouyangresume.github.io/)
     * 参考链接：[文章地址][https://ouyangresume.github.io/]，其中url为链接标记，可置于文中任意位置。
     * 自动链接：<https://ouyangresume.github.io>
  * 图片也有行内和自动。用法差不多
     * 这是图片：![](https://connorlin.github.io/images/avatar.jpg)

### 代码
  * 行内代码用`标识
    这个是行内代码
    
    `python manage.py runserver`
  * 代码块用```或者四个空格
  
    ```  java
    protected void onCreate(Bundle savedInstanceState) {  
            super.onCreate(savedInstanceState);  
            setContentView(R.layout.activity_main);
          }  
    ```
    
### 分割线
  * 一行中用三个***或者___
  
### 换行   
   这是一行后面加两个空格加  
   回车. 
### 脚注
  * 使用[^]来定义脚注。  
  这是一个脚注[^1]
  [^1]:eg
  
### 表格
```
	| Tables        | Are           | Cool  |
	| ------------- |:-------------:| -----:|
	| col 3 is      | right-aligned | $1600 |
	| col 2 is      | centered      |   $12 |
	| zebra stripes | are neat      |    $1 | 
```

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |  $1   |