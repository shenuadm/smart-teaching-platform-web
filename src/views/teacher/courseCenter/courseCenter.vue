<template>
  <div class="global-container" v-loading="$store.state.isLoading">
    <!-- 标题 -->
    <div class="person-title">课程中心</div>
    <!-- 内容 -->
    <!-- 搜索框 -->
    <div class="course-search zh-pd-10">
      <span>课程名称：</span>
      <input v-model="search" placeholder="请输入课程名称" />
      <el-button type="primary" size="small">搜索</el-button>
      <el-button type="primary" size="small">重置</el-button>
    </div>
    <!-- 每一项数据 -->
    <div class="course-center mt-20">
      <div class="course-center-item mt-20" v-for="item in courseList" :key="item.id">
        <!-- <img src="@/assets/169681739455410.jpg" alt="课程logo图片" /> -->
        <img :src="'data:image/png;base64,' + item.picture" alt="课程logo图片" />
        <div class="course-center-text">
          <div class="course-name">课程名称：{{ item.name }}</div>
          <div class="course-title">课程标题：{{ item.title }}</div>
          <div class="course-score">学分：{{ item.credit }}</div>
          <el-popover placement="bottom" width="400" trigger="hover" :content="item.description">
            <p slot="reference" class="course-describe">课程描述：{{ item.description }}</p>
          </el-popover>
        </div>
        <div class="course-center-btn">
          <button class="edit btn-bg-b" @click="toChapterDetails(item)">查看章节</button>
          <button class="detail btn-bg-b" @click="editCourseClick(item)">选择授课</button>
        </div>
      </div>
      <!-- 编辑框 -->
      <el-dialog title="选择授课" :visible.sync="dialogVisible">
        <el-form ref="ruleForm" :model="editCourse" :rules="rules" label-width="100px">
          <!-- 课程名称 -->
          <el-form-item label="课程名称：" prop="title">
            <el-input v-model="editCourse.title" placeholder="课程名称" disabled></el-input>
          </el-form-item>
          <!-- 选课日期 -->
          <div class="choose-date">
            <el-form-item label="选课日期：" prop="selectStartDate">
              <el-date-picker
                type="date"
                placeholder="选课开始日期"
                v-model="editCourse.selectStartDate"
              ></el-date-picker>
            </el-form-item>
            <span>——</span>
            <el-form-item prop="selectEndDate" class="end-date">
              <el-date-picker
                type="date"
                placeholder="选课结束日期"
                v-model="editCourse.selectEndDate"
              ></el-date-picker>
            </el-form-item>
          </div>
          <!-- 授课日期 -->
          <div class="choose-date">
            <el-form-item label="授课日期：" prop="startDate">
              <el-date-picker type="date" placeholder="授课开始日期" v-model="editCourse.startDate"></el-date-picker>
            </el-form-item>
            <span>——</span>
            <el-form-item prop="endDate" class="end-date">
              <el-date-picker type="date" placeholder="授课结束日期" v-model="editCourse.endDate"></el-date-picker>
            </el-form-item>
          </div>
          <div class="input-small">
            <!-- 最多选课人数 -->
            <el-form-item label="最多选课人数：" prop="maxTaker" class="more-person" label-width="127px">
              <el-input v-model="editCourse.maxTaker" placeholder="课程最大人数"></el-input>
            </el-form-item>
            <!-- 授课地点 -->
            <el-form-item label="授课地点：" prop="address" class="course-address">
              <el-input v-model="editCourse.address" placeholder="授课地点"></el-input>
            </el-form-item>
          </div>
          <!-- 课程状态 -->
          <el-form-item label="课程状态：">
            <el-radio-group v-model="editCourse.status">
              <el-radio :label="0">未启用</el-radio>
              <el-radio :label="1">已启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 确认/取消 -->
          <el-form-item class="end-date">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import adapter from './adapter.js';
import { courseCenter, saveCourse } from '@/utils/api.js';
export default {
  data() {
    return {
      ...adapter.data,
      courseList: [],
      // 表单校验
      rules: {
        name: [{ required: true, message: '请输入您的课程名称', trigger: 'blur' }],
        chooseStartDate: [
          {
            required: true,
            message: '请选择您的选课开始日期',
            trigger: 'blur',
          },
        ],
        chooseEndDate: [
          {
            required: true,
            message: '请选择您的选课结束日期',
            trigger: 'blur',
          },
        ],
        mostPersonCount: [
          {
            required: true,
            message: '请输入您的最多选课人数',
            trigger: 'blur',
          },
        ],
        coursePlace: [{ required: true, message: '请输入您的授课地点', trigger: 'blur' }],
        courseStartDate: [
          {
            required: true,
            message: '请选择您的授课开始日期',
            trigger: 'blur',
          },
        ],
        courseEndDate: [
          {
            required: true,
            message: '请选择您的授课结束日期',
            trigger: 'blur',
          },
        ],
      },
      courseId: '', //选择授课的课程id
    };
  },
  created() {
    courseCenter().then((res) => {
      this.courseList = res.data.map((item) => {
        let picture = item.picture.split(',')[1];
        return { ...item, picture };
      });
    });
  },
  methods: {
    ...adapter.methods,
  },
};
</script>

<style scoped>
/* 标题 */
.person-title {
  height: 60px;
  line-height: 60px;
  padding: 0 50px;
  text-align: left;
  font-size: 20px;
  border-bottom: 2px solid #efefef;
  background-color: #fff;
}
/* 搜索框 */
.course-search {
  display: flex;
  align-items: center;
  background-color: #fff;
}
.course-search input {
  padding: 0 10px;
  height: 33px;
  border: 1px solid #ccc;
  outline: none;
}
.course-search input::placeholder {
  color: #ccc;
}
.course-search button {
  margin-left: 10px;
  width: 82px;
  height: 33px;
  border: none;
  border-radius: 3px;
  transition: all 0.3s;
  color: #fff;
  cursor: pointer;
}
/* 每一项数据 */
.course-center-item {
  display: flex;
  align-items: center;
  border: 1px solid #ededed;
  background-color: #fff;
  border-radius: 15px;
}
.course-center-item img {
  padding: 10px;
  width: 220px;
  height: 120px;
  cursor: pointer;
}
.course-center-item .el-checkbox {
  width: 20px;
  margin-left: 5px;
}
.course-center-text {
  flex: 1;
  padding: 20px;
  text-align: left;
  font-size: 15px;
  color: #666;
}
.course-name {
  font-weight: 700;
  font-size: 16px;
  color: #000;
}
.course-describe {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 将文本限制为两行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* 显示省略号 */
  font-size: 14px;
  cursor: pointer;
}
.course-center-btn {
  padding: 20px;
  display: flex;
  align-items: center;
  transform: translateY(20px);
}
.course-center-btn button {
  margin-left: 10px;
  width: 82px;
  height: 33px;
  border: none;
  border-radius: 3px;
  transition: all 0.3s;
  color: #fff;
  cursor: pointer;
}
.course-search button,
.course-center-btn button:hover {
  box-shadow: 0 2px 5px #ccc;
}
.choose-date {
  display: flex;
}
.choose-date span {
  padding: 0 38px;
  padding-top: 10px;
}
.input-small {
  display: flex;
}
.more-person {
  width: 320px;
}
.el-radio-group {
  display: flex;
  flex-wrap: wrap;
}
.el-radio-group label {
  margin: 10px 0;
  margin-right: 20px;
}
.el-form-item .el-button--default {
  margin-left: 30px;
}
.el-form .el-form-item {
  width: 645px;
}
</style>
<style>
.course-center .end-date .el-form-item__content {
  margin-left: 0 !important;
}
</style>
