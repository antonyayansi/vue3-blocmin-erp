import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";

import { MotionPlugin } from "@vueuse/motion";
import PrimeVue from "primevue/config";
import VueAwesomePaginate from "vue-awesome-paginate";
import ConfirmationService from "primevue/confirmationservice";
import { Kalel } from "./theme/Kalel";

import "./style.css";
import "vue-sonner/style.css";
import "primeicons/primeicons.css";
import "vue-awesome-paginate/dist/style.css";

createApp(App)
  .use(router)
  .use(createPinia())
  .use(MotionPlugin)
  .use(VueAwesomePaginate)
  .use(ConfirmationService)
  .use(PrimeVue, {
    theme: {
      preset: Kalel,
      options: {
        darkModeSelector: ".dark",
      },
    },
  })
  .mount("#app");
