import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
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
      // 超级管理员端
      {
        path: '/superUser',
        name: 'superUser',
        component: () => import('@/views/superUser/superUser'),
        children: [
          // 个人信息
          {
            path: '/personInfo',
            name: 'personInfo',
            component: () => import('@/views/main/personInfo/personInfo')
          },
          // {
          //   path: '/personmsg',
          //   name: 'personmsg',
          //   component: () => import('@/views/superUser/personmsg/personmsg'),
          // },
          {
            path: '/menuManagement',
            name: 'menuManagement',
            component: () => import('@/views/superUser/menuManagement/menuManagement'),
          },
          {
            path: '/UserManagement',
            name: 'UserManagement',
            component: () => import('@/views/superUser/UserManagement/UserManagement')
          },
          {
            path: '/courseManagement',
            name: 'courseManagement',
            component: () => import('@/views/superUser/menuManagement/courseManagement')
          },
          {
            path: '/chapterManagemet',
            name: 'chapterManagemet',
            component: () => import('@/views/superUser/menuManagement/chapterManagemet')
          },
          {
            path: '/homeworkManagement',
            name: 'homeworkManagement',
            component: () => import('@/views/superUser/menuManagement/homeworkManagement')
          },
          {
            path: '/experManagemet',
            name: 'experManagemet',
            component: () => import('@/views/superUser/menuManagement/experimentalManagement')
          },
          {
            path: '/laboratoryReport',
            name: 'laboratoryReport',
            component: () => import('@/views/superUser/menuManagement/laboratoryReport')
          },
          {
            path: '/laboratoryStep',
            name: 'laboratoryStep',
            component: () => import('@/views/superUser/menuManagement/laboratoryStep')
          },
          {
            path: '/aboutUS',
            name: 'aboutUS',
            component: () => import('@/views/superUser/aboutUS')
          },
          // 角色管理
          {
            path: '/roleManagement',
            name: 'roleManagement',
            component: () => import('@/views/superUser/menuManagement/roleManagement')
          },
          // 系统通知管理
          {
            path: '/systemNotice',
            name: 'systemNotice',
            component: () => import('@/views/superUser/systemNotice/systemNotice'),
          },
        ]

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
            component: () => import('@/views/main/personInfo/personInfo')
          },
          // 选课中心
          {
            path: '/selectCourseCenter',
            name: 'selectCourseCenter',
            component: () => import('@/views/main/selectCourseCenter/selectCourseCenter')
          },
          // 我的课程
          {
            path: '/myCourse',
            name: 'myCourse',
            component: () => import('@/views/main/myCourse/myCourse')
          }
        ]
      },
      // 课程详情
      {
        path: '/courseDetails',
        name: 'courseDetails',
        component: () => import('@/views/courseDetails/courseDetails'),
      },
      // 教师端
      {
        path: '/teacher',
        name: 'teacher',
        component: () => import('@/views/teacher/teacher'),
        children: [
          // 个人信息
          {
            path: '/personInfo',
            name: 'personInfo',
            component: () => import('@/views/main/personInfo/personInfo')
          },
          // // 个人信息
          // {
          //   path: '/personalInfo',
          //   name: 'personalInfo',
          //   component: () => import('@/views/teacher/personalInfo/personalInfo')
          // },
          // 课程中心
          {
            path: '/courseCenter',
            name: 'courseCenter',
            component: () => import('@/views/teacher/courseCenter/courseCenter')
          },
          // 我的授课
          {
            path: '/myTeaching',
            name: 'myTeaching',
            component: () => import('@/views/teacher/myTeaching/myTeaching')
          },
        ]
      },
      // 章节详情
      {
        path: '/chapterDetails',
        name: 'chapterDetails',
        component: () => import('@/views/teacher/chapterDetails/chapterDetails')
      },
      // 公司介绍
      {
        path: '/companyProfile',
        name: 'companyProfile',
        component: () => import('@/views/companyProfile/companyProfile')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
