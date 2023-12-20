<template>
  <div>
    <el-table
      border
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column type="expand">
        <template>
          <div>
            <p>额外的展开内容：</p>
            <p>随意添加一些内容来展示不同的展开数据，可以根据需要自定义内容。</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="章节标题" width="200" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="classHour" label="课时" width="80"> </el-table-column>
      <el-table-column prop="sort" label="排序" width="80"> </el-table-column>
      <el-table-column prop="fileUrl" label="课件" width="100" show-overflow-tooltip>
        <template #default="scope">
          <a :href="scope.row.fileUrl" v-if="scope.row.fileUrl">查看课件</a>
        </template>
      </el-table-column>
      <el-table-column label="测试">
        <template #default="{ row }">
          {{ row }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" width="110" show-overflow-tooltip> </el-table-column>
    </el-table>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      date1: '',
      date2: '',
      tableData: [
        {
          id: 1,
          name: '第一章',
          classHour: 3,
          sort: 1,
          fileUrl: 'http://example.com/file1',
          description: '介绍第一章',
          children: [
            {
              id: 2,
              name: '第一节',
              classHour: 1,
              sort: 1,
              fileUrl: 'http://example.com/file2',
              description: '介绍第一节',
            },
          ],
        },
        {
          id: 3,
          name: '第二章',
          classHour: 4,
          sort: 2,
          fileUrl: 'http://example.com/file3',
          description: '介绍第二章',
          children: [
            {
              id: 4,
              name: '第一节',
              classHour: 2,
              sort: 1,
              fileUrl: 'http://example.com/file4',
              description: '介绍第一节',
            },
          ],
        },
      ],
      date: '',
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
    disableDate1(time) {
      return time.getTime() < this.date2.getTime();
    },
  },
  mounted() {},
};
</script>
