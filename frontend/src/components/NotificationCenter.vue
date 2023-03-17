<template>
  <v-dialog
    v-model="dialog"
    absolute
    content-class="notification-center"
    temporary
    scrollable
    max-width="540px"
    @click:outside="toggleNotificationCenter"
  >
    <v-card>
      <v-card-title>Notifications to the user</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 70%">
        <!-- format { type, title, message, date } -->
        <v-alert
          v-for="(notification, $index) in notifications"
          :key="$index"
          border="bottom"
          colored-border
          elevation="2"
          :type="notification?.type ?? 'warning'"
        >
          <div v-if="notification.title" class="text-h6">
            {{ notification.title }}
          </div>
          <div v-if="notification.message" class="text-body">
            {{ notification.message }}
          </div>
          <div v-if="notification.date" class="text-caption">
            {{ notification.date | formatDate({ timeStyle: "medium" }) }}
          </div>
          <v-expansion-panels v-if="notification.stack" style="width: 400px">
            <v-expansion-panel>
              <v-expansion-panel-header disable-icon-rotate>
                Error details:
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                {{ notification.stack }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-alert>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="toggleNotificationCenter">
          Close <v-icon>$mdiClose</v-icon>
        </v-btn>
        <v-btn
          color="dark darken-1"
          text
          @click="() => clearNotifications() && toggleNotificationCenter()"
        >
          Clear <v-icon>$mdiTrashCanOutline</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapActions, mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters(["notificationDialog", "notifications"]),
  },
  methods: {
    ...mapActions([
      "toggleNotificationCenter",
      "setNotificationDialog",
      "clearNotifications",
    ]),
  },
})
export default class NotificationCenter extends Vue {
  notificationDialog!: boolean;
  toggleNotificationCenter!: () => Promise<void>;
  setNotificationDialog!: (value: boolean) => void;

  set dialog(value: boolean) {
    this.setNotificationDialog(value);
  }
  get dialog(): boolean {
    return this.notificationDialog;
  }
}
</script>

<style>
.v-dialog__content--active:has(> .notification-center),
.v-dialog__content:has(> .notification-center) {
  justify-content: right;
  align-items: baseline;
  /* top: 32px; */
}
</style>
