// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js
// http://www.quasarchs.com/quasar-cli/quasar-conf-js

// 访问终端变量
// console.log(process.env);

module.exports = function (ctx) {
  return {
    // app 启动文件 (/src/boot)
    // --> boot files are part of "main.js"
    boot: ["i18n", "axios"],

    // 全局 CSS 文件
    css: ["app.scss"],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      "fontawesome-v5",
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!
      // 'roboto-font',
      "material-icons", // optional, you are not bound to it
    ],

    framework: {
      iconSet: "fontawesome-v5",
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        "QLayout",
        "QHeader",
        "QDrawer",
        "QPageContainer",
        "QScrollArea",
        "QPage",
        "QToolbar",
        "QToolbarTitle",
        "QBtn",
        "QIcon",
        "QList",
        "QItem",
        "QItemSection",
        "QItemLabel",
        "QChip",
        "QAvatar",
        "QImg",
        "QSeparator",
        "QPageSticky",
        "QFab",
        "QFabAction",
        "QInput",
      ],

      directives: ["Ripple"],

      // Quasar plugins
      plugins: ["Notify", "Loading", "LoadingBar"],
      config: {
        loadingBar: {
          color: "amber",
          size: "2.5px",
        },
      },
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      // devtool: "eval-source-map", //需要时才放开
      analyze: process.env.NODE_ENV === "production" ? true : false,
      // vueRouterMode: 'history',
      // publicPath:'./',
      // vueCompiler: true,
      // gzip: true,
      // extractCSS: false,
      extendWebpack(cfg, { isServer, isClient }) {
        cfg.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
          options: {
            formatter: require("eslint").CLIEngine.getFormatter("stylish"),
          },
        });
      },
    },

    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
    },

    animations: "all", // --- includes all animations
    ssr: {
      pwa: false,
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'issue-blog',
        // short_name: 'issue-blog',
        // description: 'issue-blog',
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        theme_color: "#21ba45",
        icons: [
          {
            src: "statics/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "statics/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack(cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        // appId: 'issue-blog'
      },
    },
  };
};
