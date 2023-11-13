// 对时间进行处理只要年月日
export const handleDate = (data) => {
  function dateFormat(item) {
    item.updateTime = item.updateTime.slice(0, 10)
  }
  if (Array.isArray(data)) {
    data.map(item => {
      dateFormat(item)
    })
  } else {
    dateFormat(data)
  }
  return data;
}