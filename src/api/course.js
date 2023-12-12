import http from '@/utils/service';

/**
 * 获取我的授课列表
 * @param {status, page}课程状态，页数
 * @returns
 */
export const getMyTeachingService = ({ status, page }) =>
  http.get(`/teacherCourse/teacherOwnCourseList?`, { status, page });

/**
 * 学生撤销选中课程
 * @param {*} id 撤销的课程id
 * @returns
 */
export const stuRevokeCourseService = (id) => http.delete(`/studentCourse/cancelCourse/${id}`);

/**
 * 老师编辑课程
 * @param {*} param0
 * @returns
 */
export const teaUpdateCourseService = ({
  id,
  userId,
  courseId,
  selectStartDate,
  selectEndDate,
  maxTaker,
  startDate,
  endDate,
  address,
  status,
}) =>
  http.post('/teacherCourse/update', {
    id,
    userId,
    courseId,
    selectStartDate,
    selectEndDate,
    maxTaker,
    startDate,
    endDate,
    address,
    status,
  });

/**
 * 老师选择授课
 * @param {*} param0
 * @returns
 */
export const teaChooseCourseService = ({
  courseId,
  title,
  selectStartDate,
  selectEndDate,
  maxTaker,
  address,
  startDate,
  endDate,
  status,
}) =>
  http.post('/teacherCourse/add', {
    courseId,
    title,
    selectStartDate,
    selectEndDate,
    maxTaker,
    address,
    startDate,
    endDate,
    status,
  });

/**
 * 老师获取授课中心内容
 * @returns
 */
export const teaGetCourseCenterService = () => http.get('/course/listByTeacher');

/**
 * 学生获取我的课程
 * @returns
 */
export const stuGetMyCourseService = () => http.get('/studentCourse/list');

/**
 * 学生获取选课中心课程
 * @returns
 */
export const stuGetSelectCourseService = () => http.get('/studentCourse/listTeacherCourse');

/**
 * 学生选课
 * @param {*} teacherCourseId
 * @returns
 */
export const stuSelectCourseService = (teacherCourseId) => http.post('/studentCourse/add', { teacherCourseId });
