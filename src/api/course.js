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
