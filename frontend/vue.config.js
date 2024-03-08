module.exports = () => {
  const dbKey = `^${process.env.BASE_URL}db`;
  const apiKey = `^${process.env.BASE_URL}api`;
  const s3Key = `^${process.env.BASE_URL}s3`;
  return {
    configureWebpack: {
      devtool: "source-map",
      experiments: {
        topLevelAwait: true,
      },
    },
    productionSourceMap: true,
    pwa: {
      workboxPluginMode: "GenerateSW",
      workboxOptions: {
        clientsClaim: true,
      },
    },
    css: {
      sourceMap: true,
    },
    transpileDependencies: ["vuetify", "leaflet", "echarts"],
    // publicPath: "auto",
    devServer: {
      // https://github.com/webpack/webpack-dev-server/issues/1850#issuecomment-490926569
      // host: "127.0.0.1",
      port: 8081,
      hot: true,
      liveReload: true,
      // ipc: true,
      proxy: {
        [dbKey]: {
          target: "http://localhost:5984",
          pathRewrite: {
            [dbKey]: "", // remove base path
          },
          changeOrigin: true,
          secure: false,
          ws: true,
          headers: {
            Connection: "keep-alive",
          },
        },
        [apiKey]: {
          // target: "http://localhost:8000", // from running locally
          target: "http://localhost:5050/", //from docker compose
          pathRewrite: {
            [apiKey]: "", // remove base path
          },
          secure: false,
        },
        [s3Key]: {
          target: "http://localhost:5660/",
          pathRewrite: {
            [s3Key]: "",
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
      webpackBundleAnalyzer: {
        analyzerMode: "enabled",
        optimization: {
          // https://news.shardlabs.io/how-to-drastically-reduce-your-bundle-size-and-load-time-in-vue-js-54370d513fdf
          splitChunks: "all",
        },
      },
    },
  };
};
