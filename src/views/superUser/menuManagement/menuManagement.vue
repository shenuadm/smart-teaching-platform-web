<template>
  <div>
    <el-button type="primary" size="small" class="addRoot" @click="addMenuDate()">添加根节点</el-button>
    <span class="top">
      <el-row style="width:100%">
        <el-col :span="4">
          <span>显示名称</span>
        </el-col>
        <el-col :span="5">
          <span>菜单名称</span>
        </el-col>
        <el-col :span="2">
          <span >菜单类型</span>
        </el-col>
        <el-col :span="5">
          <span >菜单路径</span>
        </el-col>
        <el-col :span="2">
          <span >菜单排序</span>
        </el-col>
        <el-col :span="6">
          <span>操作</span>
        </el-col>
      </el-row>
    </span>
    <el-container>
      <div class="block">
        <el-tree
          :data="tableData"
          node-key="id"
          accordion
          :expand-on-click-node="false"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <el-row style="width:100%">
              <el-col :span="3">
                <span>{{ node.data.title }}</span>
              </el-col>
              <el-col :span="6">
                <span>{{ node.data.menuName }}</span>
              </el-col>
              <el-col :span="2">
                <span>{{ node.data.type}}</span>
              </el-col>
              <el-col :span="5">
                <span>{{ node.data.funurl}}</span>
              </el-col>
              <el-col :span="2">
                <span>{{ node.data.sort}}</span>
              </el-col>
              <el-col :span="6">
                <span>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="addMenuDate(node.data.id)"
                  >
                    添加
                  </el-button>
                  <el-button type="primary" size="mini" @click="reviseFun(node.data)">
                    修改
                  </el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    @click="delMenuDate(node.data.id)"
                  >
                    删除
                  </el-button>
                </span>
              </el-col>
            </el-row>
          </span>
        </el-tree>
      </div>
    </el-container>
    <!-- 新增根节点功能 -->
    <el-dialog
      title="新增根节点"
      :visible.sync="addVisible"
      width="40%"
    >
      <el-form ref="form" :model="add" :rules="rules" label-width="80px">
        <el-form-item label="显示名称" prop="title">
          <el-input v-model="add.title" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="add.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" >
          <el-input v-model="add.icon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="funurl">
          <el-input
            v-model="add.funurl"
            placeholder="请输入菜单路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" class="type" prop="type">
          <el-select v-model="add.type" placeholder="请输入菜单类型">
            <el-option label="导航" value="0"></el-option>
            <el-option label="菜单" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单排序" class="sort">
          <el-input-number
            placeholder="请输入菜单排序"
            v-model="add.sort"
            controls-position="right"
          >
          </el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="addcancel('form')">取 消</el-button>
        <el-button type="primary" @click="addsave">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增节点功能 -->
    <el-dialog
      title="新增节点"
      :visible.sync="addsonVisible"
      width="40%"
    >
      <el-form ref="form" :model="add" label-width="80px" :rules="rules">
        <el-form-item label="显示名称" prop="title">
          <el-input v-model="add.title" placeholder="请输入显示名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="add.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" >
          <el-input v-model="add.icon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="funurl">
          <el-input
            v-model="add.funurl"
            placeholder="请输入菜单路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" class="type" prop="type">
          <el-select v-model="add.type" placeholder="请输入菜单类型">
            <el-option label="菜单" value="1"></el-option>
            <el-option label="按钮" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单排序" class="sort" >
          <el-input-number
            placeholder="请输入菜单排序"
            v-model="add.sort"
            controls-position="right"
          >
          </el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="addsoncancel">取 消</el-button>
        <el-button type="primary" @click="addsave">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改数据 -->
    <el-dialog
      title="修改"
      :visible.sync="upVisible"
      width="40%"
    >
      <el-form ref="form" :model="revise" label-width="80px" :rules="rules">
        <el-form-item label="显示名称" prop="title">
          <el-input
            v-model="revise.title"
            placeholder="请输入显示名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="revise.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input
            v-model="revise.icon"
            placeholder="请输入菜单图标"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="funurl">
          <el-input
            v-model="revise.funurl"
            placeholder="请输入菜单路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单类型" class="type" prop="type">
          <el-select v-model="revise.type" placeholder="请输入菜单类型">
            <el-option label="菜单" value="1"></el-option>
            <el-option label="按钮" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单排序" class="sort" prop="sort">
          <el-input-number
            placeholder="请输入菜单排序"
            v-model="revise.sort"
            controls-position="right"
          >
          </el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center">
        <el-button @click="upcancel('form')">取 消</el-button>
        <el-button type="primary" @click="upsave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getdata, adddata, deldata, upmenuData } from "@/utils/api";
export default {
  components: {},
  data() {
    return {
      upVisible: false,
      addVisible: false,
      addsonVisible: false,
      tableData: [],
      add: {
        title: "",
        funurl: "",
        type: "",
        menuName: "",
        icon: "",
        sort: "",
        funpid: "",
      },
      addson: {
        title: "",
        funurl: "",
        type: "",
        menuName: "",
        icon: "",
        sort: "",
      },
      revise: {
        id:"",
        title: "",
        funurl: "",
        funtype: "",
        menuName: "",
        icon: "",
        sort: "",
        funpid:""
      },
      rules:{
        title: [
          { required: true, message: '请输入显示名称', trigger: 'blur' },
        ],
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
        ],
        icon: [
          { required: true, message: '请输入菜单图标', trigger: 'blur' },
        ],
        funurl: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择菜单类型', trigger: 'change' },
        ],
        sort: [
          { required: true, message: '请选择菜单排序', trigger: 'blur' },
        ],
      }
    };
  },
  mounted() {
    this.getMenuData();
  },
  methods: {
    getMenuData() {
      getdata().then((res) => {
        this.tableData = res.data;
      });
    },
    // 新增根节点，节点//
    addMenuDate(e) {
      const funpid = e;
      if (funpid === undefined) {
        this.add.funpid = 0;
        this.addVisible = true;
      } else {
        this.add.funpid = funpid;
        this.addsonVisible = true;
      }
    },
    // 确认按钮
    addsave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          adddata(this.add).then((res) => {
            this.getMenuData()
            console.log(this.add);
          });
          this.addVisible === false || this.addsonVisible === false;
          this.$message({
            message: "恭喜你，添加成功",
            type: "success",
          });
        } else {
          return false;
        }
      })

    },
    // 取消按钮
    addcancel(from) {
      this.add = {}
      this.$refs[from].resetFields();
      this.addVisible = false;
    },
    addsoncancel(){
      this.getMenuData()
      this.addsonVisible = false;
    },
    // 修改数据//
    reviseFun(e) {
      this.revise = e
      console.log(this.revise);
      this.upVisible = true;
    },
    // 确认按钮
    upsave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          upmenuData(this.revise).then((res) => {
            this.getMenuData()
            console.log(res)
          });
          this.upVisible = false;
          this.$message({
            message: "恭喜你，修改成功",
            type: "success",
          });
        } else {
          return false;
        }
      })

    },
    // 取消按钮
    upcancel(from) {
      this.$refs[from].resetFields();
      this.upVisible = false;
    },
    // 删除
    delMenuDate(e) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(e);
          deldata(e).then((res) => {
            this.getMenuData()
            console.log(res);
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          
        });
    },
  },
};
</script>

<style scoped>
/* 添加根菜单 */
.addRoot {
  display: block;
}
/* 导航栏 */
.el-menu-vertical-demo {
  width: 200px;
  margin-top: 20px;
}
/* 树形列表 */
.custom-tree-node {
  width: 900px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  font-size: 16px;
}
.el-tree {
  width: 900px;
  height: 380px;
}
.el-input-group {
  margin: 0 50px 20px 20px !important;
}

/* 菜单类型 */
.type {
  width: 240px !important;
  float: left;
}
/* 菜单排序 */
.sort {
  width: 200px;
  display: inline-block;
}
.top{
  display: block;
  width: 100%;
  height: 50px;
  /* margin: 5px 0 0; */
  margin-top: 20px;
  text-align: center;
  line-height: 50px;
  background-color: #fafafa;
  box-shadow: 0 2px 2px #dddddd;
}
</style>
<style>
.el-tree-node__content {
  margin: 5px 0;
  height: 50px;
  background-color: #fafafa;
  box-shadow: 0 2px 2px #dddddd;
}
/* 新增弹出框的脚部 */
.el-dialog__footer {
  text-align: center !important;
}
</style>
