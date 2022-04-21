import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import { VuetifyParsedTheme } from "vuetify/types/services/theme";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi",
  },
  theme: {
    options: {
      customProperties: true,
      themeCache: {
        // https://vuetifyjs.com/features/theme/#section-30ad30e330c330b730e5
        get: (key: VuetifyParsedTheme) => {
          return localStorage.getItem(JSON.stringify(key));
        },
        set: (key: VuetifyParsedTheme, value: string) => {
          localStorage.setItem(JSON.stringify(key), value);
        },
      },
    },
    themes: {
      // https://www.ungm.org/UNUser/Documents/DownloadPublicDocument?docId=782892
      // https://data2.unhcr.org/en/documents/download/60115
      light: {
        primary: "#0072BC",
        secondary: "#000000",
        accent: "#FAEB00",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
});
