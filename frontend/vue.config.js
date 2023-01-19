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
    proxy: {
      "^/db": {
        target: "http://localhost:5984/",
        pathRewrite: {
          "^/db": "", // remove base path
        },
        ws: true,
        changeOrigin: true,
      },
      "^/api": {
        target: "http://localhost:5050/",
        pathRewrite: {
          "^/api": "", // remove base path
        },
        ws: true,
        changeOrigin: true,
      },
      "^/s3": {
        target: "http://localhost:5660/",
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
