import http from '@/utils/service';

/**
 * 获取专业列表
 * @param {*} data
 * @returns
 */
// export const getMajorService = (data) => http.get(`/major/list?`, data);
export const getMajorService = () => http.get(`/major/list`);

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
// export const getGradeService = (data) => http.get(`/grade/list?`, data);
export const getGradeService = (id) => http.get(`/grade/list/${id}`);

/**
 * 新增年级
 * @param {*} param0
 * @returns
 */
export const addGradeService = ({ name, status, majorId }) => http.post('/grade/add', { name, status, majorId });

/**
 * 修改年级
 * @param {*} param0
 * @returns
 */
export const updateGradeService = ({ name, status, id, majorId }) =>
  http.post('/grade/update', { name, status, id, majorId });

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
// export const getClassService = (data) => http.get(`/clazz/list?`, data);
export const getClassService = (id) => http.get(`/clazz/list/${id}`);

/**
 * 新增班级
 * @param {*} param0
 * @returns
 */
export const addClassService = ({ name, status, gradeId }) => http.post('/clazz/add', { name, status, gradeId });

/**
 * 更新班级
 * @param {*} param0
 * @returns
 */
export const updateClassService = ({ name, status, id, gradeId }) =>
  http.post('/clazz/update', { name, status, id, gradeId });

/**
 * 删除班级
 * @param {*} id
 * @returns
 */
export const deleteClasService = (id) => http.delete(`/clazz/delete/${id}`);

export const getLearService = () => http.get('/dictionary/tree/1');

export const addLearService = ({ type = 1, parentId = 0, name, status }) =>
  http.post('/dictionary/add', { type, parentId, name, status });

export const updateLearService = ({ type = 1, parentId = 0, name, status, id }) =>
  http.post('/dictionary/update', { type, parentId, name, status, id });

export const deleteLearService = (id) => http.delete(`/dictionary/delete/${id}`);
