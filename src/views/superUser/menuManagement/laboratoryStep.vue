<template>
  <div class="Step">
    <div class="header">
      <div class="title">步骤名称:</div>
      <el-input
        style="display: initial; width: initial"
        v-model="input"
        id="inputh"
        placeholder="请输入步骤名称"
      ></el-input>
      <el-button type="primary" class="step" @click="search">搜索</el-button>
      <el-button type="primary" class="step" @click="resetting">重置</el-button>
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
      v-loading="$store.state.isLoading"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="name" label="步骤名称" width="550"> </el-table-column>
      <el-table-column prop="sort" label="顺序" width="100"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editstep(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加/编辑实验 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="40%"
      :title="(revise.id ? '编辑' : '添加') + '实验步骤'"
    >
      <el-form
        :model="revise"
        class="step-form"
        label-width="100px"
        ref="stepForm"
        :rules="stepRule"
        v-loading="$store.state.isLoading"
      >
        <el-form-item label="步骤名称" prop="name">
          <el-input v-model="revise.name" placeholder="请输入实验步骤名称"></el-input>
        </el-form-item>
        <el-form-item label="步骤顺序" prop="sort">
          <el-input type="number" v-model.number="revise.sort" placeholder="请输入实验顺序"></el-input>
        </el-form-item>
        <el-form-item label="步骤内容" prop="content">
          <Editor ref="editor"></Editor>
        </el-form-item>
        <el-form-item>
          <el-button @click="serve" type="primary">确认</el-button>
          <el-button @click="cancel" type="info">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { step, addstep, updatestep, mdelstep, delstep, getdetail, experplan } from '@/utils/api';
import Editor from '../../../components/editor.vue';

const defaultData = {
  description: '',
  name: '',
  content: '',
  sort: '',
  imageStorePath: '',
};

export default {
  components: { Editor },
  data() {
    const editContent = (rule, value, callback) => {
      console.log(value, 'value', typeof value);
      if (value === '<p><br></p>' || value == '') {
        callback(new Error('请输入实验步骤内容'));
      } else {
        callback();
      }
    };
    return {
      multipleSelection: [],
      tableData: [],
      arr: [],
      currentPage: 1,
      input: '',
      dialogVisible: false,
      imgSrc: '',
      id: 0,
      revise: { ...defaultData },
      stepRule: {
        name: [{ required: true, message: '请输入实验步骤名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入实验步骤顺序', trigger: 'blur' }],
        content: [{ validator: editContent, trigger: 'blur' }],
      },
    };
  },
  methods: {
    //保存
    async serve() {
      this.revise.content = this.$refs.editor.html;
      this.$refs['stepForm'].validate(async (validate) => {
        if (validate) {
          const data = {
            name: this.revise.name,
            content: this.$refs.editor.html,
            sort: this.revise.sort,
          };
          if (!this.revise.id) {
            data.experimentReportId = +this.id;
            await addstep(data);
            this.$message.success('添加实验步骤成功');
          } else {
            data.id = this.revise.id;
            data.experimentReportId = this.revise.experimentReportId;
            await updatestep(data);
            this.$message.success('编辑实验步骤成功');
          }
          this.dialogVisible = false;
          await this.break();
        }
      });
    },
    //取消
    cancel() {
      this.dialogVisible = false;
      this.$refs.editor.clearContent();
      this.$refs['stepForm'].resetFields();
    },
    //返回实验报告
    returnstep() {
      history.back();
    },
    //添加实验步骤
    addstep() {
      this.revise = { ...defaultData };
      this.dialogVisible = true;
    },
    //编辑实验
    async editstep({ id }) {
      this.dialogVisible = true;
      const res = await experplan(id);
      this.revise = res.data;
      this.$refs.editor.html = res.data.content;
    },
    //搜索
    search() {},
    //重置
    resetting() {
      this.input = '';
    },
    //删除
    del(e) {
      this.$confirm('此操作将永久删除该实验步骤, 是否继续?', '提示', { type: 'warning' })
        .then(async () => {
          await delstep(e);
          this.$message.success('删除实验步骤成功');
          this.break();
        })
        .catch(() => {});
    },
    //批量删除
    delstep() {
      this.$confirm('此操作将永久删除选中的实验步骤, 是否继续?', '提示', { type: 'warning' })
        .then(async () => {
          await mdelstep(this.arr);
          this.$message.success('删除实验步骤成功');
          this.break();
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.forEach((obj) => {
        const id = obj.id;
        this.arr.push(id);
        const arrdel = [...new Set(this.arr)];
        this.arr = arrdel;
      });
    },
    // 获取数据
    async break() {
      const res = await step(this.id);
      this.tableData = res.data;
    },
  },
  mounted() {
    this.id = this.$route.query.id;
    this.break();
  },
};
</script>

<style scoped>
.header {
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  top: -10px;
  align-items: center;
}
.title {
  width: 110px;
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
