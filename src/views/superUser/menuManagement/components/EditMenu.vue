<template>
  <el-dialog
    :visible="visible"
    width="30%"
    :close-on-click-modal="false"
    :before-close="cancel"
    :title="(formData.add ? '新增' : '修改') + '节点'">
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px" class="text-initial">
      <el-form-item label="显示名称" prop="title">
        <el-input v-model="formData.title" placeholder="请输入显示名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="formData.menuName" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="funurl">
        <el-input v-model="formData.funurl" placeholder="请输入菜单路径"></el-input>
      </el-form-item>
      <el-form-item label="菜单类型" prop="funtype">
        <el-select v-model="formData.funtype" placeholder="请输入菜单类型">
          <el-option v-for="item in menuType" :label="item[1]" :value="item[0]" :key="item[0]"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单排序" prop="sort">
        <el-input-number placeholder="请输入菜单排序" v-model="formData.sort" controls-position="right">
        </el-input-number>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input placeholder="请输入菜单图标的名称" v-model="formData.icon"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="small" type="primary" @click="confirmEdit">确 定</el-button>
      <el-button size="small" @click="cancel">取 消</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { menuType } from '@/constant/superUser';
import { addMenuService, updateMenuService } from '@/api/menu';

const defaultData = {
  title: '',
  menuName: '',
  funurl: '',
  funtype: '',
  sort: '',
  icon: '',
};
export default {
  data() {
    return {
      formData: { ...defaultData },
      rules: {
        title: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        icon: [{ required: false, message: '请输入菜单图标', trigger: 'blur' }],
        funurl: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }],
        funtype: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        sort: [{ required: true, message: '请选择菜单排序', trigger: 'blur' }],
      },
    };
  },
  props: ['visible', 'editData'],
  methods: {
    cancel() {
      this.$emit('update:visible', false);
      this.$refs.form.resetFields();
    },
    confirmEdit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.formData.add) {
            await addMenuService(this.formData);
          } else {
            await updateMenuService(this.formData);
          }
          this.$message.success((this.formData.add ? '新增' : '修改') + '节点成功');
          this.cancel();
          this.$emit('success');
        }
      });
    },
  },
  watch: {
    editData(newVal) {
      this.formData = { ...defaultData, ...newVal };
      console.log(newVal);
    },
  },
  computed: {
    menuType() {
      return menuType;
    },
  },
};
</script>

<style scoped></style>
