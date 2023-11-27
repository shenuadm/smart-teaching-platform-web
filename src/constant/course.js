/**
 * 学生选课状态
 */
export const courseStatus = new Map([
  [0, '已选中'],
  [1, '已撤回'],
]);

/**
 * 老师发布课程状态
 */
export const teacherCourseStatus = new Map([
  [0, '未启用'],
  [1, '启用'],
  [2, '选课中'],
  [3, '选课结束'],
  [4, '授课中'],
  [5, '评阅中'],
  [6, '已结束'],
  [7, '已关闭'],
]);
