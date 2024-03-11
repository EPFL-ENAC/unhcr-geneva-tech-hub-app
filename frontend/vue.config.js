module.exports = () => {
  const dbKey = `^${process.env.BASE_URL}db`;
  const apiKey = `^${process.env.BASE_URL}api`;
  // const s3Key = `^${process.env.BASE_URL}s3`;
  const configBase = {};
  if (process.env.NODE_ENV === "production") {
    configBase.publicPath = "auto";
  }
  return {
    ...configBase,
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
    devServer: {
      historyApiFallback: true,
      port: 8088,
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
