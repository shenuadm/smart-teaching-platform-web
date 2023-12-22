/**
 * 判断搜索条件是否为空，返回搜索条件
 * @param data
 * @returns {{}}
 */
export const getSearchInfo = (data) => {
  const search = {};
  for (const [k, v] of Object.entries(data)) {
    v !== '' && v !== null && v !== undefined && Object.assign(search, { [k]: v });
  }
  return search;
};
