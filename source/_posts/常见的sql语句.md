---
title: 常见的sql语句
date: 2018-07-13 11:04:49
categories: SQL
tags: [SQL]

---
### 多表查询
从数据显示方式来讲有：内连接,外连接和交叉连接。
内连接：只返回满足连接条件的数据。
外连接：除了返回满足连接条的行以外，还返回左（右）表中，不满足条件的行，称为左（右）连接。
<!-- more -->
``` sql
#内连接
-- 等值连接
SELECT * FROM `user` as a, lnglat as b WHERE a.id= b.userid;
-- 自然连接
SELECT * FROM `user` as a INNER JOIN lnglat as b on a.id=b.userid ;

#外连接
-- 左连接
select * FROM `user` as a LEFT JOIN lnglat as b on a.id=b.userid AND b.type=1;
-- 右连接
SELECT * FROM `user` as a RIGHT JOIN lnglat as b on a.id=b.userid;
-- 全连接
-- mysql不支持,所以用union联合查询
SELECT *  FROM `user` as a LEFT JOIN lnglat as b on a.id=b.userid 
UNION SELECT * FROM `user` as a RIGHT JOIN lnglat as b on a.id=b.userid ;
#交叉连接(笛卡尔积)
SELECT * FROM `user` as a ,lnglat as b;
SELECT * FROM `user`as a CROSS JOIN lnglat as b;
```