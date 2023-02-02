module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pwa: {
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
  transpileDependencies: ["vuetify"],

  devServer: {
    // https://github.com/webpack/webpack-dev-server/issues/1850#issuecomment-490926569
    host: "::1",
    // hot: false,
    // liveReload: true,
    // ipc: true,
    proxy: {
      "^/db": {
        target: "http://127.0.0.1:5984/",
        pathRewrite: {
          "^/db": "", // remove base path
        },
        ws: true,
        changeOrigin: true,
      },
      "^/api": {
        target: "http://127.0.0.1:5050/",
        pathRewrite: {
          "^/api": "", // remove base path
        },
        ws: true,
        changeOrigin: true,
      },
      "^/s3": {
        target: "http://127.0.0.1:5660/",
        pathRewrite: {
          "^/s3": "",
        },
        ws: true,
        changeOrigin: true,
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
      enableBridge: false,
    },
  },
};
