import http from '@/utils/service';

/**
 * 获取我的授课列表
 * @param {status, page}课程状态，页数
 * @returns
 */
export const getMyTeachingService = ({ status, page }) =>
  http.get(`/teacherCourse/teacherOwnCourseList?`, { status, page });
