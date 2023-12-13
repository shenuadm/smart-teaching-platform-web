<template>
  <el-dialog
    title="选择授课"
    :close-on-click-modal="false"
    :visible="visible"
    :before-close="cancel"
    width="40%"
    class="choose-teaching-dia"
  >
    <el-form ref="ruleForm" :model="editCourse" :rules="rules" label-width="100px">
      <!-- 课程名称 -->
      <el-form-item label="课程名称：" prop="title">
        <el-input v-model="editCourse.title" placeholder="课程名称" disabled></el-input>
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
      <!-- 最多选课人数 -->
      <el-form-item label="选课人数：" prop="maxTaker">
        <el-input v-model="editCourse.maxTaker" placeholder="课程最大人数"></el-input>
      </el-form-item>
      <!-- 授课地点 -->
      <el-form-item label="授课地点：" prop="address">
        <el-input v-model="editCourse.address" placeholder="授课地点"></el-input>
      </el-form-item>
      <!-- 授课班级： -->
      <el-form-item label="授课专业/年级/班级：">
        <el-cascader v-model="test" :options="options" :props="props" ref="cascader"></el-cascader>
      </el-form-item>
      <!-- 课程状态 -->
      <el-form-item label="课程状态：" prop="status">
        <el-radio-group v-model="editCourse.status">
          <el-radio :label="0">未启用</el-radio>
          <el-radio :label="1">已启用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button type="info" @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { teaChooseCourseService } from '@/api/course.js';
import { getLearService } from '@/api/systemSetting.js';

const defaultData = {
  selectDate: [], // 选课时间
  maxTaker: '', // 选课人数
  address: '', // 上课地点
  date: [], // 上课时间
  status: 0, // 状态
};
export default {
  data() {
    return {
      editCourse: { ...defaultData }, // 表单显示数据
      rules: {
        title: [{ required: true, message: '请输入您的课程名称', trigger: 'blur' }],
        selectDate: [{ required: true, message: '请选择您课程的选课时间', trigger: 'blur' }],
        maxTaker: [{ required: true, message: '请输入您的最多选课人数', trigger: 'blur' }],
        address: [{ required: true, message: '请输入您的授课地点', trigger: 'blur' }],
        date: [{ required: true, message: '请选择您的授课时间', trigger: 'blur' }],
        status: [{ required: true, message: '请选择您的课程状态', trigger: 'blur' }],
      },
      options: [], // 授课班级数据
      // 级联选择器配置
      props: {
        multiple: true, // 开启多选
        label: 'name', // 展示文字
        children: 'dataList', // 子级属性名
        value: 'id', // 绑定的属性值
      },
      test: '',
    };
  },
  props: ['visible', 'formData'],
  methods: {
    cancel() {
      this.$refs.ruleForm.clearValidate();
      this.$emit('update:visible', false);
    },
    //保存授课
    submitForm() {
      console.log(this.test);
      console.log(this.$refs.cascader.getCheckedNodes());
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const { selectDate, date } = this.editCourse;
          const data = {
            ...this.editCourse,
            startDate: date[0],
            endDate: date[1],
            selectStartDate: selectDate[0],
            selectEndDate: selectDate[1],
          };
          await teaChooseCourseService(data);
          this.$message.success('选择授课成功');
          this.cancel();
          this.$emit('success');
        }
      });
    },
    // 获取年级班级数据
    async getOptions() {
      const res = await getLearService();
      console.log(res);
      this.options = res.data;
    },
  },
  watch: {
    formData(newVal) {
      this.options.length === 0 && this.getOptions();
      this.editCourse = { ...defaultData, ...newVal };
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

<style>
/* 日期选择器靠左显示 */
.choose-teaching-dia .date-picker .el-form-item__content {
  text-align: initial !important;
}
/* 日期选择器输入框宽度跟随弹框宽度 */
.choose-teaching-dia .date-picker .el-form-item__content .el-date-editor {
  width: initial !important;
}
</style>
