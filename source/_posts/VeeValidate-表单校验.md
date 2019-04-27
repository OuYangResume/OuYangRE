---
title: VeeValidate 表单校验
date: 2019-04-24 22:49:42
categories: Vue
tags: [Vue,npm]

---

项目遇到要表单验证了。VeeValidate是Vue.js的验证库，它有很多验证规则，并支持自定义规则。它基于模板，因此它与HTML5验证API相似并且很熟悉。您可以验证HTML5输入以及自定义Vue组件，不用自己造轮子。本篇文章就记录这个插件的基本使用方法。
<!-- more -->
### 基本安装和简单使用
+ `npm install vee-validate --save` 安装vee-validate插件。
+ `npm install vue-i18n --save`安装vue国际化。
在src下新建文件夹并且创建文件validator.js,然后再引用到mian.js中`import './validator/validator.js'`。

``` javascript
//validator.js
import Vue from "vue";
import VeeValidate from "vee-validate";

import VueI18n from "vue-i18n";
import zh_CN from "vee-validate/dist/locale/zh_CN";

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "zh_CN"
});
Vue.use(VeeValidate, {
  i18n,
  i18nRootKey: "validation",
  dictionary: {
    zh_CN
  }
});
```

在from表单验证必填值的简单使用。

+ v-validate:
 	v-validate是vue的指令添加到您希望验证的输入中，并确保您的输入具有name用于生成错误消息的属性。 然后，传递给指令一个rules字符串，其中包含由管道' |' 分隔的验证规则列表。比如使用`required`这个选项是必填项.
+ data-vv-as：
	当为这个输入生成任何错误消息时，它将使用该data-vv-as值而不是实际的字段名称，默认的错误提示都是英文，如果你设置了这个，错误提示字段名称它会提示data-vv-as值.
+ v-show="errors.has('remark')"
默认错误提示的标签不加载出来.
+ errors.first('remark')
获取关于当前remark的第一个错误信息.

``` javascript 
<template>
  <div class="fromdata">
    <div class="fromItem">
      <input
        name="name"
        type="text"
        v-model="name"
        placeholder=" 请输入姓名"
        v-validate="'required'"
        data-vv-as="姓名"
      >
      <span v-show="errors.has('name')" class="help">{{ errors.first('name') }}</span>
    </div>
    <div class="fromItem">
      <input name="age" type="text" v-model="age" placeholder="年龄" v-validate="'required'">
      <span v-show="errors.has('age')" class="help">{{ errors.first('age') }}</span>
    </div>
    <button @click="commitData">提交</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "",
      age: ""
    };
  },
  methods: {
    commitData() {
      this.$validator.validateAll().then(result => {
        if (result) {
          alert("验证通过");
          return;
        }
        alert("请检查表单");
      });
    }
  }
};
</script>
```

### 自定义验证规则
在validator.js文件中引入Validator 对象；

```  javascript
import { Validator } from "vee-validate";

/*自定义验证规则*/
Validator.extend("mobile", {
    getMessage: field => "电话号码格式不正确",
    validate: value =>
        value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
});

Validator.extend("chinese", {
    getMessage: field => "只能填写中文",
    validate: value =>
        /[^\u0000-\u00FF]/.test(value)
});

/*自定义错误消息*/
const Dictionary = {
    zh_CN: {
        messages: {
            required: () => "必填项。",
        },
        attributes: {
            email: "邮箱",
            mobile: '电话号码',
            idCard: "身份证号码",
        }
    }
};
// 自定义validate error 信息
Validator.localize(Dictionary);
```
在上面的那个`v-validate`指令使用后面添加你自定义的规则。
**温馨提示**
1. 自定义方法要放在自定义错误消息上面，要不错误信息会有问题。
2. 一个组件下保证验证的`name`属性唯一，除非你需要特定联动效果。
具体如何使用在本人的github上有😊一个小demo。[地址](https://github.com/OuYangResume/Vue-Gis/blob/master/src/views/test/VeeValidate.vue)

### 校验范围的设定
当一个Vue组件中多个form表单,每个表单当然都有自己的请求。所以在这种情况下就需要给每个验证设置一个领域。
给每个验证设置一个`data-vv-scope`属性。为这个领域取一个name
在提交表单之前validateAll（）方法修改成validate("name.*")来进行过滤。
这种验证的方式在上面👆给个地址也有用到。
### 需要更多就移步至[VeeValidate官网](https://baianat.github.io/vee-validate/)


