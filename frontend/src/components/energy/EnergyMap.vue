<template>
  <territory-map
    :coordinates="markers"
    :default-zoom="zoom"
    :value="center"
    :aspect-ratio="aspectRatio"
    @update:value="updateLatLng"
  />
</template>

<script lang="ts">
import TerritoryMap from "@/components/commons/TerritoryMap.vue";
import { attributionMap, urlMap } from "@/utils/mapWorld";
import { LatLngExpression, LatLngTuple } from "leaflet";
import "vue-class-component/hooks";
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
  components: {
    TerritoryMap,
  },
})
export default class EnergyMap extends Vue {
  readonly url = urlMap;
  readonly attribution = attributionMap;

  @Prop([Number, String])
  readonly aspectRatio: number | string | undefined;
  @Prop({ type: Array as () => LatLngExpression[], default: () => [] })
  readonly markers!: LatLngExpression[];
  @Prop({ type: Number, default: 2 })
  readonly zoom!: number;

  get center(): LatLngExpression | undefined {
    if (this.markers.length === 1) {
      return this.markers[0];
    }
    return [0, 0] as LatLngTuple;
  }

  public updateLatLng(latLng: number[]): void {
    this.$emit("update:value", latLng);
  }
}
</script>

<style lang="scss" scoped>
.leaflet-container {
  z-index: 0;
}
</style>
