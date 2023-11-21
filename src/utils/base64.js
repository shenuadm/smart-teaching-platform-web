const fs = require('fs');

// 读取图片文件
const filePath = './assets/R-C(5).jpg';  // 请将路径替换为你本地图片文件的路径
const imageBuffer = fs.readFileSync(filePath);

// 将图片数据转换为 base64 格式
export const base64Image = imageBuffer.toString('base64');

