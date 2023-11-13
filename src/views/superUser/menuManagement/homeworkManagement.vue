<template>
    <div>
      <div class="header">
        <div class="title">作业名称:</div>
        <el-input v-model="input" id="inputh" placeholder="请输入内容"></el-input>
        <button class="but" @click="search">搜索</button>
        <button class="but" @click="resetting">重置</button>
        <el-button type="primary" class="exper" @click="addexper">添加作业</el-button>
        <el-button type="danger" class="exper" @click="delexper">批量删除</el-button>
        <el-button type="primary" class="exper" @click="returnexper">返回</el-button>
      </div>
  
      <el-table
        ref="multipleTable"
        height="410"
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="custom-table"
        v-if="dialogtabledata"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="name" label="作业名称" width="100"></el-table-column>
        <el-table-column prop="content" label="作业内容" width="220" align="center" ></el-table-column>
        <el-table-column prop="answer" label="参考答案" width="220" align="center" ></el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.status === true" class="user">启用</div>
            <div v-else-if="scope.row.status === false" class="forbidden">禁用</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="editexrept(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 搜索 -->
      <el-table
        ref="multipleTable"
        :data="searchdata.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="custom-table"
        v-if="exdialogtabledata"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="name" label="作业名称" width="60"></el-table-column>
        <el-table-column prop="content" label="作业内容" width="200"></el-table-column>
        <el-table-column prop="answer" label="参考答案" width="200"  style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" ></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
          <div v-if="scope.row.status === true" class="user">启用</div>
          <div v-else-if="scope.row.status === false" class="forbidden">
            禁用
          </div>
        </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" size="small">编辑</el-button>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
        ></el-pagination>
      </div>
  
      <!-- 添加/编辑实验 -->
      <el-dialog :visible.sync="dialogVisible" width="30%">
        <template v-if="edit">
          <span slot="name">添加作业</span>
        </template>
        <template v-else>
          <span slot="name">编辑作业</span>
        </template>
        <el-input class="inputw" placeholder="请输入作业名称" v-model="revise.name">
          <template slot="prepend">作业名称</template>
        </el-input>
        <el-input class="inputw" placeholder="请输入作业内容" v-model="revise.content" type="textarea">
          <template slot="prepend">作业内容</template>
        </el-input>
        <el-input type="textarea" class="inputw" placeholder="请输入参考答案" v-model="revise.answer">
          <template slot="prepend">参考答案</template>
        </el-input>
        <el-input
        class="inputw"
        placeholder="请输入课程状态"
        v-model="revise.status"
      >
        <template slot="prepend">状态</template>
      </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button @click="serve">保存</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import { exper, experadd, experdel, experedit, mexperdel } from "@/utils/api";
  export default {
    data() {
      return {
        multipleSelection: [],
        tableData: [
            {
                name:"111",
                content:"111",
                answer:"111",
                status:false,
            }
        ],
        searchdata: [
            {
                name:"111",
                content:"111",
                answer:"111",
                status:false,
            }
        ],
        arr: [],
        currentPage: 1,
        pageSize: 5,
        input: "",
        dialogtabledata: true,
        exdialogtabledata: false,
        dialogVisible: false,
        articleId: 0,
        edit: "",
        id:"",
        input:"",
        revise: {
          name: "",
          content: "",
          answer: "",
          status: "",
        },
      };
    },
    methods: {
      //实验报告
    //   exreport(e) {
    //     this.$router.push({
    //       path: "/laboratoryReport",
    //       name: "laboratoryReport",
    //       query: {
    //         id: e.id,
    //         sort: e.sort,
    //       },
    //     });
    //   },
      //搜索
      search() {
        for (let i = 0; i < this.tableData.length; i++) {
          const item = this.tableData[i];
  
          // 判断条件，这里假设满足 condition 为 true 的对象
          if (item.title === this.input) {
            // 将满足条件的对象添加到 newArray 数组中
            this.searchdata.push(item);
            this.dialogtabledata = false;
            this.exdialogtabledata = true;
          }
        }
      },
      //重置
      resetting() {
  this.dialogtabledata = true;
  this.exdialogtabledata = false;
  this.input = "";
  this.searchdata = [];
  this.tableData = [  // 将数据重新赋值给tableData数组
  ];
},
     // 添加实验
     addexper() {
      this.dialogVisible = true;
      this.edit = true;
      this.revise = {
        name: "",
        content: "",
        answer: "",
        status: ""
      };
    },

    // 编辑实验
    editexrept(e) {
      this.revise = {
        name: e.name,
        content: e.content,
        answer: e.answer,
        status: e.status
      };
      this.dialogVisible = true;
      this.edit = false;
    },
      //保存
    //   serve() {
    //     if (this.edit == true) {
    //       let data = {
    //         title: this.revise.title,
    //         classHour: this.revise.classHour,
    //         description: this.revise.description,
    //         file: this.revise.fileUrl,
    //         articleId: this.articleId,
    //       };
    //       experadd(data).then((res) => {
    //         console.log(res);
    //         this.dialogVisible = false;
    //         this.edit == "";
    //         window.location.reload();
    //       });
    //     } else {
    //       let data = {
    //         title: this.revise.title,
    //         classHour: this.revise.classHour,
    //         description: this.revise.description,
    //         file: this.revise.fileUrl,
    //         articleId: this.articleId,
    //         id: this.revise.id,
    //       };
    //       experedit(data).then((res) => {
    //         console.log(res);
    //         this.dialogVisible = false;
    //         this.edit == "";
    //         window.location.reload();
    //       });
    //     }
    //   },
     // 保存
     serve() {
      if (this.edit) {
        // 添加实验
        this.tableData.push({
          name: this.revise.name,
          content: this.revise.content,
          answer: this.revise.answer,
          status: Boolean(this.revise.status),
        });
      } else {
        // 编辑实验
        const index = this.tableData.findIndex(item => item.id === this.revise.id);
        if (index !== -1) {
          this.tableData[index].name = this.revise.name;
          this.tableData[index].content = this.revise.content;
          this.tableData[index].answer = this.revise.answer;
          this.tableData[index].status = this.revise.status;
        }
      }
      this.dialogVisible = false;
    },
      //取消
      cancel() {
        this.dialogVisible = false;
        // window.location.reload();
      },
      //删除
    //   del(e) {
    //     this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning",
    //     })
    //       .then(() => {
    //         experdel(e).then((res) => {
    //           window.location.reload();
    //           this.$message({
    //             type: "success",
    //             message: "删除成功!",
    //           });
    //         });
    //       })
    //       .catch(() => {});
    //   },
    del(e) {
      const index = this.tableData.findIndex(item => item.id === e.id);
      if (index !== -1) {
        this.tableData.splice(index, 1);
      }
    },
      //批量删除
      delexper() {
        this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let data = this.arr;
            mexperdel(data).then((res) => {
              window.location.reload();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },
      //返回章节
      returnexper() {
        this.$router.push({
          path: "/chapterManagemet",
          name: "chapterManagemet",
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.multipleSelection.forEach((obj) => {
          const id = obj.id;
          this.arr.push(id);
          const arrdel = [...new Set(this.arr)];
          this.arr = arrdel;
          console.log(arrdel);
        });
      },
    },
    mounted() {
      const id = this.$route.query.id;
      this.articleId = id;
      console.log(id);
    //   exper(id).then((res) => {
    //     this.tableData = res.data;
    //     console.log(res);
    //   });
    },
  };
  </script>
  
  <style scoped>
  .header {
    position: relative;
    width: 100%;
    height: 30px;
    display: flex;
    top: -10px;
  }
  .title {
    width: 80px;
    line-height: 30px;
  }
  .but {
    position: relative;
    text-align: center;
    line-height: 30px;
    width: 40px !important;
    background-color: #409eff;
    border: none;
    margin-left: 5px;
    border-radius: 5px;
    color: white;
    left: 150px;
  }
  .exper {
    position: relative;
    left: 155px;
    text-align: center;
    line-height: 7px;
  }
  .inputw {
    width: 300px;
    margin-top: 10px;
  }
  /* .opertea {
    margin-left: -330px;
  } */
  </style>
  <style>
  #inputh {
    height: 30px !important;
    width: 150px !important;
  }
  .el-color-picker__icon,
  .el-input,
  .el-textarea {
    width: 0px;
  }
  .el-input-group__prepend {
    width: 55px;
  }
  .custom-table{
    overflow: hidden !important; 
    white-space: nowrap !important;
     text-overflow: ellipsis !important;
  }
  .user {
  background-color: #08b1e4;
  color: white;
}
.forbidden {
  background-color: rgb(166, 2, 2);
  color: white;
}
  </style>