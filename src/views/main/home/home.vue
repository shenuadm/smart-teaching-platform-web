<template>
  <div class="home">
    <div class="hot-class">
      <p>热门课程</p>
      <ul class="class-list">
        <li class="class-item" v-for="item in classList" :key="item.id">
          <div class="item-img"><img :src="item.img" alt="网络错误" /></div>
          <div class="class-info">
            <p>课程名称:{{ item.className }}</p>
            <p>任课教师：{{ item.classTeacher }}</p>
            <p>选课人数：{{ item.selectPerson }}人</p>
            <p class="class-btn">
              <el-button type="primary" size="mini">选课</el-button>
              <el-button type="primary" size="mini">详情</el-button>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classList: [
        {
          id: 1,
          img: require('@/assets/bg.jpg'),
          className: '《web安全》',
          classTeacher: '张老师',
          selectPerson: 50,
        },
        {
          id: 2,
          img: require('@/assets/addbg.jpg'),
          className: '《java》',
          classTeacher: '许老师',
          selectPerson: 45,
        },
        {
          id: 3,
          img: require('@/assets/bg.jpg'),
          className: '《web安全》',
          classTeacher: '梦老师',
          selectPerson: 43,
        },
        {
          id: 4,
          img: require('@/assets/addbg.jpg'),
          className: '《web安全》',
          classTeacher: '肖老师',
          selectPerson: 38,
        },
      ],
    };
  },
};
</script>

<style scoped>
.hot-class {
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
}
.hot-class > p {
  text-align: left;
  font-weight: 700;
  margin: 20px 0 0 0;
}
.class-list {
  display: flex;
  justify-content: left;
  padding: 0;
  flex-wrap: wrap;
  margin: 0;
}
.class-item {
  margin: 20px 20px 0 0;
  width: 200px;
  height: auto;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  background-color: rgb(168, 230, 254);
}
.class-item:hover {
  transform: scale(1.05);
  box-shadow: 2px 2px 2px rgb(76, 185, 228);
}
.item-img {
  width: 190px;
  height: 100px;
  box-sizing: border-box;
}
.item-img > img {
  width: 190px;
  height: 100px;
}
.class-info > p {
  margin: 5px 0;
  text-align: left;
}
.class-btn {
  text-align: center !important;
  margin-top: 20px !important;
}
</style>
