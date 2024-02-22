module.exports = () => {
  const dbKey = `^${process.env.BASE_URL}db`;
  const apiKey = `^${process.env.BASE_URL}api`;
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
    publicPath: "auto",
    devServer: {
      historyApiFallback: true,
      port: 8081,
      hot: true,
      liveReload: true,
      proxy: {
        [dbKey]: {
          target: "couchdb:5984",
          pathRewrite: {
            [dbKey]: "",
          },
          changeOrigin: true,
          secure: false,
          ws: true,
          headers: {
            Connection: "keep-alive",
          },
        },
        [apiKey]: {
          target: "rest-api:5051/",
          pathRewrite: {
            [apiKey]: "",
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
