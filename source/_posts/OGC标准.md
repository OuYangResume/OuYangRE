---
title: OGC标准
date: 2018-03-23 16:39:11
categories: GIS
tags: GIS

---
## 一：OGC与OGC标准
制定与空间信息，基于位置服务相关的标准文档，按照这些文档开放服务的接口，空间数据存储的编码，空间操作的方法。[OGC官网](http://www.opengeospatial.org/)
## 二：SFS -简单的要素标准
 <!-- more -->
### 几何对象模型
几何对象（点，线，面和多点，多线，多面）和对象的一系列操作。
### WKT描述几何对象
WKT可以通过文本来描述几何对象。
``` json
Point(10 10) //点
LineString(10 10,20 20,30 40) //3个节点的线
Polygon((10 10,10 20,20 20,10 10))//只有一个环的多边形
MultiPoint((10 10),(20 20))//多点 
MultiLineString多线 多面也类似
```
### WKB 描述几何对象
wkb通过序列化的字节对象来描述几何对象
### WKT描述空间参考
wkt除了可以描述几何对象也可以描述空间对象。
对于**地理坐标系**，比如最常见的WGS84坐标系，wkt是描述如下：
``` json
GEOGCS
[
	"GCS_WGS_1984",
	DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],
	PRIMEM["Greenwich",0.0],
	UNIT["Degree",0.0174532925199433]
	AUTHORITY["EPSG",4326]
]
```
"GEOGCS"表明"[]"中描述的是一个地理坐标系统。该坐标系统名称为"GCS_WGS_1984";采用的大地基准面为“D_WGS_1984”，该基准面近似椭球体的长轴为6378137.0米、扁率为298.257223563；以格林威治0度经线为起始经线；地图单位为度，该单位的转换因子[2] 为0. 0174532925199433（π/180）；该坐标系统在EPSG[3] 中的编码为“4326”。

对于**投影坐标系**，WGS84 Web Mercator（Auxiliary Sphere）坐标系统，WKT描述：
``` json
PROJCS
[
	"WGS_1984_Web_Mercator_Auxiliary_Sphere",
	GEOGCS
	[
		"GCS_WGS_1984",
		DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],
		PRIMEM["Greenwich",0.0],
		UNIT["Degree",0.0174532925199433]
	],
	PROJECTION["Mercator_Auxiliary_Sphere"],
	PARAMETER["False_Easting",0.0],
	PARAMETER["False_Northing",0.0],
	PARAMETER["Central_Meridian",0.0],
	PARAMETER["Standard_Parallel_1",0.0],
	PARAMETER["Auxiliary_Sphere_Type",0.0],
	UNIT["Meter",1.0],
	AUTHORITY["EPSG",3857]
]
```
“PROJCS”代表这是一个投影坐标系。投影坐标系中必然会包括一个地理坐标系，这里的地理坐标系就是“GCS_WGS_1984”，这个地理坐标系的定义和上面的类似。下面紧跟着的是投影的相关参数，“Mercator_Auxiliary_Sphere”是采用投影的名称，这个投影坐标系以0度经线为中央经线进行投影；坐标系的单位为米（显然，转换因子就为1.0），而该坐标系的EPSG编码为“3857”。
___
## 三：GML- 地理标记语言
GML是一种基于XML的地理要素描述语言，主要是在不同的软件或系统间交换空间数据。比如WFS要素web服务就使用gml作为输入输出格式。
## 四：SLD -图层样式描述
一个地图不仅包含数据源组成，还需要对数据进行符号化和渲染，sld就是描述地图图层样式的标准，一般用于wms地图web服务。
## 五：KML 
主要用于地理数据的可视化，不仅包括地理数据的描述，还包括数据的符号化方式，用户视角的控制等信息。
## 六：OWS-OGC WEB服务通用标准
OWS描述web服务通用的接口规范，包括请求和响应的内容，请求的参数和编码等。
### WFS -要素web服务
### WMS -地图web服务
### WCS -栅格web服务
### WMTS -地图切片服务
## OGD标准介绍.pdf
链接：[https://pan.baidu.com/s/1abhZc-Wsrk1RbEqGpFb8pw](https://pan.baidu.com/s/1abhZc-Wsrk1RbEqGpFb8pw)密码：dei6