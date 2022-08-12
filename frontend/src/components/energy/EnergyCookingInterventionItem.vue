<template>
  <v-card height="100%">
    <v-card-title>
      <slot name="title"></slot>
      <v-spacer></v-spacer>
      <v-btn class="float-right" color="primary" text @click="addItem">
        <v-icon left>$mdiPlusBox</v-icon>
        New intervention
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-expansion-panels multiple>
        <v-expansion-panel
          v-for="(interventionItem, index) in interventions"
          :key="index"
        >
          <v-expansion-panel-header>
            <v-btn
              class="flex-grow-0"
              icon
              @click="
                $event.stopPropagation();
                interventionItem.selected = !interventionItem.selected;
              "
            >
              <v-icon v-if="interventionItem.selected" color="primary">
                $mdiCheckboxMarked
              </v-icon>
              <v-icon v-else>$mdiCheckboxBlankOutline</v-icon>
            </v-btn>
            <span>{{ interventionItem.name }}</span>
            <v-btn
              class="flex-grow-0"
              icon
              @click="
                $event.stopPropagation();
                deleteItem(index);
              "
            >
              <v-icon>$mdiDelete</v-icon>
            </v-btn>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <form-item-component
              v-for="item in formItems"
              :key="item.key"
              v-model="interventionItem[item.key]"
              v-bind="item"
            ></form-item-component>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { FormItem } from "@/components/commons/FormItem";
import FormItemComponent from "@/components/commons/FormItemComponent.vue";
import { ParentIntervention } from "@/models/energyModel";
import { cloneDeep } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class EnergyCookingInterventionItem<
  T extends ParentIntervention
> extends Vue {
  @VModel({
    type: Array as () => T[],
    default: () => [],
  })
  interventions!: T[];
  @Prop({ type: Array as () => FormItem[], default: () => [] })
  formItems!: FormItem[];
  @Prop({ type: Object as () => T })
  defaultItem!: T;

  addItem(): void {
    this.interventions.push(cloneDeep(this.defaultItem));
  }

  deleteItem(index: number): void {
    this.interventions.splice(index, 1);
  }
}
</script>
