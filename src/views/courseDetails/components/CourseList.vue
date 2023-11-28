<template>
  <div
    class="course-list content-height theme-bg-white btn-radius-5"
    v-loading="loadingGlobal"
  >
    <!-- 左侧树形结构 -->
    <div class="tree">
      <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
        :highlight-current="true"
      >
        <span class="node-title" slot-scope="{ node, data }">
          {{ node.data.index }}{{ node.data.title }}
        </span>
      </el-tree>
    </div>
    <div class="tree-content">
      <!-- 课件 -->
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
            <!-- 实验内容插槽 -->
            <slot name="experiment"></slot>
          </el-tab-pane>
          <el-tab-pane v-if="teacherId" label="实验成绩" name="fourth">
            <!-- 实验成绩插槽 -->
            <slot name="experimentAchement"></slot>
            <div class="block zh-mgt-20">
              <el-pagination
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
export default {
  props: ['treeEvent', 'courseObj', 'teacherId'],
  // props: {
  //   // courseObj: Object,
  // },
  data() {
    return {
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
      showReportVisible: false, //是否显示实验报告
      showDetailsVisible: false, //是否显示成绩详情
      showEditVisible: false, //是否显示编辑框
      stuForm: {}, //学生成绩详情
      submitStatus: '', //学生实验提交状态
      studentScore: '', //学生实验成绩
    };
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
        // 实验内容
        getExperimentContent(data.id).then((res) => {
          this.experimentContent = res.data;
        });
        // 实验操作 获取登录用户名与密码
        const name = localStorage.getItem('hostName');
        this.form.name = name === 'null' ? '' : name;
        const pwd = localStorage.getItem('hostPwd');
        this.form.pwd = pwd === 'null' ? '' : pwd;
        this.$refs.experiment.style.display = 'block';
        // 下载实验模版
        this.$refs.downLoadTemplate.href = data.fileUrl;
        // 通知父组件的事件
        this.treeEvent && this.treeEvent(data.id);
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
    // 新窗口打开
    openNewWindow() {
      // this.$refs.newWindow.href = 'https://123.60.85.111:4200/';
      window.open('https://ovirt.yt.com/ovirt-engine/web-ui/?locale=zh_CN');
    },
  },
  async created() {
    this.roleId = localStorage.getItem('roleId');
    this.courseId = this.$route.query.courseId;
    // 获取树形数据
    const res = await getTreeData(this.courseId);
    const dataList = res.data;
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
    this.loadingGlobal = false;
  },
};
</script>

<style scoped>
.content-height {
  min-height: 100vh;
}
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
.block {
  text-align: center;
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
