<template>
  <v-row v-if="items.length > 0">
    <v-col>
      <v-row v-for="(rowItem, index) in items" :key="index">
        <template v-for="(item, index2) in rowItem">
          <v-col
            v-if="!item.hidden"
            :key="`${index}:${index2}`"
            cols="12"
            sm="6"
            md="4"
            lg="3"
            xl="2"
          >
            <form-item-component
              v-model="module[item.key]"
              v-bind="item"
            ></form-item-component>
          </v-col>
        </template>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import FormItemComponent, {
  FormItem,
} from "@/components/commons/FormItemComponent.vue";
import "vue-class-component/hooks";
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component({
  components: {
    FormItemComponent,
  },
})
export default class EnergyFormRow<M> extends Vue {
  @VModel({ type: Object as () => M })
  module!: M;
  @Prop({ type: Array as () => FormItem<keyof M>[][], default: () => [] })
  readonly items!: FormItem<keyof M>[][];
}
</script>
