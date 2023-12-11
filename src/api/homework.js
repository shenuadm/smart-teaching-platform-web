import http from '@/utils/service';

/**
 * 获取作业列表
 * @param {*} id 获取作业的章节id
 * @returns
 */
export const getHomeWorkListService = (id) => http.get(`assignments/list/${id}`);

/**
 * 布置作业
 * @param {*} id 发布作业的id，以，分隔
 * @param {*} teacherCourseId 教师课程id
 * @param {*} time 截止日期
 * @returns
 */
export const pickupHomeworkService = (id, teacherCourseId, time) =>
  http.post(`/assignmentTeacher/assignAss/${id}/${teacherCourseId}/${time}`);

/**
 * 老师获取系统作业
 * @param {*} articleId  节的id
 * @param {*} teacherCourseId 教师的课程id
 * @returns
 */
export const teacherGetHomeworkService = (articleId, teacherCourseId) =>
  http.get(`/assignmentTeacher/listSystemAss/${articleId}/${teacherCourseId}`);

/**
 * 老师获取布置的作业
 * @param {*} articleId 节的id
 * @param {*} teacherCourseId 教师的课程id
 * @returns
 */
export const teacherGetAssignHomeworkService = (articleId, teacherCourseId) =>
  http.get(`/assignmentTeacher/list/${articleId}/${teacherCourseId}`);

/**
 * 老师获取学生作业列表
 * @param {*} articleId 节的id
 * @param {*} teacherCourseId 教师的课程id
 * @returns
 */
export const teacherGetStudentHomeworkService = (articleId, teacherCourseId) =>
  http.get(`/assignmentTeacher/listStuAss/${articleId}/${teacherCourseId}`);

/**
 * 老师新增作业
 * @param {*} param0
 * @returns
 */
export const teaAddHomeworkService = ({ articleId, teacherCourseId, name, content, answer, endTime }) =>
  http.post('/assignmentTeacher/add', { articleId, teacherCourseId, name, content, answer, endTime });

/**
 * 老师编辑作业
 * @param {*} param0
 * @returns
 */
export const teaEditHomeworkService = ({ articleId, teacherCourseId, name, content, answer, endTime, id }) =>
  http.post('/assignmentTeacher/add', { articleId, teacherCourseId, name, content, answer, endTime, id });
