import enacitGhg from "@/components/icons/enacitGhg.vue";
import enacitShelter from "@/components/icons/enacitShelter.vue";
import {
  mdiAccount,
  mdiAccountCircle,
  mdiAccountHardHat,
  mdiAccountMultiple,
  mdiBriefcase,
  mdiChartBox,
  mdiCheck,
  mdiCheckboxBlank,
  mdiCheckboxBlankOutline,
  mdiCheckboxMarked,
  mdiChevronDown,
  mdiChevronLeft,
  mdiClipboardTextMultiple,
  mdiClose,
  mdiContentCopy,
  mdiContentSave,
  mdiDatabaseArrowRight,
  mdiDelete,
  mdiDownload,
  mdiFlash,
  mdiHome,
  mdiHomeCity,
  mdiHomeGroup,
  mdiHomeOutline,
  mdiHomeVariantOutline,
  mdiInformation,
  mdiInformationOutline,
  mdiLeaf,
  mdiLightbulb,
  mdiLightningBolt,
  mdiLock,
  mdiLogin,
  mdiLogout,
  mdiNewspaperVariantOutline,
  mdiPencil,
  mdiPin,
  mdiPlus,
  mdiPlusBox,
  mdiPoll,
  mdiRoomService,
  mdiScoreboard,
  mdiShape,
  mdiShower,
  mdiSkipNext,
  mdiStove,
  mdiSunSnowflake,
  mdiTankerTruck,
  mdiToilet,
  mdiTriangle,
  mdiWater,
  mdiWaterPump,
  mdiWizardHat,
  mdiWrench,
} from "@mdi/js";
import Vue from "vue";
import { colors } from "vuetify/lib";
import Vuetify from "vuetify/lib/framework";
import { VuetifyParsedTheme } from "vuetify/types/services/theme";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdiSvg",
    values: {
      shelter: {
        component: enacitShelter,
      },
      ghg: {
        component: enacitGhg,
      },
      mdiAccount,
      mdiAccountCircle,
      mdiAccountHardHat,
      mdiAccountMultiple,
      mdiChevronLeft,
      mdiChevronDown,
      mdiPin,
      mdiBriefcase,
      mdiClose,
      mdiContentSave,
      mdiContentCopy,
      mdiCheck,
      mdiCheckboxBlank,
      mdiCheckboxBlankOutline,
      mdiCheckboxMarked,
      mdiDatabaseArrowRight,
      mdiDelete,
      mdiDownload,
      mdiFlash,
      mdiInformation,
      mdiInformationOutline,
      mdiLogin,
      mdiLogout,
      mdiChartBox,
      mdiClipboardTextMultiple,
      mdiHome,
      mdiHomeVariantOutline,
      mdiHomeOutline,
      mdiHomeCity,
      mdiHomeGroup,
      mdiLock,
      mdiLeaf,
      mdiLightbulb,
      mdiLightningBolt,
      mdiNewspaperVariantOutline,
      mdiPencil,
      mdiPlus,
      mdiPlusBox,
      mdiPoll,
      mdiRoomService,
      mdiScoreboard,
      mdiShape,
      mdiShower,
      mdiSkipNext,
      mdiStove,
      mdiSunSnowflake,
      mdiTankerTruck,
      mdiToilet,
      mdiTriangle,
      mdiWater,
      mdiWaterPump,
      mdiWizardHat,
      mdiWrench,
    },
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

/**
 * https://data2.unhcr.org/en/documents/download/60115
 * // https://unhcr-web.github.io/unhcRstyle/docs/reference/unhcr_green.html
 */
export const cccmColors = {
  primary: "#2A87C8",
  secondary1: "#545456",
  secondary2: "#9d4838",
  secondary3: "#d48c74",
  secondary4: "#f0b89e",
  secondary5: "#f8e4d2",
  green: "rgba(1,178,152)",
  primary50: "rgba(42, 135, 200, 0.5)",
};

export const indicatorColors = {
  good: colors.green.base,
  bad: colors.red.base,
  neutral: colors.blue.base,
};
