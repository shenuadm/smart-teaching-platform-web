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
 * @param {articleId, teacherCourseId, name, content, answer, endTime} // 节id，课程id，作业名称，作业内容，作业答案，截止日期
 * @returns
 */
export const teaAddHomeworkService = ({ articleId, teacherCourseId, name, content, answer, endTime }) =>
  http.post('/assignmentTeacher/add', { articleId, teacherCourseId, name, content, answer, endTime });

/**
 * 老师编辑作业
 * @param {{ articleId, teacherCourseId, name, content, answer, endTime, id }} // 节id，课程id，作业名称，作业内容，作业答案，截止日期，作业id
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

/**
 * 学生获取布置的作业
 * @param {*} articleId
 * @param {*} teacherCourseId
 * @returns
 */
export const studentGetAssignHomeworkService = (articleId, teacherCourseId) =>
  http.get(`/assignmentStudent/listAssTea/${articleId}/${teacherCourseId}`);

/**
 * 学生保存作业
 * @param {*} id 作业id
 * @param {*} param1
 * @returns
 */
export const studentSaveHomeworkService = (id, { articleId, teacherCourseId, answer }) =>
  http.post(`/assignmentStudent/add/${id}`, { articleId, teacherCourseId, answer });

/**
 * 学生编辑已经保存的作业
 * @param {*} param0
 * @returns
 */
export const stuEditHomewrokService = ({ id, articleId, teacherCourseId, answer }) =>
  http.post(`/assignmentStudent/update`, { id, articleId, teacherCourseId, answer });

/**
 * 学生获取已保存过的作业
 * @param {*} articleId
 * @param {*} teacherCourseId
 * @returns
 */
export const stuGetMineHomeworkService = (articleId, teacherCourseId) =>
  http.get(`/assignmentStudent/list/${articleId}/${teacherCourseId}`);

/**
 * 学生提交作业
 * @param {*} articleId
 * @param {*} teacherCourseId
 * @returns
 */
export const stuSendHomeworkService = (articleId, teacherCourseId) =>
  http.post(`/assignmentStudent/commit/${articleId}/${teacherCourseId}`);

/**
 * 教师获取学生作业列表
 * @param {*} articleId
 * @param {*} teacherCourseId
 * @param {*} userId
 * @returns
 */
export const teaGetStuHomeworkService = (articleId, teacherCourseId, userId) =>
  http.get(`/assignmentTeacher/selectList4Tea/${articleId}/${teacherCourseId}/${userId}`);

/**
 * 教师保存学生作业
 * @param {*} param0
 * @returns
 */
export const teaSaveStuHomeworkService = ({ id, score, comments }) =>
  http.post('/assignmentTeacher/updateStuAss', { id, score, comments });
