import http from '@/utils/service';

export const uploadStudentExcelService = (file) => {
  return http.formDate('/user/importExcel', { file });
};
