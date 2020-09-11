---
title: mapbox的Popup与Vue框架融合使用
date: 2019-12-19 16:42:25
categories: GIS
tags: [GIS,Vue]

---

主要用于mapbox GL的Popup，Marker 如何与Vue前端框架融合，把popup里面的DOM抽离成vue组件，避免在js中大量拼接DOM写样式绑方法。

<!-- more-->

## 创建marker，popup
地图上创建marker时，可以使用dom元素.默认是一个浅蓝色、水滴状的SVG标记。

创建popup时，使用setDOMContent方法将弹窗内容设置为以 DOM 节点形式提供的元素。

``` js 
let el =document.createElement("div");
//创建marker
var marker = new mapboxgl.Marker(el)
  .setLngLat(e.lngLat)
  .addTo(map);
//创建popup
var popup = new mapboxgl.Popup()
  .setLngLat(e.lngLat)
  .setDOMContent(el)
  .addTo(map);
```
## vue组件中取dom
vue官网上有实例的对象 [vm.$el](https://cn.vuejs.org/v2/api/#vm-el) ，可以取到Vue 实例使用的根 DOM 元素。

``` js
import Vue from 'vue';
var Comp = Vue.extend({
  props: ['msg'],
  template: '<div>{{ msg }}</div>'
})
//只用于 new 创建的实例时传递 props.
var vm = new Comp({
  propsData: {
    msg: 'hello'
  }
})
let dom =vm.$el;
```
上面的例子中可以看到如何取到了我们想要的dom节点。

## 实例使用
``` js
import Vue from 'vue';
import * as components from './src';
import store from '@/store'


let currentPopup;
let instance;
let Template;
const popovers = [];

const getPopover = function (_str) {
    Template = Vue.extend(components[_str]);
};

// 默认回调
const defaultCallback = action => {
    if (currentPopup) {
        const callback = currentPopup.callback;
        if (typeof callback === 'function') {
            callback(action);
        } else {
            closePopover();
        }
    }
};

// 创建实例
const initInstance = (data) => {
    instance = new Template({
        propsData: data,//可以是方法,对象
        store: store,//必须引用一下，不能使用vuex
        el: document.createElement('div'),
    });
    instance.callback = defaultCallback;
};

/**
 * @description: 获取组件的dom
 * @param {type} 组件名
 * @return: 
 */
const getPopoverElement = (type, options) => {
    if (!type) return;
    getPopover(type);
    initInstance(options);
    instance.action = '';
    if (popovers.length > 0) {
        const _options = options;
        if (_options.callback === undefined) {
            instance.callback = defaultCallback;
        }

        Object.keys(_options).forEach(prop => {
            if (_options[prop]) {
                instance[prop] = _options[prop];
            }
        });

        document.body.appendChild(instance.$el);
        Vue.nextTick(() => {
            instance.visible = true;
        });
    }
    return instance.$el;
};

/**
 * @description: 打开弹窗
 * @param {type} 
 * @return: 
 */
const showPopover = function (type, map, options = {}) {
    if (options.closeLast) {
        closePopover();
    }

    if (!options.coordinates || !options.coordinates[0] || !options.coordinates[1]) {
        console.warn('无空间信息！');
        return false;
    }

    const contentHtml = getPopoverElement(type, options);
    const popover = new mapboxgl.Popup(Object.assign({}, {
        closeButton: true
    }, options));
    const coords = options.coordinates;
    popover.setLngLat(coords)
        .setDOMContent(contentHtml)
        .addTo(map);

    currentPopup = popover;
    popovers.push(currentPopup);
    //将弹窗位置设置为map中心
    if (options.autoCenter) {
        map.animateTo({
            center: coords
        });
    }
};

/**
 * @description: 关闭弹窗
 * @param {type} 
 * @return: 
 */
function closePopover() {
    if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
        instance.$destroy();
    }
}

export {
    showPopover, closePopover,getPopoverElement
};
```
