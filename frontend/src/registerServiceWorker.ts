/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "App is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered(registration) {
      // check and refresh SW every 15mn based on
      /// https://medium.com/@dougallrich/give-users-control-over-app-updates-in-vue-cli-3-pwas-20453aedc1f2
      // based on https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/update
      // Improvement: implement with the push API (looks like it's better than setInterval)
      // https://stackoverflow.com/questions/56766093/service-worker-update-while-app-is-in-background
      // https://stackoverflow.com/questions/33816342/how-to-prevent-the-same-service-worker-from-registering-over-multiple-pages
      console.log("Service worker has been registered.");
      setInterval(() => {
        console.log("Registration update check.");
        registration.update();
      }, 1000 * 60 * 15); // e.g. every 15mn checks
    },
    cached() {
      console.log("Content has been cached for offline use.");
    },
    updatefound() {
      console.log("New content is downloading.");
    },
    updated(registration) {
      console.log("New content is available; we're asking you to refresh");
      document.dispatchEvent(
        new CustomEvent("swUpdated", { detail: registration })
      );
      console.log("Old content cached is being cleared with new version");
      caches.keys().then((cs) => cs.forEach((c) => caches.delete(c)));
    },
    offline() {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}
