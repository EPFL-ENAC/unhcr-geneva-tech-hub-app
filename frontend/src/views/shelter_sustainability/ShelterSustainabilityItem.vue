<template>
  <v-container fluid class="project">
    <v-tabs
      class="fixed-tabs-bar"
      centered
      grow
      :show-arrows="true"
      elevation="2"
    >
      <template v-for="(item, idx) in menuItems">
        <v-tooltip
          v-if="item.disabled && !!item.tooltipDisabledText"
          :key="idx"
          bottom
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="item.tooltipDisabledText"></span>
          <template v-slot:activator="{ on }">
            <a class="v-tab" v-on="on">
              <!--
              ----  when v-tab disabled, tooltip does not work: wrap inside <a> element
              ----    cf issue: https://github.com/vuetifyjs/vuetify/issues/7077
              --->
              <v-tab ripple :to="{ name: item.to }" :disabled="item.disabled">
                <v-icon left>{{ item.icon }}</v-icon>
                <span>
                  {{ item.text }}
                </span>
              </v-tab>
            </a>
          </template>
        </v-tooltip>
        <v-tab v-else :key="item.to" ripple :to="{ name: item.to }">
          <v-icon left>{{ item.icon }}</v-icon>
          <span>
            {{ item.text }}
          </span>
        </v-tab>
      </template>
    </v-tabs>
    <v-container v-if="shelter.users" fluid>
      <v-form @submit.stop.prevent="">
        <router-view :shelter="shelter" @update:shelter="submitForm" />
      </v-form>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import { Shelter } from "@/store/ShelterInterface";
import { SyncDatabase } from "@/utils/couchdb";
import { Component, Vue } from "vue-property-decorator";
import { Route } from "vue-router";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("ShelterModule", ["db", "shelter"]),
  },
  methods: {
    ...mapActions("ShelterModule", [
      "getDoc",
      "updateDoc",
      "updateLocalDoc",
      "syncDB",
      "closeDB",
    ]),
  },
})
/** ProjectItem */
export default class ProjectItem extends Vue {
  syncDB!: () => null;
  getDoc!: (id: string) => null;
  closeDB!: () => null;
  $route!: Route;
  db!: SyncDatabase<Shelter> | null;
  shelter!: Shelter;
  updateDoc!: (doc: Shelter) => void;
  updateLocalDoc!: (doc: Shelter) => void;

  public get menuItems(): MenuItem[] {
    const scorecardErrorText = !this.shelter?.scorecard_errors?.length
      ? ""
      : this.shelter?.scorecard_errors?.reduce(
          (acc: string, el: string) => `${acc}<li>${el}</li>`
        );
    return [
      {
        icon: "mdi-information",
        text: "About",
        to: "ShelterSustainabilityStep1",
      },
      { icon: "mdi-shape", text: "Geometry", to: "ShelterSustainabilityStep2" },
      {
        icon: "mdi-clipboard-text-multiple",
        text: "Bill of Quantities",
        disabled: !this.shelter.location_country,
        tooltipDisabledText: "Site country is not reference in the about page",
        to: "ShelterSustainabilityStep3",
      },
      {
        icon: "mdi-leaf",
        text: "Environmental Perf",
        disabled: !this.shelter?.envPerfItems?.length,
        tooltipDisabledText:
          "Bill of quantities needed to assess environmental performance",
        to: "ShelterSustainabilityStep5",
      },
      {
        icon: "mdi-poll",
        text: "Technical Perf",
        to: "ShelterSustainabilityStep6",
      },
      {
        icon: "mdi-home",
        text: "Habitability",
        to: "ShelterSustainabilityStep7",
      },
      {
        icon: "mdi-scoreboard",
        disabled: !!this.shelter?.scorecard_errors?.length,
        text: "Scorecard",
        tooltipDisabledText: `Scorecard requires completion of other sections<br/> <br/><ul>${scorecardErrorText}</ul>`,
        to: "ShelterSustainabilityStep9",
      },
    ];
  }

  public submitForm(value: Shelter = this.shelter): void {
    if (this.$can("edit", value)) {
      if (value.name !== "") {
        this.updateDoc(value);
      } else {
        throw new Error("please fill the new Name");
      }
    } else {
      this.$store.dispatch("notifyUser", "You're on read only mode");
      this.updateLocalDoc(value);
    }
  }

  public retrieveData(): void {
    this.getDoc(decodeURIComponent(this.$route.params.id));
  }
  mounted(): void {
    this.syncDB();
    this.retrieveData();

    this.db?.onChange(this.retrieveData);
  }
  destroyed(): void {
    this.closeDB();
  }
}

interface MenuItem {
  text: string;
  icon: string;
  to: string;
  disabled?: boolean;
  tooltipDisabledText?: string;
  children?: MenuItem[];
}
</script>

<style lang="scss" scoped>
a,
a:link,
a:visited,
a:hover,
a:active {
  text-decoration: none;
  color: inherit;
}
</style>

<style lang="scss">
.fixed-tabs-bar {
  position: -webkit-sticky;
  position: sticky;
  top: 3rem; // 16px*3
  z-index: 2;
}
</style>
