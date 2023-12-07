<template>
  <el-dialog
    :close-on-click-modal="false"
    title="编辑课程"
    :visible="dialogVisible"
    :before-close="closeDialog"
    width="40%"
  >
    <el-form ref="ruleForm" :model="editCourse" :rules="rules" label-width="100px" v-loading="$store.state.isLoading">
      <!-- 课程名称 -->
      <el-form-item label="课程名称：" prop="name">
        <el-input v-model="editCourse.name" placeholder="课程名称"></el-input>
      </el-form-item>
      <!-- 选课日期 -->
      <el-form-item label="选课日期：" class="date-picker" prop="selectDate">
        <el-date-picker
          v-model="editCourse.selectDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <!-- 最多选课人数 -->
      <el-form-item label="选课人数：" prop="maxTaker">
        <el-input v-model="editCourse.maxTaker" placeholder="课程最大人数"></el-input>
      </el-form-item>
      <!-- 授课地点 -->
      <el-form-item label="授课地点：" prop="address" class="course-address">
        <el-input v-model="editCourse.address" placeholder="授课地点"></el-input>
      </el-form-item>
      <!-- 授课日期 -->
      <el-form-item label="授课日期：" class="date-picker" prop="date">
        <el-date-picker
          v-model="editCourse.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <!-- 课程状态 -->
      <el-form-item label="课程状态：" prop="status">
        <el-radio-group v-model="editCourse.status">
          <!-- <el-radio disabled label="选课中">选课中</el-radio>
            <el-radio disabled label="选课结束">选课结束</el-radio>
            <el-radio disabled label="授课中">授课中</el-radio>
            <el-radio disabled label="评阅中">评阅中</el-radio>-->
          <el-radio
            v-for="item in teacherCourseStatus"
            :key="item[0]"
            :label="item[0]"
            :disabled="[2, 3, 4, 5].includes(item[0])"
            >{{ item[1] }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="submitForm">确认</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { teacherCourseStatus } from '@/constant/course.js';

export default {
  data() {
    return {
      // 表单校验
      rules: {
        name: [{ required: true, message: '请输入您的课程名称', trigger: 'blur' }],
        selectDate: [{ required: true, message: '请选择您课程的选课时间', trigger: 'blur' }],
        maxTaker: [{ required: true, message: '请输入您的最多选课人数', trigger: 'blur' }],
        address: [{ required: true, message: '请输入您的授课地点', trigger: 'blur' }],
        date: [{ required: true, message: '请选择您的授课时间', trigger: 'blur' }],
        status: [{ required: true, message: '请选择您的课程状态', trigger: 'blur' }],
      },
      teacherCourseStatus, // 课程状态
      editCourse: {}, // 编辑数据
    };
  },
  props: ['dialogVisible', 'formDate'],
  methods: {
    //保存修改
    submitForm() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          console.log(this.editCourse);
        }
      });
    },
    // 关闭弹框
    closeDialog() {
      this.$emit('update:dialogVisible', false);
    },
  },
  watch: {
    formDate() {
      this.editCourse = this.formDate;
    },
  },
};
</script>

<style scoped>
.el-radio-group {
  display: flex;
  flex-wrap: wrap;
}
.el-radio-group label {
  margin: 10px 20px 10px 0;
}
</style>
