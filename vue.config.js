module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api*': {
        target: 'http://89.223.127.100:3000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
}
