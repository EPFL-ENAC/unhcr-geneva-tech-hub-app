import enacitGhg from "@/components/icons/enacitGhg.vue";
import enacitShelter from "@/components/icons/enacitShelter.vue";
// TODO: move icons to each component instead of loading globally
// It's like this for legacy reasons (we moved away from the custom font paradigm)
import {
  mdiAccount,
  mdiAccountCircle,
  mdiAccountHardHat,
  mdiAccountMultiple,
  mdiArrowLeftCircle,
  mdiBriefcase,
  mdiChartBox,
  mdiChartDonutVariant,
  mdiChartSankey,
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
  mdiHumanMale,
  mdiInformation,
  mdiInformationOutline,
  mdiLeaf,
  mdiLightbulb,
  mdiLightningBolt,
  mdiLock,
  mdiLogin,
  mdiLogout,
  mdiNewspaperVariantOutline,
  mdiOctagram,
  mdiOctagramOutline,
  mdiPencil,
  mdiPin,
  mdiPlus,
  mdiPlusBox,
  mdiPoll,
  mdiRoomService,
  mdiScale,
  mdiScoreboard,
  mdiShape,
  mdiShower,
  mdiSkipNext,
  mdiStove,
  mdiSunSnowflake,
  mdiTankerTruck,
  mdiTrashCanOutline,
  mdiTriangle,
  mdiViewQuilt,
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
      mdiArrowLeftCircle,
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
      mdiViewQuilt,
      mdiChartDonutVariant,
      mdiChartSankey,
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
      mdiHumanMale,
      mdiLock,
      mdiLeaf,
      mdiLightbulb,
      mdiLightningBolt,
      mdiNewspaperVariantOutline,
      mdiOctagram,
      mdiOctagramOutline,
      mdiPencil,
      mdiPlus,
      mdiPlusBox,
      mdiPoll,
      mdiRoomService,
      mdiScale,
      mdiScoreboard,
      mdiShape,
      mdiShower,
      mdiSkipNext,
      mdiStove,
      mdiSunSnowflake,
      mdiTankerTruck,
      mdiTrashCanOutline,
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

function colorTemplate(literals: TemplateStringsArray, alpha = "1") {
  return literals[0] + alpha + literals[1];
}

export const cccmColors = {
  primary: (alpha = "1") => colorTemplate`rgba(42, 135, 200, ${alpha})`,
  secondary1: (alpha = "1") => colorTemplate`rgba(84, 84, 86, ${alpha})`,
  secondary2: (alpha = "1") => colorTemplate`rgba(157, 72, 56, ${alpha})`,
  secondary3: (alpha = "1") => colorTemplate`rgba(212, 140, 116, ${alpha})`,
  secondary4: (alpha = "1") => colorTemplate`rgba(240, 184, 158, ${alpha})`,
  secondary5: (alpha = "1") => colorTemplate`rgba(248, 228, 210, ${alpha})`,
  green: (alpha = "1") => colorTemplate`rgba(1, 178, 152, ${alpha})`,
};

export const indicatorColors = {
  good: colors.green.base,
  bad: colors.red.base,
  neutral: colors.blue.base,
};
