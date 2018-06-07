---
title: SpringBoot与Vue实现分页
date: 2018-06-07 19:57:35
categories: Vue
tags: [SpringBoot,Vue]
---

### 主要技术路线
elementUI+axios+springboot
提供分页测试数据[接口地址](https://github.com/OuYangResume/springbootdemo)。页面[组件地址](https://github.com/OuYangResume/Vue-Gis/blob/master/src/views/element/table/paginationtable.vue)
<div  align="center"><img src="SpringBoot与Vue实现分页/page.png" width = "500" height = "400" alt="page" align=center />
</div>

<!-- more -->
### element表格与对话框
``` javascript 
<template>
<div>
    <el-table
    :data="tableData" 
    style="width: 100%">
    <el-table-column
      label="日期"
      width="180">
      <template slot-scope="scope1">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope1.row.date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      width="180">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <p>姓名: {{ scope.row.name }}</p>
          <p>住址: {{ scope.row.address }}</p>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.name }}</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>

    <el-table-column
        label="地址"
        width="300">
        <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.address }}</span>
        </template>
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

<el-dialog
  title="提示"
  :visible.sync="centerDialogVisible"
  width="30%"
  center>
    <el-form  :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        
        <el-form-item label="日期" prop="date" >
          <el-date-picker v-model="temp.date" type="datetime" placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="名称" >
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="地址" >
          <el-input v-model="temp.address"></el-input>
        </el-form-item>
      </el-form>

  <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
</div>
  
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      temp: {
        date: new Date(),
        name: "",
        address: ""
      }
    };
  },
  methods: {
    handleEdit(index, row) {
      // console.log(index, row);
      this.temp = Object.assign({}, row); // copy obj
      this.temp.date = new Date(this.temp.date);
      this.centerDialogVisible = true;
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  }
};
</script>
```
<div  align="center"><img src="SpringBoot与Vue实现分页/table.png" width = "500" height = "400" alt="table" align=center />
</div>

### axios获取数据
npm install axios --save
``` javascript
<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "表格", 
 	  listQuery: {
        page: 1,
        limit: 3,
      },
      newusers: [],
      total: null
    };
  },
  created() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      axios
      .get("http://localhost:8888/getList",{
          params:{
              pageNum:this.listQuery.page,
              pageSize:this.listQuery.limit
          }
      })
      .then(response => {
         console.log(response);
         this.newusers = response.data.list
         this.total=response.data.total
      })
      .catch(error => {
        console.log("axios==" + error);
      });
    }
  }
};
</script>
```
### springboot 集成PageHelper分页
#### pom.xml
``` xml
 		<!--pagehelper -->
        <dependency>
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper-spring-boot-starter</artifactId>
            <version>1.2.5</version>
        </dependency>
```
#### UserController
``` java 
   /**
     * @CrossOrigin是解决跨域问题
     * @RestController注解相当于@ResponseBody ＋ @Controller合
     * 在一起的作用。
     */
@RestController
@CrossOrigin
public class UserController {
    @Resource
    UserService userService;
    /**
     * 获取用户信息
     * @param pageNum 当前页
     * @param pageSize 当前页面展示数目
     */
    @RequestMapping(value = "/getList")
    public String getlist(int pageNum,int pageSize){
        Object users=userService.getUser(pageNum,pageSize);
        return JSON.toJSONString(users);
    }
}
```
#### UserServiceImpl实现类
``` java 
@Service
public class UserServiceImpl implements UserService{

    /**
     *
     * @Title: getUser
     * @Description: findByPage方法从数据库中获取所有user列表
     * @param pageNum 当前页
     * @param pageSize 当前页面展示数目
     * @return
     */
    @Override
    public PageInfo<User> getUser(int pageNum, int pageSize) {
        //使用分页插件,核心代码就这一行
        PageHelper.startPage(pageNum, pageSize);
        List<User> userList=userMapper.findByPage();
        PageInfo result =new PageInfo(userList);
        return result;
    }
}
```
<div  align="center"><img src="SpringBoot与Vue实现分页/post.png" width = "500" height = "400" alt="table" align=center />
</div>
结合以上三个技术就可以实现分页功能了。
