<!--suppress CssUnusedSymbol, CssUnusedSymbol -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="(formData.userid ? '编辑' : '新增') + '用户'"
    :visible="visible"
    :before-close="cancel"
    class="user-edit-dialog"
    custom-class="user-edit-dialog"
    width="30%">
    <el-form ref="formRef" :model="formData" label-width="140px" :rules="rules" class="user-edit-form">
      <el-form-item label="账号：" prop="account">
        <el-input v-model="formData.account" placeholder="请输入用户账号"></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户姓名"></el-input>
      </el-form-item>
      <el-form-item label="角色：" prop="roleId" class="roles">
        <el-select v-model="formData.roleId" placeholder="请选择角色">
          <el-option
            v-for="item in roleList"
            :key="item.roleid"
            :label="item.nickname"
            :value="item.roleid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户手机：" prop="phone">
        <el-input
          type="number"
          v-model.number="formData.phone"
          placeholder="请输入用户手机号"
          maxlength="11"></el-input>
      </el-form-item>
      <template v-if="isStudent">
        <el-form-item label="专业/年级/班级：" required prop="majorId">
          <el-cascader
            v-model="majorGradeClass"
            :options="majorData"
            @change="changeMajor"
            :props="{ label: 'name', children: 'children', value: 'id' }"></el-cascader>
        </el-form-item>
      </template>
      <el-form-item label="是否启用：" prop="active" class="active">
        <el-radio-group v-model="formData.active">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { addUser, reviseUser } from '@/utils/api';

const defaultData = {
  account: '',
  username: '',
  roleId: '',
  active: 0,
  majorId: 0,
  clazzId: 0,
  gradeId: 0,
  phone: '',
};

export default {
  data() {
    const userRule = (rules, value, callback) => {
      if (this.formData.roleId === '') return callback();
      if (
        this.roleList.find((item) => item.roleid === this.formData.roleId).rolename === 'student' &&
        (value === '' || value === null)
      ) {
        callback(new Error('学生角色请输入专业、年级、班级信息'));
      } else {
        callback();
      }
    };
    const phone = (rule, value, callback) => {
      const regex = /^1[3-9]\d{9}$/;
      if (this.formData.phone === '' || this.formData.phone === null) return callback();
      if (!regex.test(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      formData: { ...defaultData },
      rules: {
        account: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        active: [{ required: true, message: '请选择激活状态', trigger: 'change' }],
        phone: [{ validator: phone, trigger: 'submit' }],
        majorId: [{ validator: userRule }],
      },
      majorGradeClass: [], // 当前选择的专业年级班级
    };
  },
  methods: {
    cancel() {
      this.$refs.formRef.clearValidate();
      this.$emit('update:visible', false);
    },
    submit() {
      this.$refs.formRef.validate(async (validate) => {
        if (validate) {
          if (this.roleList.find((item) => item.roleid === this.formData.roleId).rolename !== 'student') {
            this.formData.majorId = '';
            this.formData.clazzId = '';
            this.formData.gradeId = '';
            this.formData.major = '';
            this.formData.clazz = '';
            this.formData.gradeId = '';
          }
          if (this.formData.userid) {
            await reviseUser(this.formData);
            this.$message.success('修改用户成功');
          } else {
            await addUser(this.formData);
            this.$message.success('添加用户成功');
          }
          this.cancel();
          this.$emit('success');
        }
      });
    },
    // 设置当前的专业年级班级
    changeMajor(val) {
      this.formData.majorId = val[0];
      val[1] && (this.formData.gradeId = val[1]);
      val[2] && (this.formData.clazzId = val[2]);
    },
  },
  computed: {
    isStudent() {
      // 用户当前没有选中
      if (this.formData.roleId === '' || this.formData.roleId === null) return false;
      const item = this.roleList.find((item) => item.roleid === this.formData.roleId);
      if (!item) return false;
      return item.rolename === 'student';
    },
  },
  props: ['visible', 'editData', 'roleList', 'majorData'],
  watch: {
    visible(newVal) {
      if (newVal) {
        const { majorId, gradeId, clazzId } = this.editData;
        this.majorGradeClass = [];
        majorId && this.majorGradeClass.push(majorId);
        gradeId && this.majorGradeClass.push(gradeId);
        clazzId && this.majorGradeClass.push(clazzId);
        this.formData = { ...defaultData, ...this.editData };
      }
    },
  },
};
</script>

<style>
/* 选择器靠左 */
.user-edit-form .el-form-item__content {
  text-align: initial;
}
/*弹框左侧内边距 */
.user-edit-dialog .el-dialog__body {
  padding-left: 0 !important;
}
.user-edit-dialog .el-cascader {
  width: 100%;
}
</style>
