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
 * 获取老师布置的作业
 * @param {*} articleId 节的id
 * @param {*} teacherCourseId 教师的课程id
 * @returns
 */
export const getAssignHomeworkService = (articleId, teacherCourseId) =>
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
 * @param {articleId, teacherCourseId, name, content, answer, endTime} 节id，课程id，作业名称，作业内容，作业答案，截止日期
 * @returns
 */
export const teaAddHomeworkService = ({ articleId, teacherCourseId, name, content, answer, endTime }) =>
  http.post('/assignmentTeacher/add', { articleId, teacherCourseId, name, content, answer, endTime });

/**
 * 老师编辑作业
 * @param {{ articleId, teacherCourseId, name, content, answer, endTime, id }} 节id，课程id，作业名称，作业内容，作业答案，截止日期，作业id
 * @returns
 */
export const teaEditHomeworkService = ({ articleId, teacherCourseId, name, content, answer, endTime, id }) =>
  http.post('/assignmentTeacher/update', { articleId, teacherCourseId, name, content, answer, endTime, id });

/**
 * 教师删除作业
 * @param {*} id 删除作业id
 * @returns
 */
export const teaDelHomeworkService = (id) => http.delete(`/assignmentTeacher/delete/${id}`);

export const studentGetAssignHomeworkService = (articleId, teacherCourseId) =>
  http.get(`/assignmentStudent/listAssTea/${articleId}/${teacherCourseId}`);
