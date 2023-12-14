import dayjs from 'dayjs';

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

/**
 * 传入一个时间，返回格式化至秒的字符串
 * @param {*} date
 * @returns
 */
export const dateToSecond = (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');
