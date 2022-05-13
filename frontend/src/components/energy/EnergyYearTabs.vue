<template>
  <v-row>
    <v-col cols="auto">
      <v-tabs v-model="yearTab">
        <v-tab v-for="(year, index) in years" :key="year">
          {{ year }}
          <template v-if="index > 0"
            >&nbsp;<v-edit-dialog>
              <v-icon x-small>mdi-pencil</v-icon>
              <template v-slot:input>
                <v-text-field
                  :value="year"
                  single-line
                  type="number"
                  clearable
                  @change="changeYear(index, $event)"
                  @click:clear="removeYear(index)"
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
        </v-tab>
      </v-tabs>
    </v-col>
    <v-col cols="auto" class="d-flex align-center">
      <v-btn icon @click="addYear()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { cloneDeep, sortBy } from "lodash";
import "vue-class-component/hooks";
import { Component, Prop, PropSync, VModel, Vue } from "vue-property-decorator";

@Component
export default class EnergyYearTabs<T extends YearItem> extends Vue {
  @VModel({ type: Number })
  yearTab!: number;
  @Prop({ type: Number, default: 0 })
  readonly yearOffset!: number;
  @PropSync("items", { type: Array as () => T[] })
  syncedItems!: T[];

  get years(): number[] {
    return this.syncedItems.map((item) => this.yearOffset + item.yearIndex);
  }

  addYear(): void {
    const last = this.syncedItems[this.syncedItems.length - 1];
    const newItem = cloneDeep(last);
    newItem.yearIndex += 1;
    this.syncedItems.push(newItem);
  }

  changeYear(index: number, newValue: number | null): void {
    if (newValue === null) {
      this.removeYear(index);
    } else {
      const newYearIndex = newValue - this.yearOffset;
      if (
        newYearIndex > 0 &&
        this.syncedItems.every((item) => item.yearIndex !== newYearIndex)
      ) {
        this.syncedItems[index].yearIndex = newYearIndex;
        this.syncedItems = sortBy(this.syncedItems, (item) => item.yearIndex);
      }
    }
  }

  removeYear(index: number): void {
    this.syncedItems.splice(index, 1);
    if (this.yearTab === index) {
      this.yearTab -= 1;
    }
  }
}

export interface YearItem {
  yearIndex: number;
}
</script>
