<template>
  <main class="green-house-gaz__references">
    THE REFERENCES
  </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("GhgListModule", ["countries"]),
  },

  methods: {
    ...mapActions("GhgListModule", [
      "syncDB",
      "getCountries",
      "addDoc",
      "closeDB",
    ]),
  },
})
/** ProjectList */
export default class ReferencesList extends Vue {

}
</script>
