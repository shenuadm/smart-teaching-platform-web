<template>
  <el-drawer
    :title="(editId ? '编辑' : '添加') + '实验步骤'"
    :visible="visible"
    :dircetion="'rtl'"
    :wrapperClosable="false"
    size="50%"
    :before-close="cancel">
    <el-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      label-position="top"
      v-loading="$store.state.isLoading"
      class="ml-20 text-initial">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入实验步骤名称"></el-input>
      </el-form-item>
      <el-form-item label="步骤顺序" prop="sort">
        <el-input type="number" v-model.number="formData.sort" placeholder="请输入实验顺序"></el-input>
      </el-form-item>
      <el-form-item label="步骤内容" class="dialog-form-editor" prop="content">
        <Editor ref="editor" v-if="visible"></Editor>
      </el-form-item>
      <el-form-item>
        <el-button @click="serve" type="primary">确认</el-button>
        <el-button @click="cancel" type="info">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { addstep, experplan, updatestep } from '@/utils/api';
import Editor from '@/components/editor.vue';

const defaultData = {
  // description: '',
  name: '',
  content: '',
  sort: '',
  // imageStorePath: '',
};
export default {
  data() {
    const editContent = (rule, value, callback) => {
      if (value === '<p><br></p>' || value === '') {
        callback(new Error('请输入实验步骤内容'));
      } else {
        callback();
      }
    };
    return {
      formData: {},
      rules: {
        name: [{ required: true, message: '请输入实验步骤名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入实验步骤顺序', trigger: 'blur' }],
        content: [
          { validator: editContent, trigger: 'blur' },
          { required: true, message: '请输入实验步骤内容', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    // 取消
    cancel() {
      this.$emit('update:editId', '');
      this.$emit('update:visible', false);
      this.$refs.editor.clearContent();
      this.$refs.formRef.resetFields();
    },
    serve() {
      this.formData.content = this.$refs.editor.html;
      console.log(this.$refs.editor.html, 1);
      this.$refs.formRef.validate(async (validate) => {
        if (validate) {
          if (this.formData.id) {
            await updatestep(this.formData);
            this.$message.success('编辑实验步骤成功');
          } else {
            await addstep(this.formData);
            this.$message.success('新增实验步骤成功');
          }
          this.cancel();
          this.$emit('success');
        }
      });
    },
  },
  props: ['visible', 'editId'],
  watch: {
    async editId(newVal) {
      if (newVal) {
        const { data } = await experplan(newVal);
        this.formData = data;
        this.$nextTick(() => {
          this.$refs.editor.setContent(data.content);
        });
      } else {
        this.formData = { ...defaultData, experimentReportId: this.$route.query.id };
        this.$refs.editor.setContent('');
      }
    },
  },
  mounted() {
    this.formData = { ...defaultData, experimentReportId: this.$route.query.id };
  },
  components: {
    Editor,
  },
};
</script>

<style scoped></style>
