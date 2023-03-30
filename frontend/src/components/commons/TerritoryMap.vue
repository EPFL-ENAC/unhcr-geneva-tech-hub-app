<template>
  <v-responsive :aspect-ratio="aspectRatio" height="100%">
    <l-map
      :center="defaultCoordinates"
      class="territory"
      :class="{
        'crosshair-cursor-enabled': value.length > 0,
      }"
      style="height: 100%; width: 100%"
      :zoom="defaultZoom"
      :min-zoom="2"
      :max-zoom="16"
      @click="addMarker"
    >
      <l-control-scale :imperial="false" :metric="true"></l-control-scale>
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker
        v-for="(markerCoordinate, key) in internalCoordinates"
        :key="key"
        :lat-lng="getLatLng(markerCoordinate)"
        :icon="getIcon('pin', markerCoordinate[2])"
        @click="() => goToMarker(markerCoordinate[3])"
      >
        <l-tooltip v-if="markerCoordinate[3]">
          {{ markerCoordinate[3].name }}
        </l-tooltip>
      </l-marker>
    </l-map>
  </v-responsive>
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
import {
  LControlScale,
  LIcon,
  LMap,
  LMarker,
  LTileLayer,
  LTooltip,
} from "vue2-leaflet";

@Component({
  components: {
    LMap,
    LControlScale,
    LTileLayer,
    LMarker,
    LTooltip,
    LIcon,
  },
})
export default class TerritoryMap extends Vue {
  @Prop({ type: Array, required: false, default: () => [] })
  readonly coordinates!: (number | string)[][];
  @Prop({ type: [Number, String], default: 1 })
  readonly aspectRatio: number | string | undefined;
  @Prop({ type: Array, required: false, default: () => [] })
  readonly value!: (number | string)[];
  @Prop({ type: Number, required: false, default: defaultZoom })
  readonly defaultZoom!: number;
  @Prop({ type: Number, default: 2 })
  readonly zoom!: number;

  readonly url = urlMap;
  readonly attribution = attributionMap;

  alpha = alpha;
  alphaSecondary = alphaSecondary;
  shelterColors = shelterColors;
  selectedZoomFactor = 5;

  // duplicate of shelterIcons in shelterTypeColors because of $ sign
  shelterIcons = {
    Emergency: "mdiHomeVariantOutline",
    Transitional: "mdiHomeOutline",
    Durable: "mdiHome",
  };

  public getIcon(defaultIcon: string, shelterType: ShelterType): L.DivIcon {
    let className = `customIcon`;
    let iconPath = this.$vuetify.icons.values.mdiPin;
    if (shelterType) {
      className = `c-${this.shelterColors[shelterType].name} customIcon`;
      iconPath = this.$vuetify.icons.values[this.shelterIcons[shelterType]];
    }
    return L.divIcon({
      html:
        `<svg
  version="1.1"
  width="26"
    height="26"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:svg="http://www.w3.org/2000/svg"
>
      <path
      d="` +
        iconPath +
        `"
    />
</svg>`,
      iconSize: [26, 26],
      className,
    });
  }
  public goToMarker(item: unknown): void {
    this.$emit("click:item", item);
  }

  public getLatLng(coordinate: (number | string)[]): LatLng {
    const [lat, lng] = coordinate as number[];
    return new LatLng(lat, lng);
  }
  public get defaultCoordinates(): (number | string)[] {
    if (this.value.length > 0) {
      const [lat, lng] = this.value as (string | number)[];
      if (lat === 0 && lng === 0) {
        return defaultCoordinates;
      }
      // special offset of 5 lng for printing only
      return [parseFloat(lat as string), parseFloat(lng as string) + 5];
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
        parseFloat(latLng.lat.toFixed(3)),
        parseFloat(latLng.lng.toFixed(3)),
      ]);
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep.leaflet-container.crosshair-cursor-enabled {
  cursor: crosshair;
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

::v-deep .customIcon {
  &::before {
    font-size: 24px;
  }
}
::v-deep.leaflet-container.territory {
  z-index: 1;
}
</style>
