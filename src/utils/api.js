import http from './service.js';

// 登录
export function toLogin(data) {
  return http.post('/user/login', data);
}
// 注册
export function toRegister(data) {
  return http.post('/user/register', data);
}
// 学生端
// 课程详情
export function courseDetails(id) {
  return http.get('/studentCourse/detail/' + id);
}
// 获取树形数据
export function getTreeData(id) {
  return http.get('/article/articleExperimentTree/' + id);
}

// 获取实验步骤
export function getExperimentStudentData(id, studentCourseId) {
  return http.get('/ExperimentReportPlan/student/getExperimentPlanId/' + id + '/' + studentCourseId);
}

// 超级管理员端
//课程请获取数据
export function course(data) {
  return http.get('/course/list?', data);
}
//课程增加数据
export function addcourse(data) {
  return http.formDate('/course/add ', data);
}
//课程修改数据
export function updatecourse(data) {
  return http.formDate('/course/update', data);
}
//课程删除数据
export function delcourse(id) {
  return http.get('/course/delete/' + id);
}
//课程批量删除数据
export function delcoursem(data) {
  return http.delete('course/deletes/' + data);
}

//实验管理信息
export function exper(id) {
  return http.get('/experiment/list/' + id);
}
//添加实验
export function experadd(data) {
  return http.post('experiment/add', data);
}
//删除实验
export function experdel(id) {
  return http.get('experiment/delete/' + id);
}
//编辑实验
export function experedit(data) {
  return http.post('experiment/update', data);
}
//编辑实验获取数据
export function experplan(id) {
  return http.get('ExperimentReportPlan/' + id);
}
//批量删除实验
export function mexperdel(data) {
  return http.delete('experiment/deletes/' + data);
}

// 作业管理
// 添加作业
export const addHomeWork = (data) => http.post('assignments/add', data);
// 修改作业
export const editHomeWork = (data) => http.post('assignments/update', data);
// 删除作业
export const delHomeWork = (id) => http.delete('assignments/delete/' + id);
// 批量删除作业
export const delAllHomeWork = (ids) => http.delete('assignments/deletes/' + ids);

//实验报告数据
export function report(id) {
  return http.get('experimentReport/list/' + id);
}
//添加实验报告
export function reportadd(data) {
  return http.post('experimentReport/add', data);
}
//修改实验报告
export function reportupdate({ description, experimentId, result, title, classHour, id }) {
  return http.post('experimentReport/update', { description, experimentId, result, title, classHour, id });
}
//删除实验报告
export function reportdelete(id) {
  return http.get('experimentReport/delete' + id);
}
//批量删除实验报告
export function mreportdelete(data) {
  return http.get('experimentReport/deletes/' + data);
}
//实验步骤请求数据
export function step(id) {
  return http.get('ExperimentReportPlan/list/' + id);
}
//添加实验步骤
export function addstep(data) {
  return http.post('ExperimentReportPlan/add', data);
}
//编辑实验步骤
export function updatestep(data) {
  return http.post('ExperimentReportPlan/update', data);
}
//批量删除实验步骤
export function mdelstep(data) {
  return http.delete('ExperimentReportPlan/deletes/' + data);
}
//删除实验步骤
export function delstep(id) {
  return http.get('ExperimentReportPlan/delete/' + id);
}
// 超级管理员用户管理//
//用户管理数据获取
export function getUserData(data) {
  return http.get('/user/list?', data);
}
// 添加用户
export function addUser(a) {
  return http.post('/user/add', a);
}
// 批量删除
export function delUsers(ids) {
  return http.delete('user/deletes/' + [ids]);
}
// 重置密码
export function resetPass(userId) {
  return http.put('user/resetPwd/' + userId);
}
// 删除
export function delUser(userid) {
  return http.get('user/delete/' + userid);
}
// 修改用户信息
export function reviseUser(u) {
  return http.post('/user/update', u, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
// 角色管理
export function roleManagement() {
  return http.get('/role/list');
}
// 授权
export function empowerTree(id) {
  return http.get('/role/queryMenu?roleid=' + id);
}
// 确认授权
export function ackEmpower(data) {
  return http.post('/role/attachMenu', data);
}
// 添加角色
export function addRole(data) {
  return http.post('/role/add', data);
}
// 修改角色
export function updateRole(data) {
  return http.post('/role/update', data);
}
// 删除角色
export function delRole(id) {
  return http.delete('/role/delete/' + id);
}

// 教师端
// 课程中心
export function courseCenter() {
  return http.get('/course/listByTeacher');
}
// 保存授课内容
export function saveCourse(data) {
  return http.post('/teacherCourse/add', data);
}
// 我的授课
// export function myTeaching(status, page) {
//   return http.get(`/teacherCourse/teacherOwnCourseList?status=${status}&page=${page}`);
// }
export function myTeaching({ status, page }) {
  return http.get(`/teacherCourse/teacherOwnCourseList?`, { status, page });
}
// 查看章节
export function checkChapter(id) {
  return http.get('/course/query/' + id);
}
// 查看详情
export function teacherCourseDetails(courseId, id) {
  return http.get('/course/courseDetail?courseId=' + courseId + '&id=' + id);
}

// 成绩列表
export function scoreList(experimentId, teacherCourseId) {
  return http.get(
    '/experimentReport/listByTeacher?experimentId=' + experimentId + '&teacherCourseId=' + teacherCourseId,
  );
}

// 获取学生实验步骤
export function getStudentExperiment(uid, id) {
  return http.get(`/ExperimentReportPlan/getStudentExperimentPlanId/${uid}/${id}`);
}
