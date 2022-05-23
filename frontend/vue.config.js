module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  pwa: {
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      skipWaiting: true,
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
