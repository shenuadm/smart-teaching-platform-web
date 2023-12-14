import http from '@/utils/service';

/**
 * 修改用户信息信息
 * @param {{ oldpwd, password, username, phone }} param0
 * @returns
 */
export const saveUserInfoService = ({ oldpwd, password, username, phone }) =>
  http.post('/user/updateMyself', { oldpwd, password, username, phone });

/**
 * 获取用户信息
 * @returns
 */
export const getUserInfoService = () => http.get('/user/getInfo');

// export const logoutVmService =() => http.get()
