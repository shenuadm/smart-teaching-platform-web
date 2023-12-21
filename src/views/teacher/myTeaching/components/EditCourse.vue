<!--suppress CssUnusedSymbol, CssUnusedSymbol -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="editCourse.id ? '编辑课程' : '选择授课'"
    :visible="dialogVisible"
    :before-close="closeDialog"
    width="40%"
    class="edit-course">
    <el-form ref="ruleForm" :model="editCourse" :rules="rules" label-width="100px" v-loading="$store.state.isLoading">
      <!-- 课程名称 -->
      <el-form-item label="课程名称：" prop="name">
        <el-input v-if="editCourse.id" disabled v-model="editCourse.name" placeholder="请输入课程名称"></el-input>
        <el-input v-else disabled v-model="editCourse.title" placeholder="课程名称"></el-input>
      </el-form-item>
      <el-form-item label="课程类型：" prop="type">
        <el-radio-group v-model="editCourse.type" :disabled="courseStatus >= 4">
          <el-radio :label="0">选修</el-radio>
          <el-radio :label="1">必修</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="!editCourse.type">
        <!-- 选课日期 -->
        <el-form-item label="选课日期：" class="date-picker" prop="selectDate">
          <el-date-picker
            v-model="editCourse.selectDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!-- 最多选课人数 -->
        <el-form-item label="选课人数：" prop="maxTaker">
          <el-input v-model="editCourse.maxTaker" placeholder="请输入课程最大人数"></el-input>
        </el-form-item>
      </template>
      <!-- 授课地点 -->
      <el-form-item label="授课地点：" prop="address" class="course-address">
        <el-input v-model="editCourse.address" placeholder="请输入授课地点"></el-input>
      </el-form-item>
      <!-- 授课日期 -->
      <el-form-item label="授课日期：" class="date-picker" prop="date">
        <el-date-picker
          v-model="editCourse.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <!-- 授课班级： -->
      <el-form-item label="授课班级：">
        <el-cascader
          :options="options"
          :props="props"
          v-model="editCourse.treeChoose"
          placeholder="请选择您要授课的专业/年级/班级"></el-cascader>
      </el-form-item>
      <!-- 课程状态 -->
      <el-form-item label="课程状态：" prop="status">
        <el-radio-group v-model="editCourse.status">
          <template v-if="editCourse.id">
            <el-radio
              v-for="item in teacherCourseStatus"
              :disabled="courseStatusCanChoose(item[0])"
              v-if="!(editCourse.type && [2, 3].includes(item[0]))"
              :key="item[0]"
              :label="item[0]"
              >{{ item[1] }}</el-radio
            >
          </template>
          <template v-else>
            <el-radio :label="0">未启用</el-radio>
            <el-radio :label="1">已启用</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">确认</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { teacherCourseStatus } from '@/constant/course.js';
import { teaChooseCourseService, teaUpdateCourseService } from '@/api/course.js';
import { getActiveLearService, getChooseLearService } from '@/api/systemSetting.js';

const defaultData = {
  selectDate: [], // 选课时间
  maxTaker: '', // 选课人数
  address: '', // 上课地点
  date: [], // 上课时间
  status: 0, // 状态
  treeChoose: [], // 选择的授课班级
  type: 0, // 课程类型 0:选修,1:必修
};

export default {
  data() {
    const date = (rule, value, callback) => {
      if (new Date(this.editCourse.selectDate[1]) > new Date(value[0])) {
        callback(new Error('选课结束时间不应在授课开始时间后'));
      } else {
        callback();
      }
    };
    return {
      // 表单校验
      rules: {
        selectDate: [{ required: true, message: '请选择您课程的选课时间', trigger: 'blur' }],
        maxTaker: [{ required: true, message: '请输入您的最多选课人数', trigger: 'blur' }],
        address: [{ required: true, message: '请输入您的授课地点', trigger: 'blur' }],
        date: [
          { required: true, message: '请选择您的授课时间', trigger: 'blur' },
          { validator: date, trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择您的课程状态', trigger: 'blur' }],
        type: [{ required: true, message: '请选择课程类型', trigger: 'blur' }],
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
      courseStatus: 0,
    };
  },
  props: ['dialogVisible', 'formData'],
  methods: {
    //保存修改
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.editCourse.status === 4) {
            this.$confirm('将课程状态修改为授课中后，就不能修改为授课中之间的课程状态，您确认要修改吗?', '提示', {
              type: 'warning',
            })
              .then(() => this.publish())
              .catch(() => {});
          } else {
            this.publish();
          }
        }
      });
    },
    // 提交服务器
    async publish() {
      const { date, selectDate, treeChoose } = this.editCourse;
      // 获取选中的级联id
      const selectedIds = Array.from(new Set([...treeChoose.reduce((acc, item) => acc.concat(item), [])]));
      const data = {
        ...this.editCourse,
        startDate: date[0],
        endDate: date[1],
        selectStartDate: selectDate[0],
        selectEndDate: selectDate[1],
        selectedIds,
      };
      const successMessage = data.id ? '编辑课程成功' : '选择授课成功';
      // 必修课，删除选修相关数据
      if (data.type === 1) {
        delete data.selectStartDate;
        delete data.selectEndDate;
        delete data.maxTaker;
      }
      if (data.id) {
        await teaUpdateCourseService(data);
      } else {
        await teaChooseCourseService(data);
      }
      this.$message.success(successMessage);
      this.closeDialog();
      this.$emit('success');
    },
    // 关闭弹框
    closeDialog() {
      this.$refs.ruleForm.resetFields();
      this.$emit('update:dialogVisible', false);
    },
    // 获取年级班级数据
    async getOptions() {
      let res;
      // 编辑，转换为级联显示的数据
      if (this.formData.id) {
        res = await getChooseLearService(this.formData.id);
        const arr = [];
        const arrange = (major) => {
          major.children.forEach((item) => {
            if (item.checked && item.children === null) {
              // 不存在班级
              arr.push([major.id, item.id]);
            } else if (item.checked && item.children !== null) {
              item.children.forEach((clazz) => {
                clazz.checked && arr.push([major.id, item.id, clazz.id]);
              });
            }
          });
        };
        res.data.forEach((item) => {
          // 没有年级
          if (item.checked && item.children === null) {
            arr.push([item.id]);
          } else if (item.checked && item.children !== null) {
            // 存在年级。并且是选中状态
            arrange(item);
          }
        });
        this.editCourse.treeChoose = arr;
      } else {
        res = await getActiveLearService();
      }
      this.options = res.data;
    },
    // 判断课程状态是否可选
    courseStatusCanChoose(status) {
      return status < 4 && this.courseStatus >= 4;
    },
  },
  watch: {
    // 传入的数据变化，赋值给编辑表单
    formData(newVal) {
      if (newVal.id) {
        // 获取编辑的选择班级信息
        this.getOptions();
        newVal.type = +newVal.type;
        this.courseStatus = newVal.status;
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

<style>
/* 日期选择器靠左显示 */
.edit-course .date-picker .el-form-item__content {
  text-align: initial !important;
}
/* 日期选择器输入框宽度跟随弹框宽度 */
.edit-course .date-picker .el-form-item__content .el-date-editor {
  width: initial !important;
}
</style>
