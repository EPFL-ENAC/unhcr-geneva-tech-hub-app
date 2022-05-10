<template>
  <l-map :center="defaultCoordinates" :zoom="2" :min-zoom="2">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker
      v-for="(coordinate, key) in coordinates"
      :key="key"
      :lat-lng="coordinate"
    ></l-marker>
  </l-map>
</template>

<script lang="ts">
import {
  attributionMap,
  defaultCoordinates,
  defaultZoom,
  urlMap,
} from "@/utils/mapWorld";
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
  readonly coordinates!: number[][];

  readonly url = urlMap;
  readonly attribution = attributionMap;
  readonly zoom = defaultZoom;
  readonly defaultCoordinates = defaultCoordinates;
}
</script>
