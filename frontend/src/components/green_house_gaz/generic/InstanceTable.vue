<template>
  <v-data-table
    v-if="items"
    :headers="tableHeaders"
    :items="items"
    :sort-by="sortBy"
    class="elevation-1"
    :hide-default-footer="true"
    :items-per-page="-1"
  >
    <template #top>
      <v-toolbar v-if="!disabled" flat>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          class="mb-2"
          :disabled="disabled"
          @click="() => openDialog(newDefaultItem(), 'survey-item-dialog')"
        >
          New {{ name }}
        </v-btn>
        <survey-item-dialog
          :dialog-open.sync="dialogs['survey-item-dialog']"
          :item="localItem"
          :headers="headers"
          :reference-items="referenceItems"
          :intervention="intervention"
          :name="name"
          @update:item="updateWithItem"
        />
        <duplicate-survey-item-dialog
          v-if="!intervention"
          :dialog-open.sync="dialogs['duplicate-survey-item-dialog']"
          :name="name"
          @duplicate:item="duplicateItem"
        />
        <delete-survey-item-dialog
          :dialog-open.sync="dialogs['delete-survey-item-dialog']"
          :name="name"
          @delete:item="deleteItem"
        />
      </v-toolbar>
    </template>
    <template
      v-for="(tableHeader, $tableHeaderIndex) in tableHeaders"
      #[`item.${tableHeader.value}`]="{ item }"
    >
      <div
        :key="$tableHeaderIndex"
        :class="
          tableHeader.classFormatter(
            get(item, tableHeader.value),
            tableHeader,
            item
          )
        "
      >
        {{
          tableHeader.formatter(
            get(item, tableHeader.value),
            tableHeader,
            item,
            items
          )
        }}
      </div>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            small
            class="mr-2"
            :disabled="disabled"
            v-on="on"
            @click.stop="() => openDialog(item, 'survey-item-dialog')"
          >
            <v-icon small class="better-click"> $mdiPencil </v-icon>
          </v-btn>
        </template>
        <span>Edit</span>
      </v-tooltip>
      <v-tooltip v-if="!intervention" bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            small
            class="mr-2"
            :disabled="disabled"
            v-on="on"
            @click.stop="() => openDialog(item, 'duplicate-survey-item-dialog')"
          >
            <v-icon small class="better-click"> $mdiContentCopy </v-icon>
          </v-btn>
        </template>
        <span>Duplicate</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            small
            class="mr-2"
            :disabled="disabled"
            v-on="on"
            @click.stop="() => openDialog(item, 'delete-survey-item-dialog')"
          >
            <v-icon small class="better-click"> $mdiDelete </v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>
    </template>
    <template #foot="{}">
      <tr>
        <td
          v-for="(tableHeader, $index) in tableHeaders"
          :key="$index"
          class="items-footer-like-vuetify"
        >
          <span v-if="$index == 0">Total</span>
          <span
            v-else-if="results[tableHeader.key]"
            :class="
              tableHeader.classFormatter(results[tableHeader.key], tableHeader)
            "
          >
            {{ tableHeader.formatter(results[tableHeader.key], tableHeader) }}
          </span>
          <span v-else-if="!tableHeader.hidden"> – </span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { SurveyTableHeader } from "@/components/green_house_gaz/generic/BaselineEndlineWrapper.vue";
import DeleteSurveyItemDialog from "@/components/green_house_gaz/generic/DeleteSurveyItemDialog.vue";
import DuplicateSurveyItemDialog from "@/components/green_house_gaz/generic/DuplicateSurveyItemDialog.vue";
import SurveyItemDialog from "@/components/green_house_gaz/generic/SurveyItemDialog.vue";
import { SurveyItem, SurveyResult } from "@/store/GhgInterface.vue";
import { cloneDeep, get, maxBy } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {
    DeleteSurveyItemDialog,
    SurveyItemDialog,
    DuplicateSurveyItemDialog,
  },
  methods: {
    get,
  },
})
export default class BaselineTable extends Vue {
  @Prop({ type: [Array], default: () => [] })
  readonly items!: SurveyItem[];

  @Prop({ type: [Object], default: () => ({}) })
  readonly results!: SurveyResult;

  @Prop({ type: [Array], default: () => [] })
  readonly referenceItems!: SurveyItem[];

  @Prop({ type: Boolean, default: false })
  readonly intervention!: boolean;

  @Prop({ type: Boolean, default: false })
  readonly disabled!: boolean;

  @Prop([String])
  readonly name!: string;

  @Prop({ type: String, default: "increment" })
  readonly sortBy!: string;

  @Prop([Array])
  readonly headers!: SurveyTableHeader[];

  localItems: SurveyItem[] = [];
  localItem: SurveyItem = {} as SurveyItem;
  dialogs = {} as Record<string, boolean>;

  @Watch("items", { immediate: true, deep: true })
  onItemChange(value: SurveyItem[]): void {
    this.localItems = cloneDeep(value);
  }

  public get tableHeaders(): SurveyTableHeader[] {
    return this.headers.filter(
      (header: SurveyTableHeader) => !header.hideFooterContent
    );
  }

  public get maxItem(): number | undefined {
    return maxBy(this.localItems, function (item) {
      return item.increment;
    })?.increment;
  }

  public newDefaultItem(): SurveyItem {
    return {
      _id: uuidv4(),
      increment: (this.maxItem ?? -1) + 1,
      input: {},
      computed: {},
    };
  }
  public openDialog(item: SurveyItem, dialogName: string): void {
    this.localItem = item;
    Vue.set(this.dialogs, dialogName, true);
  }

  public updateWithItem(value: SurveyItem): void {
    // find real index because array may have been shuffled by something
    // _id is a uuid v4 as string
    const index = this.localItems.findIndex(
      (item: SurveyItem) => item._id === value._id
    );
    const length = this.localItems.length;
    if (index !== -1) {
      this.localItems.splice(index, 1, value);
    } else {
      this.localItems.splice(length, 0, value);
    }
    this.$emit("update:items", this.localItems);
  }
  public duplicateItem(): void {
    const realIndex = this.localItems.findIndex(
      (item: SurveyItem) => item._id === this.localItem?._id
    );
    if (realIndex !== -1 && this.localItem) {
      this.localItems.splice(realIndex, 0, cloneDeep(this.localItem));
      this.localItems.splice(this.localItems.length); // vue trick
      this.$emit("update:items", this.localItems);
    }
  }
  public deleteItem(): void {
    const realIndex = this.localItems.findIndex(
      (item: SurveyItem) => item._id === this.localItem?._id
    );
    if (realIndex !== -1) {
      this.localItems.splice(realIndex, 1);
      this.$emit("update:items", this.localItems);
    }
  }
}
</script>

<style scoped>
.items-footer-like-vuetify {
  font-size: 0.875rem;
  font-weight: bold;
  height: 48px;
  padding: 0 16px;
}
.bold-table-cell-content {
  font-size: 0.875rem;
  font-weight: bold;
}
</style>