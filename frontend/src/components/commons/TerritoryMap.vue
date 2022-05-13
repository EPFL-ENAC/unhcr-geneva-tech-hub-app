<template>
  <l-map :center="defaultCoordinates" :zoom="2" :min-zoom="2" :max-zoom="4">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker
      v-for="(coordinate, key) in coordinates"
      :key="key"
      :lat-lng="coordinate"
      :icon="getIcon('pin', coordinate[2])"
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
import L from "leaflet";
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
  @Prop({ type: Array, required: true, default: () => [] })
  readonly coordinates!: (number | string)[][];
  @Prop({ type: Boolean, default: false })
  readonly customIcon!: boolean;

  readonly url = urlMap;
  readonly attribution = attributionMap;
  readonly zoom = defaultZoom;
  readonly defaultCoordinates = defaultCoordinates;

  alpha = alpha;
  alphaSecondary = alphaSecondary;
  shelterColors = shelterColors;

  shelterIcons = {
    Emergency: "home-variant-outline",
    Transitional: "home-outline",
    Durable: "home",
  };

  public getIcon(defaultIcon: string, shelterType: ShelterType): L.DivIcon {
    let className = `mdi mdi-${defaultIcon}`;
    if (shelterType) {
      className = `mdi mdi-${this.shelterIcons[shelterType]} c-${this.shelterColors[shelterType].name} customIcon`;
    }
    return L.divIcon({
      html: "<i></i>",
      iconSize: [16, 16],
      className: className,
    });
  }
}
</script>

<style scoped>
>>> .customIcon {
  font-size: 16px;
}

>>> .c-blue {
  color: var(--c-blue);
}

>>> .c-brown {
  color: var(--c-brown);
}

>>> .c-grey {
  color: var(--c-grey);
}
</style>
