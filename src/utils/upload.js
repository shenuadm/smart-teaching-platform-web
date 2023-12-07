/**
 *
 * @param {String} fileName
 * @param {String[]} allowType
 */
export const isAllowFile = (fileName, allowType) => {
  const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  console.log(fileExtension);
  return allowType.includes(fileExtension);
};
