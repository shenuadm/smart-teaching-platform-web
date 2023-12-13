<template>
  <div class="course-list content-height bg-white radius-5" v-loading="$store.state.isLoading">
    <!-- 左侧树形结构 -->
    <div class="tree">
      <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick" :highlight-current="true">
        <span class="node-title" slot-scope="{ node }"> {{ node.data.index }}{{ node.data.title }} </span>
      </el-tree>
    </div>
    <div class="tree-content">
      <!-- 课件 -->
      <iframe v-if="showType === 1" src="" frameborder="0" class="courseWare iframe" ref="courseWare"></iframe>
      <!-- 实验报告 -->
      <div class="experimentReport" v-else-if="showType === 2">
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
              <a href="javascript:void(0)" ref="newWindow" class="bg-blue" @click="openNewWindow">访问实验机</a>
            </div>
          </el-tab-pane>
          <el-tab-pane label="实验报告" name="third" class="experiment-report">
            <!-- <div class="experiment-title">
              <p>【实验模板】</p>
              <a href="javascript:void(0)" ref="downLoadTemplate" class="experiment-link text-blue"
                >点击下载实验模板
              </a>
            </div> -->
            <!-- 实验内容插槽 -->
            <slot name="experiment"></slot>
          </el-tab-pane>
          <el-tab-pane label="实验成绩" name="fourth">
            <!-- 实验成绩插槽 -->
            <slot name="experimentAchement"></slot>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 作业 -->
      <TeacherHomework
        v-else-if="showType === 3 && $store.state.rolename === 'teacher'"
        :articleId="articleId"
      ></TeacherHomework>
      <StudentHomewrok
        v-else-if="showType === 3 && $store.state.rolename === 'student'"
        :articleId="articleId"
      ></StudentHomewrok>
    </div>
  </div>
</template>

<script>
import { getTreeData } from '@/utils/api.js';
import { getExperimentContentService } from '@/api/experiment.js';
import TeacherHomework from './teacher/TeacherHomework.vue';
import StudentHomewrok from './student/StudentHomewrok.vue';

export default {
  props: ['treeEvent', 'courseObj'],
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
      experimentContent: {}, //实验内容
      studentScore: '', //学生实验成绩
      showType: 0, // 展示的页面类型
      articleId: 0, // 节id
    };
  },
  methods: {
    // 树形控件的点击事件
    handleNodeClick({ treeType, id, fileUrl, articleId }) {
      this.showType = treeType;
      // 如果点击的是二级节点，显示课件
      this.$nextTick(async () => {
        if (treeType === 1) {
          this.$refs.courseWare.src = `${window.location.origin}/#/pdf?url=${fileUrl}`;
        } else if (treeType === 2) {
          // 获取实验内容
          const res = await getExperimentContentService(id);
          this.experimentContent = res.data;
          // 实验操作 获取登录用户名与密码
          const name = localStorage.getItem('hostName');
          this.form.name = name === 'null' ? '' : name;
          const pwd = localStorage.getItem('hostPwd');
          this.form.pwd = pwd === 'null' ? '' : pwd;
          // 通知父组件的树状结构事件
          this.treeEvent && this.treeEvent(id);
        }
      });
      // 查看作业
      if (treeType === 3) {
        this.articleId = articleId;
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
      // window.open('https://ovirt.yt.com/ovirt-engine/web-ui/?locale=zh_CN');
      window.open('https://engine443.com/ovirt-engine/web-ui/?locale=zh_CN');
    },
  },
  async created() {
    console.log(this.$route.path, 'path');
    // 获取树形数据
    const res = await getTreeData(this.$route.query.courseId);
    const dataList = res.data;
    // 添加每个节点添加index，方便填写序号,并添加对应的节点类型，0：一级节点，1：二级节点，3：三级节点-实验，4：三级节点-作业
    const data = dataList.map((node, index) => {
      // 一级节点
      node.treeType = 0;
      // 二级节点
      if (node.children != null) {
        node.children.forEach((cnode, index) => {
          // 三级节点
          cnode.treeType = 1;
          if (cnode.children != null) {
            cnode.children.forEach((pcode, index) => {
              if (pcode.children == null) {
                pcode.treeType = 2;
                pcode.index = `实验${index + 1} `;
              }
            });
            cnode.children.push({
              title: '查看作业',
              treeType: 3,
              articleId: cnode.id,
            });
          }
          cnode.pid !== '' && (cnode.index = `第${index + 1}节 `);
        });
      }
      node.pid == 0 && (node.index = `第${index + 1}章 `);
      return node;
    });
    console.log(data);
    this.data = data;
  },
  components: {
    TeacherHomework,
    StudentHomewrok,
  },
};
</script>

<style scoped>
.content-height {
  min-height: 100vh;
  /* width: 83vw !important; */
}
.course-list {
  border: 1px solid #dedede;
  box-sizing: border-box;
  display: flex;
  text-align: left;
  padding: 20px;
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

.experiment-report {
  position: relative;
}
</style>
