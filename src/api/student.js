import http from '@/utils/service';

/**
 * 学生重新选择课程
 * @param {*} id 课程id
 * @returns
 */
export const recoverCourseService = (id) => {
  return http.post(`/studentCourse/recoverCourse/${id}`);
};
