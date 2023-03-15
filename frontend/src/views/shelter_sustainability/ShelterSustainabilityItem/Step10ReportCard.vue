<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex">
        <h2 class="d-flex align-center project__h3 font-weight-medium">
          {{ infoTooltipText[$route.name].title }}
        </h2>
        <info-tooltip>
          {{ infoTooltipText[$route.name].text }}
        </info-tooltip>
      </v-col>
      <v-col class="d-flex align-center justify-end">
        <v-btn
          class="d-print-none"
          @click="
            window.print();
            return false;
          "
          >Export Assessment report</v-btn
        >
      </v-col>
    </v-row>
    <!-- <step-1-project-information :value="shelter" /> -->
    <!-- <v-row>
      <v-col :cols="6">
        <v-row>
          <v-col>{{ shelter.shelter_type }} shelter</v-col>
        </v-row>
        <v-row>
          <v-col>{{ shelter.shelter_occupants }} intented occupants</v-col>
        </v-row>
        <v-row>
          <v-col
            >{{ shelter.shelter_lifespan }} year intentended lifespan</v-col
          >
        </v-row>
        <v-row>
          <v-col>{{ shelter.setup_people }} people for setup</v-col>
        </v-row>
        <v-row>
          <v-col>{{ shelter.setup_time }} days for setup</v-col>
        </v-row>
        <v-row>
          <v-col>{{ shelter.risk_flood }} local flood risk</v-col>
        </v-row>
        <v-row>
          <v-col>{{ shelter.risk_seismic }} local seismic risk</v-col>
        </v-row>
      </v-col>
      <v-col :cols="6">
        <v-row>
          <v-col class="d-flex info-map">
            <territory-map :value="latLng" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-col class="d-flex justify-center align-center">
              <v-avatar
                v-if="shelterWithImage?.image?.url"
                class="profile"
                color="grey"
                size="64"
                tile
              >
                <v-img :src="shelterWithImage?.image?.url"></v-img>
              </v-avatar>
              <v-avatar v-else class="profile" color="grey" size="64" tile>
                <v-card-title class="white--text"></v-card-title>
              </v-avatar> </v-col
          ></v-col>
        </v-row>
      </v-col>
    </v-row> -->
    <step-9-score-card :shelter="shelter" />
    <!-- <step-5-environmental-impact :shelter="shelter" />
    <step-6-technical-performance :shelter="shelter" />
    <step-7-habitability :shelter="shelter" /> -->
  </v-container>
</template>

<script lang="ts">
import InfoTooltip from "@/components/commons/InfoTooltip.vue";
import { infoTooltipText } from "@/components/shelter_sustainability/infoTooltipText";
import { ImageShelter, Shelter } from "@/store/ShelterInterface";
import Step1ProjectInformation from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step1ProjectInformation.vue";

import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import Step2Geometry from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step2Geometry.vue";
import Step5EnvironmentalImpact from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step5EnvironmentalImpact.vue";
import Step6TechnicalPerformance from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step6TechnicalPerformance.vue";
import Step7Habitability from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step7Habitability.vue";
import Step9ScoreCard from "@/views/shelter_sustainability/ShelterSustainabilityItem/Step9ScoreCard.vue";
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
}
</script>

<style lang="scss" scoped>
@media print {
  @page {
    size: portrait;
    @top-left {
      content: "WHAT ?";
      height: 1cm;
      padding: 4px;
      margin: 4px;
      color: black;
    }
  }
}
</style>
