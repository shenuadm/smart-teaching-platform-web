import http from '@/utils/service';

/**
 * 教师修改学生实验成绩评语
 * @param {{ id, score, comment }} param0
 * @returns
 */
export const teachEditExperimentService = ({ id, score, comment }) =>
  http.post('/experimentReport/editScoreOrComment', { id, score, comment });

/**
 * 获取实验内容
 * @param {*} id
 * @returns
 */
export const getExperimentContentService = (id) => http.get(`/experiment/selectById/${id}`);

/**
 * 教师获取实验步骤
 * @param {*} id
 * @returns
 */
export const getExperimentStepService = (id) => http.get('/ExperimentReportPlan/getExperimentPlanId/' + id);

/**
 * 学生获取实验成绩
 * @param {*} id
 * @returns
 */
export const studentGetScoreService = (id) => http.get('/experimentReport/listByStudent/' + id);

/**
 * 保存提交实验报告
 * @param {*} data
 * @returns
 */
export const saveExperimentReportService = (data) => http.post('/experimentReport/commitExperimentContent', data);
