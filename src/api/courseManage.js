import http from '@/utils/service';

/**
 * 获取章节信息
 * @param id 课程id
 * @returns {*}
 */
export const getChapterService = (id) => http.get(`/article/list/${id}`);

/**
 * 新增课程章节
 * @param data
 * @returns {Promise<AxiosResponse<any>> | *}
 */
export const addChapterService = (data) => http.formDate('/article/add', data);

/**
 * 删除章节
 * @param id 要删除的章节id
 * @returns {*}
 */
export const deleteChapterService = (id) => http.get(`/article/delete/${id}`);

/**
 * 修改课程章节
 * @param data
 * @returns {Promise<AxiosResponse<any>> | *}
 */
export const updateChapterService = (data) => http.formDate('/article/update', data);
