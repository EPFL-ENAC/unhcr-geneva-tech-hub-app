<template>
  <energy-form
    :module.sync="module"
    :initial-module="initialModule"
    :items="items"
    @save="save"
  ></energy-form>
</template>

<script lang="ts">
import FormItemComponent, {
  FormItem,
} from "@/components/commons/FormItemComponent.vue";
import EnergyForm from "@/components/energy/EnergyForm.vue";
import EnergyFormMixin from "@/components/energy/EnergyFormMixin.vue";
import { HouseholdCookingModule } from "@/models/energyModel";
import "vue-class-component/hooks";
import { Component } from "vue-property-decorator";

@Component({
  components: {
    EnergyForm,
    FormItemComponent,
  },
})
export default class EnergyHouseholdCooking extends EnergyFormMixin<HouseholdCookingModule> {
  module: HouseholdCookingModule = this.emptyModule;

  get emptyModule(): HouseholdCookingModule {
    return {};
  }

  get items(): FormItem<keyof HouseholdCookingModule>[][] {
    return [];
  }
}
</script>
