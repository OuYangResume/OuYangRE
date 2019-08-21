---
title: VR全景功能
date: 2019-08-20 20:37:14
categories: Three.js
tags: [Three.js,webpack]

---

项目需要将华为全景相机拍摄出的照片展示在pc端，类似于微博常见的VR效果。实现效果的核心就是THREE.js。本文就介绍用webpack4搭建一个开发demo的环境，并简易介绍three.js.
<div  align="center"><img src="VR全景功能/xgt.gif" width = "500" height = "300" alt="图片名称" align=center />
</div>

<!--more-->
### 搭建环境
webpack4与es6的开发环境,也就是一些插件的配置。
#### 创建项目
`npm init` 生成package.json文件。
#### 使用webpack
1. 我们在跟目录下创建一个文件夹src来存放源文件
2. 在创建一个文件夹build来存放编译后的文件
3. 新建index.html文件
4. 创建配置文件webpack.config.js

```  javascript
// webpack.config.js 
var path = require('path');
var appPath = path.resolve(__dirname, './src/threeTwo.js');
var buildPath = path.resolve(__dirname, './build');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: appPath,//整个页面的入口文件
    output: {
        path: buildPath,//打包输出的地址
        filename: "bundle.js",//输出的文件名称
    },
    module: {
        rules: [
            {
                //url-loader的主要功能是：将源文件转换成DataUrl(声明文件mimetype的base64编码)
                //小于limit字节，以 base64 的方式引用，大于limit就交给file-loader处理了
                //file-loader的主要功能是：把源文件迁移到指定的目录（可以简单理解为从源文件目录迁移到build目录
                test: /\.(jpg|png|gif)$/,
                loader: 'url-loader?limit=8192&name=asset/[hash:8].[name].[ext]'
            },
           
        ]
    },
    //以下是服务环境配置
    devServer: {
        port: 8085,//端口
        host: 'localhost',//地址
        inline: true,//用来支持dev-server自动刷新
        open: true,//开启webpack-dev-server时自动打开页面
        historyApiFallback: true,
        contentBase: path.resolve(__dirname),//用来指定index.html所在目录
        publicPath: '/build/',//用来指定编译后的bundle.js的目录
        openPage: "build/index.html",//指定打开的页面
        hot: true,//热部署
    },
    plugins: [
        // new HtmlWebpackPlugin(),
        //热部署插件
        // new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            // filename:'b.html',
            template: "./src/index.html",
            chunksSortMode: 'none'
        })
    ],
}
```

### Three.js基础知识
使用Three.js绘制一个三维效果，至少需要以下几个步骤：

+ 创建一个容纳三维空间的场景 (**Sence**)
+ 将需要绘制的元素加入到场景中，对元素的形状、材料、阴影等进行设置
+ 给定一个观察场景的位置，以及观察角度，我们用相机对象（**Camera**）来控制
+ 将绘制好的元素使用渲染器（**Renderer**）进行渲染，最终呈现在浏览器上

拿电影来类比的话，场景对应于整个布景空间，相机是拍摄镜头，渲染器用来把拍摄好的场景转换成胶卷。
[THREE.js文档](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)

#### 场景
场景允许你设置哪些对象被three.js渲染以及渲染在哪里。在场景中放置对象、灯光和相机。
很简单，直接创建一个Scene的实例即可。`_scene = new Scene()`
#### 元素（包含光线）
Three.js 为我们提供了非常多的Geometry，例如SphereGeometry（球体）、TetrahedronGeometry（四面体）、TorusGeometry（圆环体）等等。
在Three.js中，材质（Material）决定了几何图形具体是以什么形式展现的。它包括了一个几何体如何形状以外的其他属性，例如色彩、纹理、透明度等等，Material和Geometry是相辅相成的，必须结合使用。
#### 相机
##### 坐标系

<div  align="center"><img src="VR全景功能/zbx.png" width = "500" height = "300" alt="图片名称" align=center />
</div>

我们可以在场景中添加一个坐标系，清楚的看到元素处于什么位置.
``` javascript
//坐标系插件
scene.add(new THREE.AxisHelper(1000));
```
#####  PerspectiveCamera（透视相机）

``` javascript
    _camera = new PerspectiveCamera(fov, aspect, near, far);
```
最常用的摄像机类型，模拟人眼的视觉，近大远小（透视），如果是需要模拟现实，基本都是用这个相机。Fov表示的是视角，Fov越大，表示眼睛睁得越大，离得越远，看得更多。aspect代表水平方向和竖直方向可观测距离的比值。near、far分别对应相机可观测的最近和最远距离。
<div  align="center"><img src="VR全景功能/camera.png" width = "500" height = "300" alt="图片名称" align=center />
</div>

##### OrthographicCamera（正交投影相机）
``` javascript 
_camera = new OrthographicCamera(left, right, top, bottom, near, far);
```
只有在这个矩形可视区域内才是可见的物体无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变。对于渲染2D场景或者UI元素是非常有用的。
<div  align="center"><img src="VR全景功能/camera1.png" width = "500" height = "300" alt="图片名称" align=center />
</div>

#####  position、lookAt
position属性指定了相机所处的位置。lookAt函数指定相机观察的方向。接收的参数都是一个类型为Vector3的对象。
#### 渲染器
Three.js也为我们提供了几种不同的渲染器，主要看WebGL渲染器(WebGLRenderer)。WebGL渲染器使用WebGL来绘制场景，其够利用GPU硬件加速从而提高渲染性能。Three.js绘制的元素添加到浏览器上，这个过程需要一个载体，这个载体就是Canvas，你可以通过_renderer.domElement获取到这个Canvas，并将它给定到真实DOM中。

``` javascript
_renderer = new WebGLRenderer();
_container = document.getElementById('conianer');
_container.appendChild(_renderer.domElement);
```
使用setSize函数设定你要渲染的范围，实际上它改变的就是上面Canvas的范围.通过render函数渲染上面指定的场景和相机.

``` javascript 
_renderer.setSize(window.innerWidth, window.innerHeight);
_renderer.render(_scene, _camera);
```

#### requestAnimationFrame
要渲染的元素可能并未被加载完，你就执行了渲染，并且只执行了一次，这时需要requestAnimationFrame方法，让场景和相机进行实时渲染。

``` javascript 
function animate() {
     requestAnimationFrame(animate);
     _renderer.render(_scene, _camera);
     }
```
### 全景效果
#### 基本逻辑
1. 将一张全景图包裹在球体的内壁.
2. 设定一个观察点，在球的圆心.
3. 使用鼠标可以拖动球体，从而改变我们看到全景的视野.
4. 鼠标滚轮可以缩放，和放大，改变观察全景的远近.

#### 初始化
把必要的基础设施搭建起来，场景、相机（选择远景相机，这样可以让全景看起来更真实）、渲染器：
按照three.js官网搭建最基础的即可。

``` ECMAScript6
import * as THREE from 'three';
init();
function init() {
    //创建一个场景
    var _scene = new THREE.Scene();
    //创建一个相机，视角，长宽比，近远裁剪面
    var _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    _camera.position.set(0, 300, 600);
    _camera.lookAt(new THREE.Vector3(0, 0, 0))
    //渲染器
    var renderer = new THREE.WebGLRenderer();
    let _container = document.getElementById('conianer');
    renderer.setSize(window.innerWidth, window.innerHeight);
    _container.appendChild(renderer.domElement);
	
	//创建一个长方体
    var geometry = new THREE.BoxGeometry(200, 100, 100);
    var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    var mesh = new THREE.Mesh(geometry, material);
    _scene.add(mesh);

    // 创建平行光-照亮几何体
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(-4, 8, 12);
    _scene.add(directionalLight);
    // 创建环境光
    var ambientLight = new THREE.AmbientLight(0xffffff);
    _scene.add(ambientLight);


    var animate = function () {
        requestAnimationFrame(animate);

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;

        renderer.render(_scene, _camera);
    };

    animate();
}

```

在场景内添加一个球体，并把全景图作为材料包裹在球体上面并将相机的中心点移动到球的中心.

``` javascript
function addImg(url) {
    const texture = THREE.ImageUtils.loadTexture(url);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.SphereGeometry(10, 256, 256);
   // const geometry = new THREE.SphereGeometry(50, 256, 256);
    const mesh = new THREE.Mesh(geometry, material);
    // 渲染球体的双面
    material.side = THREE.DoubleSide;
    return mesh;
}
```
#### 插件添加事件

全景图已经可以浏览了，但是你只能看到一部分，并不能拖动它看到其他部分，为了精确的控制拖动的速度和缩放、放大等场景，用到的是three.js作者提供的插件[OrbitControls](https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls)。其实里面的原理也就是给`_renderer.domElement`上面提到的canvas增加一些监听鼠标事件。
下面就是使用的完整代码

``` ECMAScript6
import * as THREE from 'three'
//OrbitControls不是核心的一部分。您必须将类转换为模块并单独导入它。
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//const OrbitControls= require("./lib/OrbitControls")

function init() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    let _container = document.getElementById('conianer');
    //  stat = new Stats();
    // document.body.appendChild(stat.dom);
    //一个canvas，渲染器在其上绘制输出。
    _container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
     camera.position.set(20, 0, 0);
   // camera.position.set(-0.3, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    //添加视图改变的回调函数。
    controls.addEventListener("change", render);
    controls.minDistance = 1;
    // controls.maxDistance = 200;
    controls.maxDistance = 20;
    controls.enablePan = false;

    // const geometry = new THREE.SphereGeometry(1, 10, 10);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    // const mesh = new THREE.Mesh(geometry, material);
    const mesh = addImg("../img/p4.jpg");
    // const mesh = addImg("https://qhyxpicoss.kujiale.com/r/2019/07/01/L3D137S8ENDIADDWAYUI5L7GLUF3P3WS888_3000x4000.jpg?x-oss-process=image/resize,m_fill,w_1600,h_920/format,webp", scene, 1);
    scene.add(mesh);

    controls.update();
    controls.target.copy(mesh.position);

    function render() {
        renderer.render(scene, camera);
    }

    function r() {
        render();
        requestAnimationFrame(r)
    }
    //坐标插件
    scene.add(new THREE.AxisHelper(1000));
    r()
}

function addImg(url) {
    const texture = THREE.ImageUtils.loadTexture(url);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.SphereGeometry(10, 256, 256);
   // const geometry = new THREE.SphereGeometry(50, 256, 256);
    const mesh = new THREE.Mesh(geometry, material);
    // 渲染球体的双面
    material.side = THREE.DoubleSide;
    return mesh;
}

init();

```
<div  align="center">
<video width="500" height="300" src="sp.mp4" controls>
您的浏览器不支持Video标签。
</video>
</div>

#### 自己添加事件
博文太长不好看就只添加一个放大缩小的功能（写的太丑,相对简单）。

``` javascript
 _renderer.domElement.addEventListener('wheel', function (e) {
        //deltaY 的值大于1时，竖直方向的 DOMMouseScroll 事件,视野放大。
        var delta = e.deltaY > 0 ? 15 : -15;
        if (_camera.fov + delta * 0.05 >= 1 && _camera.fov + delta * 0.05 <= 100) {
            _camera.fov += delta * 0.05;
            //更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
            _camera.updateProjectionMatrix();
        }
    }, false);
```

视图移动代码部分在我github上[源码地址](https://github.com/OuYangResume/node/blob/master/learnWebGL/src/threeTwo.js)。

### 后续
1. 添加标记功能。
2. 封装成插件，方便使用。
3. 实现类似这种功能[中国馆](http://www.4dmodel.com/SuperTwo/index.html?m=159&version=one)