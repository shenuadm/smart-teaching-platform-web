import http from '@/utils/service';

// 教师查看学生实验机列表
export const getStudentVms = (id) => {
  return http.get(`/teacherCourse/queryStudentVms/${id}`);
};

// 教师给没有实验机的学生分配实验机
export const shareStudentVms = (id) => {
  return http.get(`/teacherCourse/shareVms2Student/${id}`);
};
