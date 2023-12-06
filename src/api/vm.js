import http from '@/utils/service';

export const getVmDataService = (page) => {
  return http.get('/sysvm/list?', page);
};

// 教师查看学生实验机列表
export const getStudentVms = (id) => {
  return http.get(`/teacherCourse/queryStudentVms/${id}`);
};

// 教师给没有实验机的学生分配实验机
export const shareStudentVms = (id) => {
  return http.get(`/teacherCourse/shareVms2Student/${id}`);
};

/**
 * 新增虚拟机
 * @param {{ name, username, pwd }}
 * @returns
 */
export const addVmService = ({ name, username, pwd }) => {
  return http.post('/sysvm/add', { name, username, pwd });
};

/**
 * 修改虚拟机
 * @param {{ id, name, username, pwd }} param0
 * @returns
 */
export const updateVmService = ({ id, name, username, pwd }) => {
  return http.post('/sysvm/update', { id, name, username, pwd });
};

/**
 * 删除虚拟机
 * @param {*} id
 * @returns
 */
export const deleteVmService = (id) => {
  return http.delete(`/sysvm/delete/${id}`);
};
