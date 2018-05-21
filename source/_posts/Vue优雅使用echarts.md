---
title: Vue优雅使用echarts
date: 2018-05-21 16:12:18
categories: Vue
tags: [Vue,echarts]

---
### npm 安装 ECharts
npm install echarts --save
### 引入 ECharts
npm上安装的ECharts会放在node_modules目录下。
1.`var echarts = require('echarts')`
2.`import echarts from 'echarts'`
通过以上两种方式得到 ECharts。
<!-- more -->
### 初始化echarts实例
`let myChart = echarts.init(dom,'theme');`
dom是指一个具有高度的div,theme是指echarts主题。
使用主题之前必须先引用。比如引用ECharts4中新出的黑色主题`equire('echarts/theme/dark')` 
### 图表的配置项option和数据
具体配置项就去官网查看[api](http://echarts.baidu.com/option.html#title)
### 生成图
`myChart.setOption(option)`

### 提供一个vue的组件代码
``` vue 
<template>
    <div :class="className" id="bar" :style="{height:height,width:width}"></div>
</template>
<script>
// import echarts from "echarts";
// require('echarts/theme/macarons') // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  data() {
    return {
      chart: null
    };
  },
  methods: {
    initChart() {
        let echarts=require('echarts');
      this.chart = echarts.init(document.getElementById("bar"),'macarons');
      this.chart.setOption({
    title: {
        text: '输出与承受占比图',
        subtext: 'by ouyang'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['伤害', '防御'],
        x : 'right',
        y : 'top',
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01]
    },
    yAxis: {
        type: 'category',
        data: ['德玛','瑞文','亚索','盲僧','卡萨']
    },
    series: [
        {
            name: '伤害',
            type: 'bar',
            data: [10000, 12000, 18000, 4399, 22000]
        },
        {
            name: '防御',
            type: 'bar',
            data: [19325, 9000, 8000, 16000, 6000]
        }
    ]
});
    }
  },
  mounted(){
      this.initChart()
  }
};
</script>
```
<div  align="center"><img src="Vue优雅使用echarts/bar.png" width = "500" height = "400" alt="Bar图" align=center />
</div>
### [源码地址](https://github.com/OuYangResume/Vue-Gis)

