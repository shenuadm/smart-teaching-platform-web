import Vue from 'vue';
import VueRouter from 'vue-router';
import { Message } from 'element-ui';

Vue.use(VueRouter);

const routes = [
  // pdf文件
  {
    path: '/pdf',
    component: () => import('@/components/PdfShow.vue'),
  },
  {
    path: '/',
    name: 'index',
    component: () => import('@/components/index'),
    children: [
      {
        path: '/',
        name: 'login',
        component: () => import('@/views/login/login'),
      },
      {
        path: '/test',
        component: () => import('@/views/test.vue'),
      },
      // 菜单页面布局
      {
        path: '/layout',
        name: 'layout',
        component: () => import('@/views/layout/layoutIndex.vue'),
        children: [],
      },
      // 超级管理员端
      {
        path: '/superUser',
        name: 'superUser',
        component: () => import('@/views/superUser/superUser'),
        children: [
          {
            path: '/personInfo',
            name: 'personInfo',
            component: () => import('@/views/main/personInfo/personInfo'),
          },
          {
            path: '/menuManagement',
            name: 'menuManagement',
            component: () => import('@/views/superUser/menuManagement/menuManagement'),
          },
          {
            path: '/UserManagement',
            name: 'UserManagement',
            component: () => import('@/views/superUser/UserManagement/UserManagement'),
          },
          {
            path: '/courseManagement',
            name: 'courseManagement',
            component: () => import('@/views/superUser/menuManagement/courseManagement'),
          },
          {
            path: '/chapterManagemet',
            name: 'chapterManagemet',
            component: () => import('@/views/superUser/menuManagement/chapterManagemet'),
          },
          {
            path: '/homeworkManagement',
            name: 'homeworkManagement',
            component: () => import('@/views/superUser/menuManagement/homeworkManagement'),
          },
          {
            path: '/experManagemet',
            name: 'experManagemet',
            component: () => import('@/views/superUser/menuManagement/experimentalManagement'),
          },
          {
            path: '/laboratoryReport',
            name: 'laboratoryReport',
            component: () => import('@/views/superUser/menuManagement/laboratoryReport'),
          },
          {
            path: '/laboratoryStep',
            name: 'laboratoryStep',
            component: () => import('@/views/superUser/menuManagement/laboratoryStep'),
          },
          {
            path: '/aboutUS',
            name: 'aboutUS',
            component: () => import('@/views/superUser/aboutUS'),
          },
          // 角色管理
          {
            path: '/roleManagement',
            name: 'roleManagement',
            component: () => import('@/views/superUser/menuManagement/roleManagement'),
          },
          // 系统通知管理
          {
            path: '/systemNotice',
            name: 'systemNotice',
            component: () => import('@/views/superUser/systemNotice/systemNotice'),
          },
        ],
      },
      // 学生端
      {
        path: '/main',
        name: 'main',
        component: () => import('@/views/main/main'),
        children: [
          // 个人信息
          {
            path: '/personInfo',
            name: 'personInfo',
            component: () => import('@/views/main/personInfo/personInfo'),
          },
          // 主页
          {
            path: '/home',
            name: 'home',
            component: () => import('@/views/main/home/home'),
          },
          // 选课中心
          {
            path: '/selectCourseCenter',
            name: 'selectCourseCenter',
            component: () => import('@/views/main/selectCourseCenter/selectCourseCenter'),
          },
          // 我的课程
          {
            path: '/myCourse',
            name: 'myCourse',
            component: () => import('@/views/main/myCourse/myCourse'),
          },
        ],
      },
      // 课程详情
      {
        path: '/courseDetails',
        name: 'courseDetails',
        component: () => import('@/views/courseDetails/courseDetails'),
      },
      // 教师端课程详情
      {
        path: '/teacherCourse',
        name: 'teacherCourse',
        component: () => import('@/views/courseDetails/teacherCourse'),
      },
      // 教师端课程中心的查看章节
      {
        path: '/centerCourse',
        name: 'centerCourse',
        component: () => import('@/views/courseDetails/centerCourse'),
      },
      // 教师端
      {
        path: '/teacher',
        name: 'teacher',
        component: () => import('@/views/teacher/teacher'),
        children: [
          // 个人信息
          // {
          //   path: '/personalInfo',
          //   name: 'personalInfo',
          //   component: () =>
          //     import('@/views/teacher/personalInfo/personalInfo'),
          // },
          {
            path: '/teach/personInfo',
            name: 'personInfo',
            component: () => import('@/views/main/personInfo/personInfo'),
          },
          // 课程中心
          {
            path: '/courseCenter',
            name: 'courseCenter',
            component: () => import('@/views/teacher/courseCenter/courseCenter'),
          },
          // 我的授课
          {
            path: '/myTeaching',
            name: 'myTeaching',
            component: () => import('@/views/teacher/myTeaching/myTeaching'),
          },
        ],
      },
      // 章节详情
      {
        path: '/chapterDetails',
        name: 'chapterDetails',
        component: () => import('@/views/teacher/chapterDetails/chapterDetails'),
      },
      // 公司介绍
      {
        path: '/companyProfile',
        name: 'companyProfile',
        component: () => import('@/views/companyProfile/companyProfile'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});
//路由拦截
router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  const roleUrl = JSON.parse(localStorage.getItem('roleUrl'));
  const isLogin = window.localStorage.getItem('satoken');
  if (isLogin && roleUrl) {
    // 如果前往的网页没有权限，就终止此次前进
    // if (!roleUrl.includes(to.path)) {
    //   return next(false);
    // }
    next();
  } else {
    if (to.path === '/') {
      next();
    } else {
      Message('没有访问权限或登陆已过期，请重新登陆');
      next('/');
    }
  }
});

export default router;
