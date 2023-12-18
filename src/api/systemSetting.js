import http from '@/utils/service';
/**
 * 获取
 * @returns
 */
export const getLearService = () => http.get('/dictionary/tree/1');

export const addLearService = ({ type = 1, parentId = 0, name, status, level }) =>
  http.post('/dictionary/add', { type, parentId, name, status, level });

export const updateLearService = ({ type = 1, parentId = 0, name, status, id, level }) =>
  http.post('/dictionary/update', { type, parentId, name, status, id, level });

export const deleteLearService = (id) => http.delete(`/dictionary/delete/${id}`);

/**
 * 获取专业树状结构
 * @returns {*}
 */
export const getActiveLearService = () => http.get('/dictionary/treeActive/1');

export const getChooseLearService = (teacherCourseId) =>
  http.get(`/teacherCourse/selectDictionaryTree/${teacherCourseId}`);
