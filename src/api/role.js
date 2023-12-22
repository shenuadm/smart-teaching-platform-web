import http from '@/utils/service';

/**
 * 获取授权信息
 * @param {*} id
 * @returns
 */
export const getEmpowerTreeService = (id) => http.get('/role/queryMenu?roleid=' + id);

export const setRoleService = (id, menuIds) => http.post(`/role/attachMenu/${id}`, { menuIds });
