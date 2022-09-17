import Vue from "vue";
import App from "./App.vue";
//#region Vuetify
import vuetify from "./helpers/vuetify";
//#endregion
//#region perfect scrollbar
// Perfect Scroll Bar
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
Vue.use(PerfectScrollbar);
//#endregion

// #region Secure LS
import SecureLS from "secure-ls";
const secureLS = new SecureLS({ encodingType: "aes" });
window.secureLS = secureLS;
// #endregion
// Moment for JS Date time
import moment from "moment";
window.moment = moment;
//#region - Sweet Alert
import VueSweetalert2 from "vue-sweetalert2";
Vue.use(VueSweetalert2);
// #endregion
//#region - Router
import router from "./router/router";
//#endregion
//#region - Excel Import
import JsonExcel from "vue-json-excel";
Vue.component("downloadExcel", JsonExcel);
//#endregion

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
