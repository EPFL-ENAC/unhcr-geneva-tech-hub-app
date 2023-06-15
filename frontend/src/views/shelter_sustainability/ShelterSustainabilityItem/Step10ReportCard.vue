<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex align-center">
        <h2 class="d-flex align-center project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
      <v-col class="d-flex align-center justify-end">
        <v-btn class="d-print-none" @click="printOnClick"
          >Export Assessment report</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="first-page-content">
      <v-col :cols="6">
        <v-row>
          <v-col :cols="12">
            <h4>{{ shelter.location_name }}</h4>
            <div class="text-body">
              {{ countriesMap?.[shelter.location_country]?.name }}
            </div>
            <div class="text-subtitle">
              {{ shelter.organisation }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon :class="`c-${shelterColors[shelter.shelter_type].name}`">
              {{ shelterIcons[shelter.shelter_type] }}
            </v-icon>
          </v-col>
          <v-col>{{ shelter.shelter_type }} shelter</v-col>
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon
              v-for="n in shelter.shelter_occupants"
              :key="n"
              style="margin: -6px"
            >
              $mdiHumanMale
            </v-icon>
          </v-col>
          <v-col class="align-center"
            >{{ shelter.shelter_occupants }} intented occupants</v-col
          >
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon :class="`c-blue`"> $mdiCalendarBlankOutline </v-icon>
          </v-col>
          <v-col class="align-center"
            >{{ shelter.shelter_lifespan }} year intentended lifespan</v-col
          >
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon :class="`c-blue`"> $mdiAccountHardHat </v-icon>
          </v-col>
          <v-col class="align-center"
            >{{ shelter.setup_people }} people for setup</v-col
          >
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon :class="`c-blue`"> $mdiTimerOutline </v-icon>
          </v-col>
          <v-col class="align-center"
            >{{ shelter.setup_time }} days for setup</v-col
          >
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon> $mdiHomeFlood </v-icon>
          </v-col>
          <v-col class="align-center"
            >{{ shelter.risk_flood }} local flood risk</v-col
          >
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon> $mdiHome </v-icon>
          </v-col>
          <v-col class="align-center"
            >{{ shelter.risk_seismic }} local seismic risk</v-col
          >
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon> $mdiFloorPlan </v-icon>
          </v-col>
          <v-col class="align-center">
            {{ shelter.geometry.floorArea | formatNumber }} m<sup>2</sup> floor
            area
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="3">
            <v-icon> $mdiCubeOutline </v-icon>
          </v-col>
          <v-col class="align-center">
            {{ shelter.geometry.volume | formatNumber }} m<sup>3</sup> volume
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="3"> </v-col>
          <v-col class="align-center">
            ${{ shelter.totalEnvPerf.totalCost | formatNumber }} total cost
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="6">
        <v-row>
          <v-col class="d-flex info-map">
            <territory-map :value="latLng" :default-zoom="5" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center align-center">
            <v-img
              v-if="shelterWithImage?.image?.url"
              class="shelter-image-report"
              width="100%"
              :src="shelterWithImage?.image?.url"
              aspect-ratio="3/2"
            ></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <step-9-score-card :shelter="shelter" class="shelter-report-score-card" />
    <step-5-environmental-impact :shelter="shelter" />
    <step-6-technical-performance :shelter="shelter" />
    <step-7-habitability :shelter="shelter" />
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import { ImageShelter, Shelter } from "@/store/ShelterInterface";
import { countriesMap } from "@/utils/countriesAsList";
import Step1ProjectInformation from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step1ProjectInformation.vue";
import Step2Geometry from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step2Geometry.vue";
import Step5EnvironmentalImpact from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step5EnvironmentalImpact.vue";
import Step6TechnicalPerformance from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step6TechnicalPerformance.vue";
import Step7Habitability from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step7Habitability.vue";
import Step9ScoreCard from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step9ScoreCard.vue";
import {
  shelterColors,
  shelterIcons,
} from "@/views/shelter_sustainability/shelterTypeColors";
import { LatLngExpression } from "leaflet";

import { cloneDeep } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

function findShelterImage(images: ImageShelter[]): ImageShelter | undefined {
  if (!images || typeof images !== "object" || !Array.isArray(images)) {
    return;
  }
  const firstImage = images.find(function (image) {
    return image.type === "Image";
  });
  if (!firstImage) {
    return;
  }
  return firstImage;
}

@Component({
  components: {
    Step1ProjectInformation,
    Step2Geometry,
    Step6TechnicalPerformance,
    Step7Habitability,
    Step5EnvironmentalImpact,
    Step9ScoreCard,
    InfoTooltip,
    TerritoryMap,
  },
})
/** Project */
export default class Step10ReportCard extends Vue {
  infoTooltipText = infoTooltipText;
  @Prop({ type: [Object], required: true })
  shelter!: Shelter;

  countriesMap = countriesMap;
  shelterColors = shelterColors;
  shelterIcons = shelterIcons;
  public get shelterWithImage(): Shelter {
    if (this.shelter) {
      const newShelter = cloneDeep(this.shelter);

      newShelter.image = findShelterImage(newShelter.images) ?? undefined;

      return newShelter;
    }
    return {} as Shelter;
  }

  get latLng(): LatLngExpression {
    const { latitude, longitude } = this.shelter;
    if (latitude !== undefined) {
      return [latitude ?? 0, longitude ?? 0];
    }
    return [0, 0] as LatLngExpression;
  }

  public printOnClick() {
    try {
      // https://stackoverflow.com/questions/31171099/window-print-does-not-work-in-safari
      if (!document.execCommand("print", false, undefined)) {
        window.print();
      }
    } catch {
      window.print();
    }
  }
}
</script>

<style lang="scss" scoped>
.info-map {
  height: 317px;
}
.shelter-image-report {
  height: 350px;
}
@media print {
  @page {
    size: portrait;
  }
  :deep(.leaflet-control-zoom) {
    display: none;
  }
  .first-page-content {
    font-size: 3mm;
    .col {
      padding-top: 4px;
      padding-bottom: 4px;
      align-items: center;
    }
  }
  .info-map {
    height: 7cm;
  }
  .shelter-image-report {
    height: 5cm;
  }
  .shelter-report-score-card {
    page-break-after: always;
    page-break-inside: auto;
  }
}

::v-deep .c-blue {
  color: var(--c-blue);
  fill: var(--c-blue);
}

::v-deep .c-brown {
  color: var(--c-brown);
  fill: var(--c-brown);
}

::v-deep .c-grey {
  color: var(--c-grey);
  fill: var(--c-grey);
}
</style>
