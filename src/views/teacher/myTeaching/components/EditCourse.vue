<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="editCourse.id ? '编辑课程' : '选择授课'"
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
      <!-- 授课班级： -->
      <el-form-item label="授课班级：">
        <el-cascader
          :options="options"
          :props="props"
          v-model="editCourse.treeChoose"
          placeholder="请选择您要授课的专业/年级/班级"
        ></el-cascader>
      </el-form-item>
      <!-- 课程状态 -->
      <el-form-item label="课程状态：" prop="status">
        <el-radio-group v-model="editCourse.status">
          <template v-if="editCourse.id">
            <el-radio v-for="item in teacherCourseStatus" :key="item[0]" :label="item[0]">{{ item[1] }}</el-radio>
          </template>
          <template v-else>
            <el-radio :label="0">未启用</el-radio>
            <el-radio :label="1">已启用</el-radio>
          </template>
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
import { teaUpdateCourseService } from '@/api/course';
import { teaChooseCourseService } from '@/api/course.js';
import { getActiveLearService, getChooseLearService } from '@/api/systemSetting.js';

const defaultData = {
  selectDate: [], // 选课时间
  maxTaker: '', // 选课人数
  address: '', // 上课地点
  date: [], // 上课时间
  status: 0, // 状态
  treeChoose: [], // 选择的授课班级
};

export default {
  data() {
    const date = (rule, value, callback) => {
      if (new Date(this.selectDate[1]) > new Date(value[1])) {
        callback(new Error('授课结束时间不应在选课结束时间之前'));
      } else {
        callback();
      }
    };
    return {
      // 表单校验
      rules: {
        name: [{ required: true, message: '请输入您的课程名称', trigger: 'blur' }],
        selectDate: [{ required: true, message: '请选择您课程的选课时间', trigger: 'blur' }],
        maxTaker: [{ required: true, message: '请输入您的最多选课人数', trigger: 'blur' }],
        address: [{ required: true, message: '请输入您的授课地点', trigger: 'blur' }],
        date: [
          { required: true, message: '请选择您的授课时间', trigger: 'blur' },
          { validator: date, trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择您的课程状态', trigger: 'blur' }],
      },
      teacherCourseStatus, // 课程状态
      editCourse: { ...defaultData }, // 编辑数据
      options: [], // 授课班级数据
      // 级联选择器配置
      props: {
        multiple: true, // 开启多选
        label: 'name', // 展示文字
        children: 'children', // 子级属性名
        value: 'id', // 绑定的属性值
      },
    };
  },
  props: ['dialogVisible', 'formData'],
  methods: {
    //保存修改
    submitForm() {
      this.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          const { date, selectDate, treeChoose } = this.editCourse;
          let selectedIds = [];
          treeChoose.forEach((item) => (selectedIds = [...selectedIds, ...item]));
          selectedIds = Array.from(new Set([...selectedIds]));
          const data = {
            ...this.editCourse,
            startDate: date[0],
            endDate: date[1],
            selectStartDate: selectDate[0],
            selectEndDate: selectDate[1],
            selectedIds,
          };
          if (data.id) {
            await teaUpdateCourseService(data);
            this.$message.success('编辑课程成功');
          } else {
            await teaChooseCourseService(data);
            this.$message.success('选择授课成功');
          }
          this.closeDialog();
          this.$emit('success');
        }
      });
    },
    // 关闭弹框
    closeDialog() {
      this.$emit('update:dialogVisible', false);
    },
    // 获取年级班级数据
    async getOptions() {
      let res;
      console.log(this.formData);
      if (this.formData.id) {
        res = await getChooseLearService(this.formData.id);
        console.log(res);
      } else {
        res = await getActiveLearService();
      }
      this.options = res.data;
    },
  },
  watch: {
    // 传入的数据变化，赋值给编辑表单
    formData(newVal) {
      // 获取编辑的选择班级信息
      console.log(this.editCourse, !!this.editCourse.id);
      if (newVal.id) {
        this.getOptions();
      } else if (!newVal.id && this.options.length === 0) {
        // 获取选择授课的班级信息
        this.getOptions();
      }
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
.el-cascader {
  width: 100%;
}
</style>
