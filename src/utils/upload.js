/**
 * 是否属于允许上传的文件类型
 * @param {String} fileName 上传的文件名称
 * @param {String[]} allowType 允许上次的文件类型数组
 */
export const isAllowFile = (fileName, allowType) => {
  // 获取文件后缀名
  const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  console.log(fileExtension);
  return allowType.includes(fileExtension);
};
