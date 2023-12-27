<template>
  <div>
    <header>
      <div class="mb-10">
        <div>教师账号：</div>
        <el-input v-model="searchInput['u.account']" placeholder="请输入教师账号" size="small"></el-input>
        <div>教师名称：</div>
        <el-input v-model="searchInput['u.username']" placeholder="请输入教师名称" size="small"></el-input>
        <div>课程名称：</div>
        <el-input v-model="searchInput['c.name']" placeholder="请输入课程名称" size="small"></el-input>
      </div>
      <div class="mb-10">
        <div>课程类型：</div>
        <el-select v-model="searchInput['c.type']" placeholder="请选择课程类型" size="small">
          <el-option v-for="item in courseType" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
        <div>课程状态：</div>
        <el-select v-model="searchInput['tc.status']" placeholder="请选择课程状态" size="small">
          <el-option v-for="item in teacherCourseStatus" :key="item[0]" :value="item[0]" :label="item[1]"></el-option>
        </el-select>
        <div>授课时间：</div>
        <el-date-picker
          size="small"
          v-model="chooseDate"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button style="margin-left: 0" size="small" type="primary" @click="reset">重置</el-button>
      </div>
    </header>

    <el-table :data="tableData" border v-loading="$store.state.isLoading">
      <el-table-column label="老师账号" prop="account"></el-table-column>
      <el-table-column label="老师姓名" prop="username"></el-table-column>
      <el-table-column label="课程名称" prop="courseName"></el-table-column>
      <el-table-column label="课程类型" width="80">
        <template #default="{ row }">{{ courseType.get(row.courseType) }}</template>
      </el-table-column>
      <el-table-column label="课程状态" width="80">
        <template #default="{ row }">{{ teacherCourseStatus.get(row.courseType) }}</template>
      </el-table-column>
      <el-table-column label="上课人数" prop="selectedNumber" width="80"></el-table-column>
      <el-table-column label="创建时间">
        <template #default="{ row }">{{ dateToSecond(row.createTime) }}</template>
      </el-table-column>
      <!--      <el-table-column label="开始时间">-->
      <!--        <template #default="{ row }">{{ dateToSecond(row.startDate) }}</template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="结束时间">-->
      <!--        <template #default="{ row }">{{ dateToSecond(row.endDate) }}</template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" width="80">
        <template #default="{ row }">
          <el-button type="danger" @click="deleteCourse(row.id)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getData"
      :current-page.sync="page"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total"
      :hide-on-single-page="total <= 10">
    </el-pagination>
  </div>
</template>

<script>
import { teacherCourseStatus, courseType } from '@/constant/course';
import { getSearchInfo } from '@/utils';
import { dateToSecond } from '@/utils/date';
import { deleteTeacherCourseService, getTeacherCourseService } from '@/api/courseManage';

const defaultSearch = {
  'u.account': '',
  'u.username': '',
  'c.name': '',
  'c.type': '',
  'tc.status': '',
};

export default {
  name: 'teacherCourseManage',
  data() {
    return {
      tableData: [], // 表格数据
      total: 0, // 总数居
      page: 1, // 当前页
      teacherCourseStatus,
      courseType,
      searchInput: { ...defaultSearch }, // 搜索框内容
      searchInfo: {}, // 实际搜索的信息
      chooseDate: [], // 当前选择的搜索时间
    };
  },
  methods: {
    async getData() {
      const [startTime, endTime] = this.chooseDate;
      const params = getSearchInfo({
        ...this.searchInfo,
        page: this.page,
        startTime: startTime ? dateToSecond(startTime) : '',
        endTime: endTime ? dateToSecond(endTime) : '',
      });
      const { data, count } = await getTeacherCourseService(params);
      this.tableData = data;
      this.total = count;
    },
    reset() {
      this.searchInfo = { ...defaultSearch };
      this.searchInput = { ...defaultSearch };
      this.page = 1;
      this.chooseDate = [];
      this.getData();
    },
    deleteCourse(id) {
      this.$confirm('确认删除该课程？', '提示', { type: 'warning' }).then(async () => {
        await deleteTeacherCourseService(id);
        this.$message.success('删除课程成功');
        this.getData();
      });
    },
    search() {
      if (Object.values(getSearchInfo(this.searchInput)).length === 0) return this.$message.warning('请输入搜索内容');
      this.searchInfo = { ...this.searchInput };
      this.page = 1;
      this.getData();
    },
    dateToSecond,
  },
  mounted() {
    this.getData();
  },
};
</script>

<style scoped>
.header-container {
  display: grid;
}
header > div {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 2fr 1fr 3fr 1fr 1fr;
  //grid-template-columns: 2fr 5fr 2fr 4fr 2fr 7fr 1fr 1fr;
  grid-column-gap: 10px;
  align-items: center;
}
header .el-date-editor {
  width: 100%;
}
header button {
  max-width: 60px;
  margin: auto;
}
</style>
