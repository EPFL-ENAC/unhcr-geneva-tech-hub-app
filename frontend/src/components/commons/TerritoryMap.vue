<template>
  <l-map
    :center="defaultCoordinates"
    :class="{
      'crosshair-cursor-enabled': value.length > 0,
    }"
    :zoom="defaultZoom"
    :min-zoom="2"
    :max-zoom="8"
    @click="addMarker"
  >
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker
      v-for="(markerCoordinate, key) in internalCoordinates"
      :key="key"
      :lat-lng="markerCoordinate"
      :icon="getIcon('pin', markerCoordinate[2])"
    >
    </l-marker>
  </l-map>
</template>

<script lang="ts">
import { ShelterType } from "@/store/ShelterInterface";
import {
  attributionMap,
  defaultCoordinates,
  defaultZoom,
  urlMap,
} from "@/utils/mapWorld";
import {
  alpha,
  alphaSecondary,
  shelterColors,
} from "@/views/shelter_sustainability/shelterTypeColors";
import L, { LatLng, LeafletMouseEvent } from "leaflet";
import { Component, Prop, Vue } from "vue-property-decorator";
import { LIcon, LMap, LMarker, LTileLayer } from "vue2-leaflet";

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
  },
})
export default class TerritoryMap extends Vue {
  @Prop({ type: Array, required: false, default: () => [] })
  readonly coordinates!: (number | string)[][];
  @Prop({ type: Array, required: false, default: () => [] })
  readonly value!: (number | string)[];
  @Prop({ type: Number, required: false, default: defaultZoom })
  readonly defaultZoom!: number;

  readonly url = urlMap;
  readonly attribution = attributionMap;

  alpha = alpha;
  alphaSecondary = alphaSecondary;
  shelterColors = shelterColors;

  shelterIcons = {
    Emergency: "home-variant-outline",
    Transitional: "home-outline",
    Durable: "home",
  };

  public getIcon(defaultIcon: string, shelterType: ShelterType): L.DivIcon {
    let className = `mdi mdi-${defaultIcon} customIcon`;
    if (shelterType) {
      className = `mdi mdi-${this.shelterIcons[shelterType]} c-${this.shelterColors[shelterType].name} customIcon`;
    }
    return L.divIcon({
      html: "<i></i>",
      iconSize: [26, 26],
      className: className,
    });
  }

  public get defaultCoordinates(): (number | string)[] {
    if (this.value.length > 0) {
      return this.value;
    }
    return defaultCoordinates;
  }
  public get internalCoordinates(): (number | string)[][] {
    if (this.value.length > 0) {
      return this.coordinates.concat([this.value]);
    }
    return this.coordinates;
  }

  public addMarker(event: LeafletMouseEvent): void {
    if (this.value.length > 0) {
      const latLng: LatLng = event.latlng;
      this.$emit("update:value", [
        latLng.lat.toFixed(3),
        latLng.lng.toFixed(3),
      ]);
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.leaflet-container.crosshair-cursor-enabled {
  cursor: crosshair;
}
// /* Change cursor when mousing over clickable layer */
// ::v-deep.leaflet-clickable {
//   cursor: pointer !important;
// }
// /* Change cursor when over entire map */
// ::v-deep.leaflet-container {
//   cursor: crosshair !important;
// }
::v-deep .customIcon {
  &::before {
    font-size: 24px;
  }
}

::v-deep .c-blue {
  color: var(--c-blue);
}

::v-deep .c-brown {
  color: var(--c-brown);
}

::v-deep .c-grey {
  color: var(--c-grey);
}
</style>
