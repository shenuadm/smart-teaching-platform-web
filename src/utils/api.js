import data from '@/views/teacher/chapterDetails/data.js';
import http from './service.js';

// 登录
export function toLogin(data) {
  return http.post('/user/login', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 获取全部数据
export function getdata() {
  return http.get('/menu/list')
}
export function adddata(e) {
  return http.post('/menu/add', e, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 学生端
// 获取个人信息
export function getPersonInfo() {
  return http.get('/user/getInfo')
}
// 保存个人信息的修改
export function savePersonInfo(data) {
  return http.post('/user/updateMyself', data)
}
// 选课中心
export function getSelectCourse() {
  return http.get('/studentCourse/courseCenterList')
}
// 点击选课
export function clickSelectCourse(data) {
  return http.post('/studentCourse/add', data)
}
// 我的课程
export function getMyCourse() {
  return http.get('/studentCourse/list')
}
// 撤销课程
export function ClickRevokeCourse(data) {
  return http.post('/studentCourse/cancelCourse', data)
}
// 课程详情
export function courseDetails(id) {
  return http.get('/studentCourse/detail/' + id)
}
// 获取树形数据
export function getTreeData(id) {
  return http.get('/article/articleExperimentTree/' + id)
}
// 获取实验内容
export function getExperimentContent(id) {
  return http.get('/experiment/selectById/' + id)
}
// 获取实验步骤
export function getExperimentStudentData(id, studentCourseId) {
  return http.get('/ExperimentReportPlan/student/getExperimentPlanId/' + id + '/' + studentCourseId)
}
// 获取实验结果
export function getExperimentResult(id, studentCourseId) {
  return http.get('/experimentReport/student/' + id + '/' + studentCourseId)
}
// 获取实验成绩
export function getStudentScore(id) {
  return http.get('/experimentReport/listByStudent/' + id)
}
// 保存、提交实验报告
export function saveExperimentReport(data) {
  return http.post('/experimentReport/commitExperimentContent', data)
}
// 超级管理员端
// 删除菜单管理数据
export function deldata(id) {
  return http.delete("/menu/delete/" + id)
}
//课程请获取数据
export function course() {
  return http.get('/course/list?page=1&limit=10')
}
//课程增加数据
export function addcourse(data) {
  return http.formDate('/course/add ', data)
}
//课程修改数据
export function updatecourse(data) {
  return http.formDate('/course/update', data)
}
//课程删除数据
export function delcourse(id) {
  return http.get('/course/delete/' + id)
}
//课程批量删除数据
export function delcoursem(data) {
  return http.delete('course/deletes/' + data)
}
//章节管理接收数据
export function chapter(id) {
  return http.get('/article/list/' + id)
}
//添加章节数据
export function addchapter(data) {
  return http.post('/article/add', data)
}
//修改章节信息
export function rchapter(data) {
  return http.post('/article/update', data)
}
//删除章节信息
export function dalchapter(id) {
  return http.get('/article/delete/' + id)
}
//实验管理信息
export function exper(id) {
  return http.get('/experiment/list/' + id)
}
//添加实验
export function experadd(data) {
  return http.post('experiment/add', data)
}
//删除实验
export function experdel(id) {
  return http.get('experiment/delete/' + id)
}
//编辑实验
export function experedit(data) {
  return http.post('experiment/update', data)
}
//批量删除实验
export function mexperdel(data) {
  return http.delete('experiment/deletes/' + data)
}

// 作业管理
// 获取作业管理列表
export const getHomeWorkList = (id, params) => http.get('assignments/list/' + id, params)
// 添加作业
export const addHomeWork = (data) => http.post('assignments/add', data)
// 修改作业
export const editHomeWork = (data) => http.put('assignments/update', data)
// 删除作业
export const delHomeWork = (id) => http.delete('assignments/delete/' + id)
// 批量删除作业
export const delAllHomeWork = (ids) => http.delete('assignments/deletes/' + ids)


//实验报告数据
export function report(id) {
  return http.get('experimentReport/list/' + id)
}
//添加实验报告
export function reportadd(data) {
  return http.post('experimentReport/add', data)
}
//修改实验报告
export function reportupdate(data) {
  return http.post('experimentReport/update', data)
}
//删除实验报告
export function reportdelete(id) {
  return http.get('experimentReport/delete' + id)
}
//批量删除实验报告
export function mreportdelete(data) {
  return http.get('experimentReport/deletes/' + data)
}
//实验步骤请求数据
export function step(id) {
  return http.get('ExperimentReportPlan/list/' + id)
}
//添加实验步骤
export function addstep(data) {
  return http.post('ExperimentReportPlan/add', data)
}
//编辑实验步骤
export function updatestep(data) {
  return http.post('ExperimentReportPlan/update', data)
}
//批量删除实验步骤
export function mdelstep(data) {
  return http.delete('ExperimentReportPlan/deletes/' + data)
}
//删除实验步骤
export function delstep(id) {
  return http.get('ExperimentReportPlan/delete/' + id)
}
//实验步骤查看详情
export function getdetail(id) {
  return http.get('ExperimentReportPlan/getDetail/' + id)
}
// 修改菜单管理数据
export function upmenuData(u) {
  return http.post("/menu/update", u, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 超级管理员用户管理//
//用户管理数据获取
export function getUserData(e) {
  return http.get('/user/list', e, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 添加用户
export function addUser(a) {
  return http.post('/user/add', a, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 批量删除
export function delUsers(ids) {
  return http.delete('user/deletes/' + [ids])
}
// 重置密码
export function resetPass(userId) {
  return http.put('user/resetPwd/' + userId)
}
// 删除
export function delUser(userid) {
  return http.get('user/delete/' + userid)
}
// 修改用户信息
export function reviseUser(u) {
  return http.post('/user/update', u, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 角色管理
export function roleManagement() {
  return http.get('/role/list')
}
// 授权
export function empowerTree(id) {
  return http.get('/role/queryMenu?roleid=' + id)
}
// 确认授权
export function ackEmpower(data) {
  return http.post('/role/updateRolePermissions', data)
}
// 添加角色
export function addRole(data) {
  return http.post('/role/add', data)
}
// 修改角色
export function updateRole(userId) {
  return http.put('/role/update')
}
// 删除角色
export function delRole(id) {
  return http.delete('/role/delete/' + id)
}
// 系统通知管理
export function systemNotice() {
  return http.get('/notice/list')
}
// 教师端
// 课程中心
export function courseCenter() {
  return http.get('/course/listByTeacher')
}
// 保存授课内容
export function saveCourse(data) {
  return http.post('/teacherCourse/add', data)
}
// 我的授课
export function myTeaching() {
  return http.get('/teacherCourse/teacherOwnCourseList')
}
// 查看章节
export function checkChapter(id) {
  return http.get('/course/query/' + id)
}
// 查看详情
export function teacherCourseDetails(courseId, id) {
  return http.get('/course/courseDetail?courseId=' + courseId + '&id=' + id)
}
// 获取实验步骤
export function getExperimentData(id) {
  return http.get('/ExperimentReportPlan/getExperimentPlanId/' + id)
}
// 成绩列表
export function scoreList(experimentId, teacherCourseId) {
  return http.get('/experimentReport/listByTeacher?experimentId=' + experimentId + '&teacherCourseId=' + teacherCourseId)
}

