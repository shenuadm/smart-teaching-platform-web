import http from '@/utils/service';

export const getVmDataService = (page) => {
  return http.get('/sysvm/list?', page);
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
 * @param {{ id, username, pwd }} param0
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
