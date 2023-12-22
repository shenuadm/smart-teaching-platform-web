<template>
  <div>
    <el-date-picker
      v-model="date"
      type="daterange"
      :unlink-panels="true"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :change="chooseDate">
    </el-date-picker>
    <el-button @click="chooseDate">测试</el-button>
    <div>
      <!--      <el-date-picker :disableDate="disableDate1" v-model="date1" align="right" type="date"></el-date-picker>-->
      <el-date-picker :picker-options="pickerOptions" v-model="date1" align="right" type="date"></el-date-picker>
      <el-date-picker :picker-options="pickerOptions2" v-model="date2" align="right" type="date"></el-date-picker>
    </div>
    <div class="flex align-center">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="a"></el-tab-pane>
        <el-tab-pane label="配置管理" name="b"></el-tab-pane>
        <el-tab-pane label="角色管理" name="c"></el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="d"></el-tab-pane>
      </el-tabs>
      <div style="margin-bottom: 15px">
        <el-button>按钮</el-button>
        <el-button>确认</el-button>
      </div>
    </div>
    <el-tabs v-model="tabActive" @tab-click="handleTabs">
      <el-tab-pane label="系统作业" name="0">
        <el-table
          v-if="isSystem"
          :data="systemData"
          border
          @selection-change="handleTable"
          v-loading="$store.state.isLoading">
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业内容" prop="content"></el-table-column>
          <el-table-column label="参考答案" prop="answer"></el-table-column>
          <el-table-column label="截止时间" prop="endTime">
            <template #default="{ row }">
              <el-date-picker v-model="row.endTime" type="datetime" :editable="false" placeholder="选择作业截止时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button
                :type="row.assign ? 'info' : 'primary'"
                :disabled="row.assign"
                size="small"
                @click="submitHomework(row)"
                >布置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="布置的作业" name="1">
        <el-table v-if="isAssign" :data="arrangeData" border v-loading="$store.state.isLoading">
          <el-table-column label="作业名称" prop="name"></el-table-column>
          <el-table-column label="作业内容" prop="content"></el-table-column>
          <el-table-column label="类型" prop="custom">
            <template #default="{ row }">
              {{ row.custom ? '老师' : '系统' }}
            </template>
          </el-table-column>
          <el-table-column label="截止时间" prop="endTime"> </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="homeworkDetail(row)">编辑</el-button>
              <el-button type="danger" size="small" @click="deleteHomework(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="学生作业" name="2">
        <el-table v-if="isSutdent" :data="studentData" border v-loading="$store.state.isLoading">
          <el-table-column label="账号" prop="account"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="专业" prop="major"></el-table-column>
          <el-table-column label="年级" prop="grade"></el-table-column>
          <el-table-column label="班级" prop="clazz"></el-table-column>
          <el-table-column label="分数" prop="score">
            <template #default="{ row }">{{ Number.isInteger(row.score) ? row.score : row.score.toFixed(1) }}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="studentHomeWork(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date1: '',
      date2: '',
      date: '',
      activeName: '',
      pickerOptions: {
        disabledDate: (time) => {
          if (this.date2 === '') return false;
          else return time.getTime() > this.date2.getTime();
        },
      },
      pickerOptions2: {
        disabledDate: (time) => {
          if (this.date1 === '') return false;
          else return time.getTime() > this.date1.getTime();
        },
      },
    };
  },
  methods: {
    chooseDate() {
      console.log(this.date);
    },
    handleClick(tab, event) {
      console.log(tab, 'tab');
      console.log(event, 'event');
      console.log(this.activeName, 'activename');
    },
  },
  mounted() {},
};
</script>
