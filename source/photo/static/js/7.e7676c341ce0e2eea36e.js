webpackJsonp([7],{UMiQ:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=t("mtWM"),a=t.n(r),u={data:function(){return{userData:null}},mounted:function(){this.initData()},methods:{initData:function(){var e=this;a()({method:"get",url:e.localExpressUrl()+"/user/getAllUser"}).then(function(n){console.log(n),e.userData=n.data})}}},s={render:function(){var e=this,n=e.$createElement,t=e._self._c||n;return t("div",[e._v("\n    英雄联盟模块\n    来自mysql的数据\n    "),e._l(e.userData,function(n,r){return t("div",{key:r},[e._v("\n        "+e._s(n.age)+" -"+e._s(n.user_name)+"\n    ")])})],2)},staticRenderFns:[]},l=t("VU/8")(u,s,!1,null,null,null);n.default=l.exports}});
//# sourceMappingURL=7.e7676c341ce0e2eea36e.js.map