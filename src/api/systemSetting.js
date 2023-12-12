import http from '@/utils/service';

/**
 * 获取专业列表
 * @param {*} data
 * @returns
 */
export const getMajorService = (data) => http.get(`/major/list?`, data);

/**
 * 新增专业
 * @param {*} param0
 * @returns
 */
export const addMajorService = ({ name, status }) => http.post('/major/add', { name, status });

/**
 * 更新专业
 * @param {*} param0
 * @returns
 */
export const updateMajorService = ({ name, status, id }) => http.post('/major/update', { name, status, id });

/**
 * 删除专业
 * @param {*} id
 * @returns
 */
export const deleteMajorService = (id) => http.delete(`/major/delete/${id}`);

/**
 * 获取年级列表
 * @param {*} data
 * @returns
 */
export const getGradeService = (data) => http.get(`/grade/list?`, data);

/**
 * 新增年级
 * @param {*} param0
 * @returns
 */
export const addGradeService = ({ name, status }) => http.post('/grade/add', { name, status });

/**
 * 修改年级
 * @param {*} param0
 * @returns
 */
export const updateGradeService = ({ name, status, id }) => http.post('/grade/update', { name, status, id });

/**
 * 删除年级
 * @param {*} id
 * @returns
 */
export const deleteGradeService = (id) => http.delete(`/grade/delete/${id}`);

/**
 * 获取班级列表
 * @param {*} data
 * @returns
 */
export const getClassService = (data) => http.get(`/clazz/list?`, data);

/**
 * 新增班级
 * @param {*} param0
 * @returns
 */
export const addClassService = ({ name, status }) => http.post('/clazz/add', { name, status });

/**
 * 更新班级
 * @param {*} param0
 * @returns
 */
export const updateClassService = ({ name, status, id }) => http.post('/clazz/update', { name, status, id });

/**
 * 删除班级
 * @param {*} id
 * @returns
 */
export const deleteClasService = (id) => http.delete(`/clazz/delete/${id}`);
