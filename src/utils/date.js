// 对时间进行处理只要年月日
export const handleDate = (data) => {
  function dateFormat(item) {
    item.updateTime = item.updateTime.slice(0, 10);
  }
  if (Array.isArray(data)) {
    data.map((item) => {
      dateFormat(item);
    });
  } else {
    dateFormat(data);
  }
  return data;
};

/**
 * 判断选择的时间是否在当前时间加半小时后
 * @param {*} date 需要判断的时间
 * @returns 在之后返回true
 */
export const isAfterNow = (date) => {
  const nowDate = new Date(new Date().getTime() + 30 * 60 * 1000);
  const targetDate = new Date(date);
  return targetDate > nowDate;
};
