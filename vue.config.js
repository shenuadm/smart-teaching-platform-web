const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //关闭lint语法检查
  devServer: {
    // 配置代理服务器
    proxy: {
      // 跨域配置
      '/api': {
        target: 'http://1.14.28.17:8081/', //请求的第三方接口
        // target: 'http://192.168.0.112:8999/', //请求的第三方接口
        changeOrigin: true, //在本地创建一个虚拟服务端，通过虚拟服务端发送接口
        pathRewrite: {
          //配置的/api的路径 重写路径
          '^/api': '',
        },
      },
    },
  },
});
