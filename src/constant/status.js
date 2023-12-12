/**
 * 通知发布状态
 */
export const noticeStatus = new Map([
  [0, '未发布'],
  [1, '已发布'],
  [2, '已关闭'],
]);

/**
 * 学生作业状态
 */
export const studentHomeworkStatus = new Map([
  [-1, '去完成'],
  [0, '已保存'],
  [1, '已提交'],
  [2, '已评阅'],
]);

export const systemSettingStatus = new Map([
  [0, '禁用'],
  [1, '启用'],
]);
