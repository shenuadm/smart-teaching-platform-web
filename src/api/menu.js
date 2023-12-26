import http from '@/utils/service';

/**
 * 获取菜单
 * @returns {*}
 */
export const getMenuService = () => http.get('/menu/list');

/**
 * 新增菜单
 * @param funpid
 * @param funurl
 * @param funtype
 * @param menuName
 * @param sort
 * @param title
 *
 * @param icon
 * @returns {*}
 */
export const addMenuService = ({ funpid, funurl, funtype, menuName, sort, title, icon }) =>
  http.post('/menu/add', { funpid, funurl, menuName, sort, funtype, title, icon });

/**
 * 修改菜单
 * @param funpid
 * @param funurl
 * @param funtype
 * @param menuName
 * @param sort
 * @param title
 * @param id
 * @param icon
 * @returns {*}
 */
export const updateMenuService = ({ funpid, funurl, funtype, menuName, sort, title, id, icon }) =>
  http.post('/menu/update', { funpid, funurl, menuName, sort, funtype, title, id, icon });

/**
 * 删除菜单
 * @param id
 * @returns
 */
export const deleteMenuService = (id) => http.delete(`/menu/delete/${id}`);
