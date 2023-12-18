<template>
  <div class="Step">
    <div class="header mb-20">
      <el-button type="primary" class="step" @click="addstep">添加步骤</el-button>
      <el-button type="primary" class="step" @click="returnstep">返回实验报告</el-button>
      <el-button type="danger" class="step" @click="delstep">批量删除</el-button>
    </div>
    <el-table
      height="410"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      class="custom-table"
      border
      v-loading="$store.state.isLoading">
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="步骤名称" width="550"> </el-table-column>
      <el-table-column prop="sort" label="顺序" width="100"> </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editstep(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑实验 -->
    <LaboratoryStepEdit :visible.sync="visible" :id.sync="editId" @success="getData"></LaboratoryStepEdit>
  </div>
</template>

<script>
import { step, mdelstep, delstep } from '@/utils/api';
import LaboratoryStepEdit from './components/LaboratoryStepEdit.vue';

export default {
  components: { LaboratoryStepEdit },
  data() {
    return {
      tableData: [],
      arr: [], // 批量删除
      visible: false,
      editId: '',
    };
  },
  methods: {
    //返回实验报告
    returnstep() {
      history.back();
    },
    //添加实验步骤
    addstep() {
      this.editId = '';
      this.visible = true;
    },
    //编辑实验步骤
    async editstep({ id }) {
      this.editId = id;
      this.visible = true;
    },
    //删除
    del(e) {
      this.$confirm('此操作将永久删除该实验步骤, 是否继续?', '提示', { type: 'warning' })
        .then(async () => {
          await delstep(e);
          this.$message.success('删除实验步骤成功');
          await this.getData();
        })
        .catch(() => {});
    },
    //批量删除
    delstep() {
      this.$confirm('此操作将永久删除选中的实验步骤, 是否继续?', '提示', { type: 'warning' })
        .then(async () => {
          await mdelstep(this.arr);
          this.$message.success('删除实验步骤成功');
          await this.getData();
        })
        .catch(() => {});
    },
    handleSelectionChange(val) {
      this.arr = val.map((item) => item.id);
    },
    // 获取数据
    async getData() {
      const res = await step(this.$route.query.id);
      this.tableData = res.data;
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}
.Step .step {
  position: relative;
  margin-left: 5px;
  text-align: center;
  line-height: 7px;
}
.Step .dec {
  width: 105px;
  height: 40px;
  margin-top: 10px;
  margin-left: 54px;
  border: 1px solid #dcdfe6;
  line-height: 40px;
  color: #909399;
}
.Step span {
  position: relative;
  left: -100px;
}
.Step .editor {
  position: relative;
  width: 444px;
  top: 10px;
  left: 84px;
}
.Step .box > p {
  text-align: left;
}
.Step .stepcontent {
  width: 102px;
  height: 38px;
  border: 1px solid #dcdfe6;
  color: #909399;
  background-color: #f5f7fa;
  text-align: center;
  line-height: 38px;
  margin-left: 84px;
  margin-top: 10px;
  border-radius: 4px;
}
.Step .inputshow {
  display: none;
}
</style>
<style>
.Step #inputh {
  height: 30px !important;
}
</style>
