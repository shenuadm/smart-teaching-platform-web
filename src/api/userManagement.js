import http from '@/utils/service';

/**
 * 上传用户信息excel
 * @param {File} file
 * @returns
 */
export const uploadStudentExcelService = (file) => {
  return http.formDate('/user/importExcel', file);
};

/**
 * 下载导入用户信息模板
 * @returns
 */
export const downloadExceleSmpleService = () => http.get('/user/downloadExcelSample');
