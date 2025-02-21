const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    port: 8080, // 端口号
    host: 'localhost', // 允许从任何 IP 地址访问
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    proxy: {
      // 代理
      '/api': {
        target: 'http://localhost:7980', // 目标地址，接口服务地址
        secure: false,
        changeOrigin: true, // 改变请求头中的 Host
        ws: false,
        pathRewrite: {
          // 路径重写
          '^/': '' // 将以 /api 开头的请求重写为根路径
        }
      }
    }
  }
})
