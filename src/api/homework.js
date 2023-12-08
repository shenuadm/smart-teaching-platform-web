import http from '@/utils/service';

/**
 * 获取作业列表
 * @param {*} id 获取作业的章节id
 * @returns
 */
export const getHomeWorkListService = (id) => http.get(`assignments/list/${id}`);
