// import { setDefaultResultOrder } from "dns";
// setDefaultResultOrder("ipv4first");

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
    // host: "127.0.0.1",
    hot: true,
    liveReload: true,
    // ipc: true,
    proxy: {
      "^/db": {
        target: "http://localhost:5984",
        pathRewrite: {
          "^/db": "", // remove base path
        },
        changeOrigin: true,
        secure: false,
        ws: true,
        headers: {
          Connection: "keep-alive",
        },
      },
      "^/api": {
        target: "http://localhost:5050/",
        pathRewrite: {
          "^/api": "", // remove base path
        },
        secure: false,
      },
      "^/s3": {
        target: "http://localhost:5660/",
        pathRewrite: {
          "^/s3": "",
        },
        secure: false,
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
