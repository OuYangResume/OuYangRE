---
title: markdown进阶
date: 2018-03-06 11:23:46  
categories: blog
tags: [markdown]

---
 [url]:https://ouyangresume.github.io/

1. **图片与连接**
  * 语法格式
        >     图片：![]()  ![图片文本（可忽略)](图片地址）
        >     链接：[]()   [链接文本]（链接地址）
  * 链接又分为行内，参考，自动

<!-- more -->
     * 行内链接：[文章地址](https://ouyangresume.github.io/)
     * 参考链接：[文章地址][url]，其中url为链接标记，可置于文中任意位置。
     * 自动链接：<https://ouyangresume.github.io>
  * 图片也有行内和自动。用法差不多
     * 这是图片：![](https://connorlin.github.io/images/avatar.jpg)

2. **代码**
  * 行内代码用`标识
    >这个是行内代码`python manage.py runserver`
  * 代码块用```或者四个空格 
    >    ```  java 
        // 注意java前面有空格
        protected void onCreate(Bundle savedInstanceState) {  
            super.onCreate(savedInstanceState);  
            setContentView(R.layout.activity_main);
          }  
      ```
3. **分割线**
  * 一行中用三个***或者___
4. **换行**   
   这是一行后面加两个空格加  
   回车
5. **脚注**
  * 使用[^]来定义脚注。  
  这是一个脚注[^1]
  [^1]:eg