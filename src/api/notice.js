import http from '@/utils/service';

/**
 * 获取系统通知管理
 * @param {*} data 搜索条件
 * @returns
 */
export const getSystemNoticeService = (data) => http.get('/notice/list?', data);

/**
 * 删除系统通知
 * @param {*} id
 * @returns
 */
export const deleteSystemNoticeService = (id) => http.delete(`/notice/delete/${id}`);

/**
 * 修改系统通知
 * @param {*} param0
 * @returns
 */
export const editSystemNoticeService = ({ id, title, content, status }) =>
  http.post('notice/update', { id, title, content, status });

/**
 * 发布系统通知
 * @param {*} param0
 * @returns
 */
export const addSystemNoticeService = ({ title, content, status }) =>
  http.post('notice/add', { title, content, status });

/**
 * 批量删除系统通知
 * @param {*} ids
 * @returns
 */
export const deletesSystemNoticeService = (ids) => http.delete(`/notice/deletes/${ids}`);

/**
 * 获取系统通知
 * @returns
 */
export const getNoticeService = (data) => http.get('/userNotice/list?', data);

/**
 * 提示未读通知
 * @returns
 */
export const promptUnreadNoticeService = () => http.get('/userNotice/checkUnreadNotice');

/**
 * 查看通知
 * @param {*} id
 * @returns
 */
export const readNoticeService = (id) => http.post(`/userNotice/read/${id}`);
