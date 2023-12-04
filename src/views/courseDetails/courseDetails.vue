<template>
  <div class="content warpper" id="courseDeatils">
    <div class="zh-mgb-20">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: path }">课程详情</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/courseDetails' }">{{
          courseObj.name
        }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="course-info theme-bg-white btn-radius-5 zh-mgb-20 zh-pd-10">
      <img src="@/assets/addbg.jpg" alt="" />
      <div class="info-content zh-mgl-30">
        <div class="info-content-left">
          <div class="info-name">
            <div>
              课程名称：<span>{{ courseObj.name }}</span>
            </div>
          </div>
          <div>
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
    <div class="course-list content-height theme-bg-white btn-radius-5">
      <!-- 左侧树形结构 -->
      <div class="tree">
        <el-tree
          :data="data"
          :props="defaultProps"
          accordion
          :highlight-current="true"
          @node-click="handleNodeClick"
        >
          <span class="node-title" slot-scope="{ node, data }">
            {{ node.data.index }}{{ node.data.title }}
          </span>
        </el-tree>
      </div>
      <div class="tree-content">
        <!-- 课件 -->
        <!-- <div class="courseWare" ref="courseWare">课件</div> -->
        <iframe
          src=""
          frameborder="0"
          class="courseWare iframe"
          ref="courseWare"
        ></iframe>
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
            <el-tab-pane v-if="teacherId" label="实验操作" name="second">
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
                <!-- <a
                  href="javascript:void(0)"
                  ref="currentWindow"
                  class="btn-bg-b"
                  @click="openCurrentWindow"
                  >当前窗口打开</a
                >
                <iframe
                  src=""
                  frameborder="0"
                  class="iframeMain"
                  ref="iframeMain"
                ></iframe> -->
                <!-- <a
                  href="javascript:void(0)"
                  ref="newWindow"
                  class="btn-bg-b"
                  @click="openNewWindow"
                  >新窗口打开</a
                > -->
                <a
                  href="javascript:void(0)"
                  ref="newWindow"
                  class="btn-bg-b"
                  @click="openNewWindow"
                  >访问实验机</a
                >
              </div>
            </el-tab-pane>
            <el-tab-pane
              v-if="teacherId"
              label="实验报告"
              name="third"
              class="experiment-report"
            >
              <div class="experiment-title">
                <p>【实验模板】</p>
                <a
                  href="javascript:void(0)"
                  ref="downLoadTemplate"
                  class="experiment-link zh-fc-blue"
                  >点击下载实验模板
                </a>
              </div>
              <div class="sumbit-status">
                <img src="@/assets/notsubmit.png" alt="" class="status-img" />
                <div v-if="submitStatus" class="submitStatus">
                  <p class="already-submit">已提交</p>
                  <p class="already-submit">{{ studentScore }}</p>
                </div>
                <div class="submitStatus">未提交</div>
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
                    <li
                      class="step-item"
                      v-for="(item, index) in experimentStep"
                      :key="index"
                    >
                      <p>步骤{{ index + 1 }} {{ item.name }}</p>
                      <Editor ref="editors"></Editor>
                    </li>
                  </ul>
                </div>
                <div class="experiment-report-operate">
                  <el-button type="primary" @click="saveContent" ref="btnStatus"
                    >保存</el-button
                  >
                  <el-button type="primary" @click="submit" ref="btnStatus"
                    >提交</el-button
                  >
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane v-if="teacherId" label="实验成绩" name="fourth">
              <!-- 学生端 -->
              <el-table
                :data="
                  tableData.slice(
                    (currentPage - 1) * pageSize,
                    currentPage * pageSize,
                  )
                "
                height="auto"
                border
                v-if="roleId === '3'"
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
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTreeData,
  getExperimentContent,
  getExperimentData,
  getExperimentStudentData,
  courseDetails,
  teacherCourseDetails,
  getExperimentResult,
  getStudentScore,
  scoreList,
  saveExperimentReport,
  checkChapter,
} from '@/utils/api.js';
import { courseStatusConvert } from '@/utils/status.js';
import { handleDate } from '@/utils/date.js';
export default {
  data() {
    return {
      path: '', //面包屑路由跳转
      courseObj: {}, //课程信息
      data: [], //存储树形数据,
      defaultProps: {
        children: 'children', //data当中的children的字段名
        label: 'title', //data当中的label的字段名
      },
      activeName: 'first', //默认选择的第一个
      form: {
        name: '', //登录用户
        pwd: '', //登录密码
      },
      inputType: 'password', //实验操作的密码框的type类型
      experimentId: '', //实验id
      teacherId: '', //教师课程id
      roleId: '', //角色id--2表示教师角色，3表示学生角色
      courseId: '', //课程的id
      studentCourseId: '', //学生实验id
      experimentContent: {}, //实验内容
      experimentStep: [], //实验步骤
      tableData: [], //学生成绩
      richTextResult: '', //存储富文本结果数据
      richTextPlans: [], //存储富文本步骤数据
      currentPage: 1, //当前页
      pageSize: 5, //每页的条数
      submitStatus: '', //学生实验提交状态
      studentScore: '', //学生实验成绩
    };
  },
  created() {
    this.roleId = localStorage.getItem('roleId');
    console.log(this.$route.query.id, 'query,id');
    if (this.roleId === '3') {
      //学生查看课程详情
      this.path = '/myCourse';
      this.teacherId = this.$route.query.teacherCourseId;
      this.studentCourseId = this.$route.query.studentCourseId;
      // 课程详情
      courseDetails(this.teacherId).then((res) => {
        this.courseObj = courseStatusConvert(res.course);
      });
    }
    this.courseId = this.$route.query.courseId;
    // 获取树形数据
    getTreeData(this.courseId).then((res) => {
      let dataList = res.data;
      // 添加每个节点添加index，方便填写序号
      // 一级节点
      dataList.map((node, index) => {
        // 二级节点
        if (node.children != null) {
          node.children.map((cnode, index) => {
            // 三级节点
            if (cnode.children != null) {
              cnode.children.map((pcode, index) => {
                if (pcode.children == null) {
                  pcode.index = `实验${index + 1} `;
                }
                return pcode;
              });
            }
            if (cnode.pid !== '') {
              cnode.index = `第${index + 1}节 `;
            }
            return cnode;
          });
        }
        if (node.pid == 0) {
          node.index = `第${index + 1}章 `;
        }
        return node;
      });
      this.data = dataList;
    });
  },
  methods: {
    // 树形控件的点击事件
    handleNodeClick(data) {
      // 如果点击的是二级节点，显示课件
      if (data.pid != 0 && data.pid != null) {
        this.$refs.courseWare.style.display = 'block';
        this.$refs.courseWare.src = `${window.location.origin}/#/pdf?url=${data.fileUrl}`;
        // this.$refs.courseWare.src = `${window.location.origin}/#/pdf?url=/static/test.pdf`;
      } else {
        this.$refs.courseWare.style.display = 'none';
      }
      // 如果点击的是三级节点，实验才会显示出来
      if (data.pid == null) {
        this.experimentId = data.id;
        // 实验内容
        getExperimentContent(this.experimentId).then((res) => {
          this.experimentContent = res.data;
        });
        // 实验操作 获取登录用户名与密码
        const name = localStorage.getItem('hostName');
        this.form.name = name === 'null' ? '' : name;
        const pwd = localStorage.getItem('hostPwd');
        this.form.pwd = pwd === 'null' ? '' : pwd;
        if (this.roleId === '3') {
          // 学生端实验结果、实验步骤
          getExperimentStudentData(
            this.experimentId,
            this.studentCourseId,
          ).then((res) => {
            // console.log(res);
            if (
              res.experimentReport.type === 2 &&
              res.experimentReport.status != 0
            ) {
              //学生已提交实验
              this.submitStatus = true;
              this.studentScore = res.experimentReport.score;
              this.$refs.btnStatus.disabled = true;
              this.$refs.btnStatus.type = '';
            }
            // 实验结果
            if (res.experimentReport.result !== null) {
              this.$refs.editor.html = res.experimentReport.result;
            }
            // this.$refs.editor.html = res.experimentReport.result
            // 实验步骤
            if (res.experimentReportPlans !== null) {
              this.experimentStep = res.experimentReportPlans;
              setTimeout(() => {
                res.experimentReportPlans.forEach((ritem, rindex) => {
                  this.$refs.editors.forEach((eitem, eindex) => {
                    if (rindex === eindex) {
                      eitem.html = ritem.content;
                    }
                  });
                });
              }, 1000);
            }
            // this.experimentStep = res.experimentReportPlans
            // setTimeout(()=>{
            //   res.experimentReportPlans.forEach((ritem,rindex)=>{
            //     this.$refs.editors.forEach((eitem,eindex)=>{
            //       if(rindex === eindex){
            //         eitem.html = ritem.content
            //       }
            //     })
            //   })
            // },1000)
          });
        }
        if (this.teacherId) {
          // 下载实验模版
          console.log(this.$refs.downLoadTemplate);
          this.$refs.downLoadTemplate.href = data.fileUrl;
          if (this.roleId === '2') {
            // 成绩表格(教师端)
            scoreList(this.experimentId, this.teacherId).then((res) => {
              // this.tableData = handleDate(res.data)
              this.tableData = res.data;
            });
          }
          if (this.roleId === '3') {
            // 学生的实验成绩
            getStudentScore(this.teacherId).then((res) => {
              this.tableData = res.data;
            });
          }
        }
        this.$refs.experiment.style.display = 'block';
      } else {
        this.$refs.experiment.style.display = 'none';
      }
    },
    // 点击眼睛，显示密码，再次点击，隐藏密码
    toShow() {
      if (this.inputType === 'password') {
        this.inputType = 'text';
      } else {
        this.inputType = 'password';
      }
    },
    // 当前窗口打开
    openCurrentWindow(e) {
      e.preventDefault();
      this.$refs.currentWindow.href = 'https://123.60.85.111:4200/';
      this.$refs.iframeMain.src = this.$refs.currentWindow.href;
    },
    // 新窗口打开
    openNewWindow() {
      // this.$refs.newWindow.href = 'https://123.60.85.111:4200/';
      window.open('https://engine443.com/ovirt-engine/web-ui/?locale=zh_CN');
    },
    // 保存富文本内容
    saveContent() {
      this.richTextResult = this.$refs.editor.html;
      this.$refs.editors.map((item) => {
        this.richTextPlans.push(item.html);
      });
      const planContent = this.richTextPlans;
      let data = {
        experimentId: this.experimentId, //实验id
        teacherCourseId: this.teacherId, //课程id
        experimentContent: this.richTextResult, //实验结果
        planContent: planContent, //实验步骤
      };
      saveExperimentReport(data).then((res) => {
        console.log(res);
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      });
    },
    // 提交实验报告
    submit() {
      this.$confirm(
        '实验只能提交一次，不可重复提交，确定提交吗？',
        '提交实验',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          // 获取富文本框的内容
          this.richTextResult = this.$refs.editor.html;
          this.$refs.editors.map((item) => {
            this.richTextPlans.push(item.html);
          });
          const planContent = this.richTextPlans;
          let data = {
            experimentId: this.experimentId, //实验id
            teacherCourseId: this.teacherId, //课程id
            experimentContent: this.richTextResult, //实验结果
            planContent: planContent, //实验步骤
            status: 1, //实验状态，表示提交
          };
          saveExperimentReport(data).then((res) => {
            console.log(res);
            this.$message({
              type: 'success',
              message: '提交成功!',
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交',
          });
        });
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
.content-height {
  min-height: 100vh;
}
.info-content-left {
  display: flex;
  flex-direction: column;
}
.info-content-left .info-name {
  margin-bottom: 16px;
}
.info-des {
  margin-top: 20px;
}
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

.course-list {
  overflow: hidden;
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
.iframe {
  height: 100vh;
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
.openWindow {
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
.iframeMain {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  height: 600px;
}
#vt100 #scrollable {
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
.stuInfo {
  display: flex;
  justify-content: space-between;
}
.block {
  text-align: center;
}
.exSteps > ul {
  padding: 0;
}
.experiment-report {
  position: relative;
}
.sumbit-status {
  position: absolute;
  top: 5px;
  right: 140px;
}
.status-img {
  display: inline-block;
  width: 200px;
  height: 140px;
  transform: rotate(35deg);
}
.submitStatus {
  position: absolute;
  font-size: 24px;
  font-weight: 500;
  color: red;
  top: 42px;
  right: 63px;
  transform: rotate(17deg);
}
.submitStatus > p {
  margin: 0;
  text-align: center;
}
.already-submit {
  color: rgb(11, 139, 11);
}
</style>
<style>
#courseDeatils .el-tabs__item {
  background-color: #b2d5f1 !important;
  color: #000 !important;
  padding: 0 20px !important;
  border-right: 1px solid #fff;
}
#courseDeatils .el-tabs__item.is-active {
  background-color: #409eff !important;
  color: #fff !important;
}
#courseDeatils .el-button--primary {
  background-color: #4faff0;
  border-color: #4faff0;
}
#courseDeatils .el-table .el-table__cell {
  text-align: center;
}
#courseDeatils .el-table .cell {
  display: -webkit-box;
  -webkit-line-clamp: 1; /* 指定要显示的行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
