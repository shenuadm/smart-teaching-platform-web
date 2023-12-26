import http from '@/utils/service';

/**
 * 获取系统日志
 * @param params
 * @returns {*}
 */
export const getLogService = (params) => http.get('/syslog/list', params);

/**
 * 删除单个日志
 * @param id
 * @returns {Promise<AxiosResponse<any>> | *}
 */
export const deleteLogService = (id) => http.delete(`/syslog/delete/${id}`);

/**
 * 删除多个日志
 * @param ids
 * @returns {Promise<AxiosResponse<any>> | *}
 */
export const deleteLogsService = (ids) => http.delete(`/syslog/deletes/${ids}`);

/**
 * 删除时间范围内日志
 * @param startTime
 * @param endTime
 * @returns {Promise<AxiosResponse<any>> | *}
 */
export const deleteLogByTimeService = (startTime, endTime) =>
  http.delete(`/syslog/deletesByYear/${startTime}/${endTime}`);

/**
 * 获取日志详情
 * @param id
 * @returns {*}
 */
export const getLogDetailService = (id) => http.get(`/syslog/detail/${id}`);
