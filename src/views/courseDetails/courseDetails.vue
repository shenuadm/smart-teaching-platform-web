<template>
  <div class="content warpper">
    <div class="zh-mgb-20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: path }"
          >课程详情</el-breadcrumb-item
        >
        <el-breadcrumb-item :to="{ path: '/courseDetails' }">{{
          courseObj.name
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="course-info theme-bg-white btn-radius-5 zh-mgb-20 zh-pd-10">
      <img src="@/assets/addbg.jpg" alt="" />
      <div class="info-content zh-mgl-30">
        <div class="info-content-left">
          <p>
            课程名称：<span>{{ courseObj.name }}</span>
          </p>
          <p>
            选课开始日期：<span>{{ courseObj.selectStartDate }}</span>
          </p>
          <p>
            授课开始日期：<span>{{ courseObj.startDate }}</span>
          </p>
          <p>
            课程状态：<span ref="status">{{ courseObj.status }}</span>
          </p>
        </div>
        <div class="info-content-right">
          <p>
            任课教师：<span>{{ courseObj.userName }}</span>
          </p>
          <p>
            选课结束日期：<span>{{ courseObj.selectEndDate }}</span>
          </p>
          <p>
            授课结束日期：<span>{{ courseObj.endDate }}</span>
          </p>
          <p>
            授课地点：<span>{{ courseObj.address }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="course-list theme-bg-white btn-radius-5">
      <div class="tree">
        <el-tree
          :data="data"
          :props="defaultProps"
          :expand-on-click-node="false"
          accordion
          @node-click="handleNodeClick"
        >
          <span
            class="node-title"
            slot-scope="{ node, data }"
            :style="{ color: node.data.textColor || 'inherit' }"
          >
            {{ node.data.index }}{{ node.data.title }}
          </span>
        </el-tree>
      </div>
      <div class="tree-content">
        <!-- 课件 -->
        <!-- <div class="courseWare" ref="courseWare">课件</div> -->
        <iframe src="" frameborder="0" class="courseWare" ref="courseWare"></iframe>
        <!-- 实验报告 -->
        <div class="experimentReport" ref="experiment">
          <el-tabs v-model="activeName">
            <el-tab-pane label="实验内容" name="first">
              <div class="experiment-title">
                <p>【实验标题】</p>
                <div class="experiment-content">
                  {{ experimentContent.title }}
                </div>
              </div>
              <div class="experiment-title">
                <p>【实验课时】</p>
                <div class="experiment-content">
                  {{ experimentContent.classHour }}
                </div>
              </div>
              <div class="experiment-title">
                <p>【实验描述】</p>
                <div class="experiment-content">
                  {{ experimentContent.description }}
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="实验操作" name="second">
              <div class="login-user">
                <label for="name">登录用户：</label>
                <input type="text" disabled v-model="form.name" />
              </div>
              <div class="login-pwd">
                <label for="pwd">登录密码：</label>
                <input :type="inputType" disabled v-model="form.pwd" />
                <img src="@/assets/eye.png" alt="" @click="toShow" />
              </div>
              <div class="openWindow">
                <a href="javascript:void(0)" ref="currentWindow" class="btn-bg-b" @click="openCurrentWindow">当前窗口打开</a>
                <iframe src="" frameborder="0" class="iframeMain" ref="iframeMain"></iframe>
                <a href="javascript:void(0)" ref="newWindow" class="btn-bg-b" @click="openNewWindow">新窗口打开</a>
              </div>
            </el-tab-pane>
            <el-tab-pane label="实验报告" name="third">
              <div class="experiment-title">
                <p>【实验模板】</p>
                <a href="javascript:void(0)" ref="downLoadTemplate" class="experiment-link zh-fc-blue"
                  >点击下载实验模板
                </a>
              </div>
              <div class="experiment-title">
                <p>【实验报告】</p>
                <div class="experiment-report-result">
                  <p class="experiment-report-title zh-fs-16 zh-fw-m">
                    实验结果:
                  </p>
                  <Editor ref="editor"></Editor>
                </div>
                <div class="experiment-report-step">
                  <p class="experiment-report-title zh-fs-16 zh-fw-m">
                    实验步骤:
                  </p>
                  <ul class="step-all">
                    <li class="step-item" v-for="item in experimentStep">
                      <p>{{ item.name }}</p>
                      <Editor ref="editors"></Editor>
                    </li>
                  </ul>
                </div>
                <div class="experiment-report-operate">
                  <el-button type="primary" @click="saveContent">保存</el-button>
                  <el-button type="primary" @click="submit">提交</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="实验成绩" name="fourth">
              <!-- 教师端 -->
              <el-table
                :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                height="auto"
                border
                v-if="roleId==='2'"
                style="width: 100%"
              >
                <el-table-column prop="username" label="学生姓名">
                </el-table-column>
                <el-table-column prop="title" label="实验标题" width="120">
                </el-table-column>
                <el-table-column prop="result" label="实验结果" width="120">
                </el-table-column>
                <el-table-column prop="score" label="成绩" width="80">
                </el-table-column>
                <el-table-column prop="comment" label="评语" width="180">
                </el-table-column>
                <el-table-column prop="updateTime" label="更新日期" width="100">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="200">
                  <template slot-scope="scope">
                    <el-button @click="checkDetails(scope.row)" type="text" size="middle">查看详情</el-button>
                    <el-button @click="checkReport(scope.row)" type="text" size="middle">查看报告</el-button>
                    <el-button @click="editContent(scope.row)" type="text" size="middle">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!-- 学生端 -->
              <el-table
                :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                height="auto"
                border
                v-if="roleId==='3'"
                style="width: 100%"
              >
                <el-table-column prop="updateTime" label="提交时间">
                </el-table-column>
                <el-table-column prop="title" label="实验标题" width="120">
                </el-table-column>
                <el-table-column prop="expResult" label="实验结果" width="120">
                </el-table-column>
                <el-table-column prop="stuGrade" label="学生成绩">
                </el-table-column>
                <el-table-column prop="comment" label="评语" width="200">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
              </el-table>
              <div class="block zh-mgt-20">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-sizes="[5, 10, 20]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="tableData.length"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 教师端，点击查看报告，弹出学生的实验报告 -->
        <el-dialog
          title="实验报告"
          :visible.sync="showReportVisible"
          width="30%"
          :before-close="handleCloseReport">
          <div class="stuExperimentReport">
            <div class="stuInfo zh-fs-16">
              <span>学生姓名:{{stuForm.username}}</span>
              <span>学生成绩:{{stuForm.score}}</span>
            </div>
            <div class="stuExperimentContent">
              <div class="exTitle zh-fs-16">
                <p class="title zh-fw-m">实验标题：</p>
                <div>sql注入</div>
              </div>
              <div class="exResult zh-fs-16">
                <p class="title zh-fw-m">实验结果:</p>
                <div>111</div>
              </div>
              <div class="exSteps zh-fs-16">
                <p class="title zh-fw-m">实验步骤:</p>
                <ul>
                  <li>
                    <p>步骤一</p>
                    <div>111</div>
                  </li>
                  <li>
                    <p>步骤二</p>
                    <div>222</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showReportVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
        <!-- 教师端，点击查看详情，弹出学生的成绩详情 -->
        <el-dialog
          title="成绩详情"
          :visible.sync="showDetailsVisible"
          width="30%"
          :before-close="handleCloseDetsils">
          <div class="stuScoreDetails">
            <div class="stuInfo zh-fs-16">
              <span>学生姓名:{{stuForm.username}}</span>
              <span>成绩:{{stuForm.score}}</span>
            </div>
            <div class="exTitle zh-fs-16">
              <p class="zh-fw-m">实验标题:</p>
              <div>{{stuForm.title}}</div>
            </div>
            <div class="exResult zh-fs-16">
              <p class="zh-fw-m">实验结果:</p>
              <div>{{stuForm.result}}</div>
            </div>
            <div class="exComment zh-fs-16">
              <p class="zh-fw-m">评语:</p>
              <div>{{stuForm.comment}}</div>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showDetailsVisible = false">关 闭</el-button>
          </span>
        </el-dialog>
        <!-- 教师端，点击编辑，可以编辑学生的成绩以及评语 -->
        <el-dialog
          title="编辑学生成绩评语"
          :visible.sync="showEditVisible"
          width="30%"
          :before-close="handleCloseEdit">
          <div class="form">
            <el-form ref="stuForm" :model="stuForm" label-width="80px">
              <el-form-item label="学生姓名">
                <el-input v-model="stuForm.username" disabled></el-input>
              </el-form-item>
              <el-form-item label="实验标题">
                <el-input v-model="stuForm.title" disabled></el-input>
              </el-form-item>
              <el-form-item label="学生成绩">
                <el-input v-model="stuForm.score"></el-input>
              </el-form-item>
              <el-form-item label="评语">
                <el-input type="textarea" v-model="stuForm.comment"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel('stuForm')">取 消</el-button>
            <el-button type="primary" @click="determine">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTreeData,
  getExperimentContent,
  getExperimentData,
  courseDetails,
  teacherCourseDetails,
  getStudentScore,
  scoreList,
  saveExperimentReport,
  checkChapter
} from "@/utils/api.js";
import { courseStatusConvert } from "@/utils/status.js";
import {handleDate} from '@/utils/date.js'
export default {
  data() {
    return {
      path:'',//面包屑路由跳转
      courseObj: {}, //课程信息
      data: [], //存储树形数据,
      defaultProps: {
        children: "children", //data当中的children的字段名
        label: "title", //data当中的label的字段名
      },
      activeName: "first", //默认选择的第一个
      form: {
        name: "", //登录用户
        pwd: "", //登录密码
      },
      inputType: "password",
      experimentId: "", //实验id
      teacherId: "", //教师课程id
      roleId:'',
      experimentContent: {}, //实验内容
      experimentStep: [],//实验步骤
      tableData: [],//学生成绩
      richText: [], //存储富文本数据
      currentPage:1,//当前页
      pageSize:5,//每页的条数
      showReportVisible:false,//是否显示实验报告
      showDetailsVisible:false,//是否显示成绩详情
      showEditVisible:false,//是否显示编辑框
      stuForm:{},//学生成绩详情
    };
  },
  created() {
    this.roleId = localStorage.getItem("roleId")
    // 教师查看课程详情
    if(this.roleId === '2'){
      if(this.$route.query.id){
        this.path = '/myTeaching'
        this.teacherId = this.$route.query.id
        let courseId = this.$route.query.courseId
        teacherCourseDetails(courseId,this.teacherId).then(res=>{
          // console.log(res);
          this.courseObj = courseStatusConvert(res.data)
        })
      }else{
        this.path = '/courseCenter'
        let id = this.$route.query.courseId
        checkChapter(id).then(res=>{
          console.log(res);
          this.courseObj = res.courseInfo
        })
      }
    }else if(this.roleId === '3'){//学生查看课程详情
      this.path = '/myCourse'
      this.teacherId = this.$route.query.teacherCourseId;
      // 课程详情
      courseDetails(this.teacherId).then((res) => {
        this.courseObj = courseStatusConvert(res.course);
      });
    }
    let courseId = this.$route.query.courseId;
    // 获取树形数据
    getTreeData(courseId).then((res) => {
      let dataList = res.data;
      // 添加每个节点添加index，方便填写序号
      // 一级节点
      dataList.map((node, index, textColor) => {
        // 二级节点
        if (node.children != null) {
          node.children.map((cnode, index, textColor) => {
            // 三级节点
            if (cnode.children != null) {
              cnode.children.map((pcode, index, textColor) => {
                if (pcode.children == null) {
                  pcode.index = `实验${index + 1}、`;
                }
                pcode.textColor = "";
                return pcode;
              });
            }
            if (cnode.pid !== "") {
              cnode.index = `第${index + 1}节、`;
            }
            cnode.textColor = "";
            return cnode;
          });
        }
        if (node.pid == 0) {
          node.index = `第${index + 1}章、`;
        }
        node.textColor = "";
        return node;
      });
      this.data = dataList;
    });
  },
  mounted() {},
  methods: {
    // 树形控件的点击事件
    handleNodeClick(data) {
      // console.log(data);
      if (data.textColor == "") {
        data.textColor = "#409eff";
      } else {
        data.textColor = "";
      }
      // 如果点击的是二级节点，显示课件
      if (data.pid != 0 && data.pid != null) {
        this.$refs.courseWare.style.display = "block";
        this.$refs.courseWare.src = data.fileUrl
      } else {
        this.$refs.courseWare.style.display = "none";
      }
      // 如果点击的是三级节点，实验才会显示出来
      if (data.pid == null) {
        this.experimentId = data.id;
        // 实验内容
        getExperimentContent(this.experimentId).then((res) => {
          // console.log(res);
          this.experimentContent = res.data;
        });
        // 实验操作
        this.form.name = localStorage.getItem("hostName"); //登录名
        this.form.pwd = localStorage.getItem("hostPwd"); //登录密码
        // 下载实验模版
        this.$refs.downLoadTemplate.href = data.fileUrl
        // 实验步骤
        getExperimentData(this.experimentId, this.teacherId).then((res) => {
          // console.log(res);
          this.experimentStep = res.data;
        });
        // 学生的实验成绩
        getStudentScore(this.teacherId).then((res) => {
          // console.log(res);
          this.tableData = res.data;
        });
        // 成绩表格(教师端)
        scoreList(this.experimentId,this.teacherId).then(res=>{
          // console.log(res);
          this.tableData = handleDate(res.data)
        })
        this.$refs.experiment.style.display = "block";
      } else {
        this.$refs.experiment.style.display = "none";
      }
    },
    // 点击眼睛，显示密码，再次点击，隐藏密码
    toShow() {
      if (this.inputType === "password") {
        this.inputType = "text";
      } else {
        this.inputType = "password";
      }
    },
    // 当前窗口打开
    openCurrentWindow(e) {
      e.preventDefault();
      this.$refs.currentWindow.href = 'https://123.60.85.111:4200/'
      this.$refs.iframeMain.src = this.$refs.currentWindow.href
    },
    // 新窗口打开
    openNewWindow() {
      this.$refs.newWindow.href = 'https://123.60.85.111:4200/'
    },
    // 保存富文本内容
    saveContent() {
      // console.log(this.html);
      // console.log(this.$refs.editor);
      this.richText.push(this.$refs.editor.html);//保存实验结果
      this.$refs.editors.map((item) => {
        this.richText.push(item.html);
      });
      const planContent = this.richText
      let data = {
        experimentContent:this.richText,
        planContent:planContent.join(","),
        teacherCourseId:this.teacherId
      }
      getExperimentData(this.experimentId,this.teacherId).then(res=>{
        saveExperimentReport(this.experimentId,data).then(res=>{

        })
      })
    },
    // 提交实验报告
    submit() {
      this.richText.push(this.$refs.editor.html);//保存实验结果
      this.$refs.editors.map((item) => {
        this.richText.push(item.html);
      });
    },
    // 教师端，成绩表格
    // 查看详情
    checkDetails(row){
      this.showDetailsVisible = true
      this.stuForm = row
    },
    handleCloseDetsils(){
      this.showDetailsVisible = false
    },
    // 查看学生实验报告
    checkReport(row){
      this.showReportVisible = true
      this.stuForm = row
    },
    handleCloseReport() {
      this.showReportVisible = false
    },
    // 编辑学生成绩、评语
    editContent(row){
      this.showEditVisible = true
      this.stuForm = row
    },
    handleCloseEdit(){
      this.showEditVisible = false
    },
    // 取消编辑
    cancel(formName){
      this.$refs[formName].resetFields();
      this.showEditVisible = false
    },
    // 确定编辑
    determine(){
      this.stuForm = this.stuForm
      this.showEditVisible = false
    },
    // 分页
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
};
</script>

<style scoped>
.content {
  margin: 20px auto;
}
.course-info,
.course-list {
  border: 1px solid #dedede;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  text-align: left;
  padding: 20px;
}
.course-info {
  height: 200px;
}
.course-info img {
  width: 200px;
  height: 160px;
}
.info-content {
  display: flex;
  flex-direction: row;
}
.info-content p {
  margin-top: 0 !important;
}
.info-content-right {
  margin-left: 50px;
}
.tree {
  width: 200px;
}
.node-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tree-content {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.experimentReport,
.courseWare {
  display: none;
  width: 100%;
}
.experiment-title > p {
  font-size: 18px;
  font-weight: 700;
}
.experiment-content {
  padding: 10px;
}
.login-user,
.login-pwd {
  width: 300px;
  margin: 20px 0;
}
.login-user input,
.login-pwd input {
  height: 15px;
  padding: 5px 10px;
  outline: none;
}
.login-pwd {
  position: relative;
}
.login-pwd img {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
}
.openWindow{
  position: relative;
  height: 200px;
}
.openWindow a {
  display: inline-block;
  color: #fff;
  padding: 5px 10px;
  margin-right: 10px;
  border-radius: 5px;
}
.iframeMain{
  position: absolute;
  top: 40px;
  left: 0;
  width: 500px;
}
#vt100 #scrollable{
  overflow-y: hidden !important;
}
.experiment-link {
  display: inline-block;
  text-decoration: underline;
  text-indent: 10px;
}
.experiment-report-result,
.experiment-report-step {
  padding-left: 10px;
}
.step-all {
  padding: 0 !important;
}
.experiment-report-operate {
  text-align: center;
}
.stuInfo{
  display: flex;
  justify-content: space-between;
}
.block{
  text-align: center;
}
.exSteps>ul{
  padding: 0;
}
</style>
<style>
.el-tabs__item {
  background-color: #b2d5f1 !important;
  color: #000 !important;
  padding: 0 20px !important;
  border-right: 1px solid #fff;
}
.el-tabs__item.is-active {
  background-color: #409eff !important;
  color: #fff !important;
}
.el-button--primary {
  background-color: #4faff0;
  border-color: #4faff0;
}
.el-table .el-table__cell {
  text-align: center;
}
.el-table .cell {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 指定要显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>