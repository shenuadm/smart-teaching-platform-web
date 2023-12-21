<template>
  <div class="homework-management">
    <div class="header mb-20">
      <el-button type="primary" size="small" @click="addexper">添加作业</el-button>
      <el-button type="danger" size="small" @click="delexper">批量删除</el-button>
      <el-button type="primary" size="small" @click="returnexper">返回章节</el-button>
    </div>
    <el-table
      ref="multipleTable"
      height="410"
      v-loading="$store.state.isLoading"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
      class="custom-table">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="name" label="作业名称" width="200"></el-table-column>
      <el-table-column prop="content" label="作业内容"></el-table-column>
      <el-table-column prop="answer" label="参考答案"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <div v-if="scope.row.status" class="user">启用</div>
          <div v-else class="forbidden">禁用</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="editexrept(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑作业 -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      :title="revise.id ? '修改作业' : '添加作业'"
      :before-close="closeDialog"
      :close-on-click-modal="false">
      <el-form :model="revise" :rules="rules" ref="formModel" label-width="80px" style="text-align: initial">
        <el-form-item label="作业名称" prop="name">
          <el-input placeholder="请输入作业名称" v-model="revise.name"> </el-input>
        </el-form-item>
        <el-form-item label="作业内容" prop="content">
          <el-input placeholder="请输入作业内容" v-model="revise.content" type="textarea" :rows="4"> </el-input>
        </el-form-item>
        <el-form-item label="参考答案" prop="answer">
          <el-input placeholder="请输入参考答案" v-model="revise.answer" type="textarea" :rows="4"> </el-input>
        </el-form-item>
        <el-form-item label="状态" class="form-status" required>
          <el-radio-group v-model="revise.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="serve" type="primary">确认</el-button>
        <el-button size="small" @click="closeDialog">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { addHomeWork, editHomeWork, delHomeWork, delAllHomeWork } from '@/utils/api';
import { getHomeWorkListService } from '@/api/homework.js';

const defaultData = {
  name: '',
  content: '',
  answer: '',
  status: 0,
};

export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      idArr: [],
      revise: { ...defaultData },
      rules: {
        name: { required: true, message: '课程名称不能为空', trigger: 'blur' },
        content: {
          required: true,
          message: '课程内容不能为空',
          trigger: 'blur',
        },
        answer: {
          required: true,
          message: '参考答案不能为空',
          trigger: 'blur',
        },
      },
    };
  },
  methods: {
    // 关闭弹框
    closeDialog() {
      this.dialogVisible = false;
      this.$refs['formModel'].resetFields();
    },
    // 添加作业
    addexper() {
      this.revise = { ...defaultData };
      this.dialogVisible = true;
    },
    // 编辑作业
    editexrept(data) {
      this.revise = JSON.parse(JSON.stringify(data));
      this.dialogVisible = true;
    },
    // 保存
    serve() {
      this.$refs['formModel'].validate(async (valid) => {
        if (valid) {
          if (!this.revise.id) {
            // 添加作业
            const data = { articleId: this.$route.query.id, ...this.revise };
            await addHomeWork(data);
            this.$message.success('作业添加成功');
          } else {
            // 编辑作业
            await editHomeWork(this.revise);
            this.$message.success('作业修改成功');
          }
          this.getDataList();
          this.dialogVisible = false;
        }
      });
    },
    // 删除
    del(id) {
      this.$confirm('您确认要删除该作业吗?', '提示', { type: 'warning' })
        .then(async () => {
          await delHomeWork(id);
          this.$message.success('删除作业成功');
          this.getDataList();
        })
        .catch(() => {});
    },
    //批量删除
    delexper() {
      this.$confirm('您确认要删除选中的作业吗', '提示', { type: 'warning' })
        .then(async () => {
          await delAllHomeWork(this.idArr);
          this.$message.success('删除作业成功');
          this.getDataList();
        })
        .catch(() => {});
    },
    //返回章节
    returnexper() {
      history.back();
    },
    handleSelectionChange(val) {
      this.idArr = val.map((item) => item.id);
    },
    // 获取数据
    async getDataList() {
      const res = await getHomeWorkListService(this.$route.query.id);
      this.tableData = res.data;
    },
  },
  created() {
    this.getDataList();
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
}

.form-status {
  margin-bottom: 10px;
}
</style>
