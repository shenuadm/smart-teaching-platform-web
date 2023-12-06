import http from '@/utils/service';

/**
 *
 * @param {{ id, score, comment }} param0
 * @returns
 */
export const teachEditExperimentService = ({ id, score, comment }) =>
  http.post('/experimentReport/editScoreOrComment', { id, score, comment });
