<template>
  <l-map :center="defaultCoordinates" :zoom="zoom">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="defaultCoordinates"></l-marker>
    <l-marker :lat-lng="otherCoordinates"></l-marker>
  </l-map>
</template>

<script lang="ts">
import {
  attributionMap,
  defaultCoordinates,
  defaultZoom,
  urlMap,
} from "@/utils/mapWorld";
import Vue from "vue";
import Component from "vue-class-component";
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
  readonly url = urlMap;
  readonly attribution = attributionMap;
  readonly zoom = defaultZoom;
  readonly defaultCoordinates = defaultCoordinates;

  readonly otherCoordinates = [43, 2];
}
</script>
