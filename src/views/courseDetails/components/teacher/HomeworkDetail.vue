<template>
  <el-dialog
    :visible="visible"
    :title="(formData.id ? '编辑' : '新增') + '作业'"
    width="30%"
    :before-close="cancel"
    :close-on-click-modal="false"
    center
  >
    <el-form :model="formData" ref="homeworkForm" :rules="rules" label-width="80px">
      <el-form-item label="作业名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入作业名称"></el-input>
      </el-form-item>
      <el-form-item label="课程类型" v-if="formData.id">
        <el-input disabled :value="formData.custom ? '老师' : '系统'" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="作业内容" prop="content">
        <el-input v-model="formData.content" placeholder="请输入作业内容" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="参考答案" prop="answer">
        <el-input v-model="formData.answer" placeholder="请输入参考答案" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <el-form-item label="截止时间" prop="endTime">
        <el-date-picker v-model="formData.endTime" type="datetime" placeholder="请选择作业截至时间"> </el-date-picker>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button type="info" @click="cancel">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import dayjs from 'dayjs';
import { teaAddHomeworkService, teaEditHomeworkService } from '@/api/homework.js';
import { isAfterNow } from '@/utils/date.js';
export default {
  props: ['visible', 'editData', 'articleId'],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入作业名称', trigger: 'blur' }],
        content: [{ required: true, message: '请输入作业内容', trigger: 'blur' }],
        answer: [{ required: true, message: '请输入作业参考答案', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择作业截止日期', trigger: 'blur' }],
      },
      formData: {},
    };
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false);
    },
    submit() {
      if (!isAfterNow(this.formData.endTime)) return this.$message.warning('截止日期至少在当前时间半小时之后');
      this.$refs.homeworkForm.validate(async (validate) => {
        if (validate) {
          const endTime = dayjs(this.formData.endTime).format('YYYY-MM-DD HH:mm:ss');
          const data = {
            ...this.formData,
            endTime,
            articleId: this.articleId,
            teacherCourseId: this.$route.query.id,
          };
          // 编辑
          if (data.id) {
            await teaEditHomeworkService(data);
            this.$message.success('修改作业成功');
          } else {
            // 新增
            await teaAddHomeworkService(data);
            this.$message.success('添加作业成功');
          }
          await this.$emit('success');
          this.cancel();
        }
      });
    },
  },
  watch: {
    editData(newVal) {
      this.formData = JSON.parse(JSON.stringify(newVal));
    },
  },
  mounted() {
    this.editData && (this.formData = JSON.parse(JSON.stringify(this.editData)));
  },
};
</script>

<style></style>
